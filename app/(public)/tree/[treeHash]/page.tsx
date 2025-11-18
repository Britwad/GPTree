"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodeModal from '@/components/app/tree/NodeModal';
import TreeNode from '@/components/app/tree/TreeNode';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { type Node, type Tree } from '@/app/generated/prisma/client';
import { generateNode } from '@/frontend_helpers/node_helpers';
import { CreateNode, GetNodesSchema, NodeSchema } from '@/lib/validation_schemas';
import { JSONParser, ParsedElementInfo } from "@streamparser/json-whatwg"
import { set } from 'zod';

interface FlowNode {
  id: string;
  position: XYPosition;
  data: Node;
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

type StreamingNode = {
  question: string;
  userId?: string;
  treeId?: number;
  parentId?: number | null;
  content: string;
  followups?: string[];
  isOpen: boolean;
}

const horizontalSpacing = 100;
const verticalSpacing = 100;

const generateNodesAndEdges = (nodesList: Node[]) => {
  const flowNodes: FlowNode[] = [];
  const flowEdges: FlowEdge[] = [];
  
  if (!nodesList || nodesList.length === 0) {
    return { nodes: flowNodes, edges: flowEdges };
  }

  // Find root node (first node or node without parentId)
  const rootNode = nodesList[0].parentId === null ? nodesList[0] : nodesList.find(n => n.parentId === null);
  
  // If no root node found, return empty
  if (!rootNode) {
    console.error('No root node found');
    return { nodes: flowNodes, edges: flowEdges };
  }

  // Build children map for quick lookup
  const childrenMap = new Map<number, Node[]>();
  nodesList.forEach(node => {
    if (node.parentId !== null) {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, []);
      }
      childrenMap.get(node.parentId)!.push(node);
    }
  });

  // Sort children by createdAt to maintain consistent left-to-right order
  childrenMap.forEach(children => {
    children.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return aTime - bTime;
    });
  });

  // Track horizontal position counter as we traverse
  let currentX = 0;

  // Recursive depth-first traversal (left to right)
  const traverse = (node: Node, level: number): number => {
    const children = childrenMap.get(node.id) || [];
    
    if (children.length === 0) {
      // Leaf node: assign current position and increment
      const x = currentX * horizontalSpacing;
      const y = -level * verticalSpacing;
      
      flowNodes.push({
        id: node.id.toString(),
        position: { x, y },
        data: node
      });
      
      currentX++;
      return x;
    } else {
      // Internal node: traverse children first, then position this node at their center
      const childPositions: number[] = [];
      
      children.forEach(child => {
        // Add edge from this node to child
        flowEdges.push({
          id: `${node.id}-${child.id}`,
          source: node.id.toString(),
          target: child.id.toString(),
        });
        
        // Traverse child and get its x position
        const childX = traverse(child, level + 1);
        childPositions.push(childX);
      });
      
      // Position this node at the center of its children
      const x = (childPositions[0] + childPositions[childPositions.length - 1]) / 2;
      const y = -level * verticalSpacing;
      
      flowNodes.push({
        id: node.id.toString(),
        position: { x, y },
        data: node
      });
      
      return x;
    }
  };

  // Start traversal from root
  traverse(rootNode, 0);

  return { nodes: flowNodes, edges: flowEdges };
};

export default function App() {
  const params = useParams();
  const { data: session } = useSession();
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamingNode, setStreamingNode] = useState<StreamingNode | null>(null);
  const [root, setRoot] = useState<boolean>(false);
  const [streamingIsOpen, setStreamingIsOpen] = useState<boolean>(false);

  // Define custom node types - TreeNode is the default for all nodes
  const nodeTypes = useMemo(() => ({ default: TreeNode }), []);

  // Fetch tree data effect
  useEffect(() => {
    const fetchTree = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`/api/nodes?treeHash=${params.treeHash}&userId=${session.user.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch tree data');
        }
        const data = await res.json();
        // Before we generate the graph, we make sure there are nodes
        // and make a root if needed
        if (!data.nodes || data.nodes.length === 0) {
          // We need to tell React to stream the root node
          setRoot(true);
          setStreamingIsOpen(true);
          return;
        }
        const { nodes: flowNodes, edges: flowEdges } = generateNodesAndEdges(data.nodes);
        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [params.treeHash, session?.user?.id, root]);

  // Stream node effect
  useEffect(() => {
    const doStream = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      // Check if we're already streaming
      if (!streamingIsOpen) {
        return;
      }

      try {
          // We should have a selected node unless we're creating a root
          let body: CreateNode = {
            question: streamingNode ? streamingNode.question : "",
            userId: session.user.id,
            treeId: streamingNode && streamingNode.treeId ? streamingNode.treeId : 0,
            parentId: streamingNode && streamingNode.parentId ? streamingNode.parentId : null,
          };

          // Check if we're creating a root node
          if (root) {
            // We need the tree ID to create the root node
            const treeRes = await fetch(`/api/trees/${params.treeHash}`);
            if (!treeRes.ok) {
              throw new Error('Failed to fetch tree info for root node creation');
            }
            const treeData = await treeRes.json()

            // Now we can create the node body
            body = {
              question: treeData.name,
              userId: session.user.id,
              treeId: treeData.id,
              parentId: null,
            };
          }

          // We need to set up a JSON parser to handle the streaming response
          const stream = await generateNode(body);
          const parser = new JSONParser({emitPartialValues: true, emitPartialTokens: true});
          const reader = stream.body?.pipeThrough(parser).getReader();
          if (!reader) {
            throw new Error('Failed to get reader for root node stream');
          }
          
          // Then we can start reading from the stream
          const newNode: StreamingNode = {
            question: body.question,
            content: "",
            followups: [],
            isOpen: true,
          }
          setStreamingNode(newNode);
          await streamNode(reader);
          
          // Now we need to handle some post-stream tasks
          await onStreamFinish();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setStreamingIsOpen(false);
        setLoading(false);
        setRoot(false);
      }
    };

    doStream();
  }, [streamingIsOpen]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
    setSelectedNode(node.data);
  }, []);

  const onNodeHover = useCallback((event: React.MouseEvent | null, node: FlowNode | null) => {
    if (node) {
      // You can add hover effects here if needed
    }
  }, []);

  const onNewNode = (newNode: CreateNode) => {
    // We need to tell React we're streaming a new node
    setStreamingNode({
      question: newNode.question,
      userId: newNode.userId,
      treeId: newNode.treeId,
      parentId: newNode.parentId,
      content: "",
      followups: [],
      isOpen: true
      });
    setStreamingIsOpen(true);
  };

  /**
   * This method is called when the streaming of a node ends, it should only be called
   * after the streaming is finished. It will get the node that was created and add it to the
   * existing list of nodes, regenerating the layout.
   * @throws Error if fetching the latest node fails
   */
  const onStreamFinish = async () => {
    // Fetch the latest node that was created
    const node_res = await fetch(`/api/trees/${params.treeHash}/latest_node`);
    if (!node_res.ok) {
      throw new Error('Failed to fetch latest node after streaming');
    }
    const node_data = await node_res.json();
    const newNode = NodeSchema.parse(node_data.node);
    setSelectedNode(newNode);
      
    // Add the new node to the existing flat list and regenerate layout
    const currentNodesData = nodes.map(n => n.data);
    const updatedNodesList = [...currentNodesData, newNode];
    
    const { nodes: flowNodes, edges: flowEdges } = generateNodesAndEdges(updatedNodesList);
    setNodes(flowNodes);
    setEdges(flowEdges);

    // Sanity check on these values, though they should be set already
    setStreamingNode(null);
    setStreamingIsOpen(false);
  }

  return (
    <div className="w-full h-full">
      <style jsx global>{`
        .react-flow__node {
          padding: 0;
          border: none;
          background: transparent;
          box-shadow: none;
          width: fit-content;
          height: fit-content;
        }
        .react-flow__node.selected {
          box-shadow: none;
        }
      `}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeHover}
        onNodeMouseLeave={(event) => onNodeHover(null, null)}
        nodesDraggable={false}
        panOnScroll={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        fitView
        style={{ background: 'white' }}
      />
      {(selectedNode || streamingIsOpen) && <NodeModal
        onClose={() => {
          setSelectedNode(null);
        }}
        node={selectedNode}
        onNewNode={onNewNode}
        streamingQuestion={streamingNode?.question}
        streamingContent={streamingNode?.content}
        streamingFollowups={streamingNode?.followups}
        streamingIsOpen={streamingNode?.isOpen}
      />}
    </div>
  );

  /**
   * This method takes care of reading from a ReadableStream returned by the backend
   * and turning into text for our nodes
   * @param reader a ReadableStream that has a stream of content for a node being generated
   * that was returned by a call to the api/nodes/ POST route
   */
  async function streamNode(reader: ReadableStreamDefaultReader) {
    while (true) {
      // We read a chunk and then turn it into text from bytes with a TextDecoder
      const { done, value } = await reader.read();
      if (done) {
        break;
      };
      console.log("Received chunk:", value);

      setStreamingNode(prev => {
        // Make sure the key is valid
        if (!value.key || !prev) return prev;

        // Now we have to extract the content from the parsed JSON chunk
        // If we got a chunk with content, we append it
        const newContent = value.key === "content" ? value.value : prev!.content;
        // If we got a number, it's an index into the followups array
        if (typeof value.key === "number") {
          // If the index is greater than the number of followups we have,
          // it means we need to add the next one
          if (value.key === prev!.followups?.length) {
            prev!.followups?.push(value.followup || "");
          } else {
            // Otherwise, we are updating an existing followup
            prev!.followups![value.key] += value.value || "";  // Note to self, if there are weird bugs, check if mutation is going wrong here(?)
          }
        }

        return {
        question: prev!.question,
        content: newContent,
        followups: prev!.followups,
        isOpen: true}
      });
    }
  }
}