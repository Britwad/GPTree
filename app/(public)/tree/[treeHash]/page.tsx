"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodeModal from '@/components/app/tree/NodeModal';
import TreeNode from '@/components/app/tree/TreeNode';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { type Node, type Tree } from '@/app/generated/prisma/client';

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
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define custom node types - TreeNode is the default for all nodes
  const nodeTypes = useMemo(() => ({ default: TreeNode }), []);

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
  }, [params.treeHash, session?.user?.id]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
    setSelectedNode(node.data);
  }, []);

  const onNodeHover = useCallback((event: React.MouseEvent | null, node: any | null) => {
    if (node) {
      // You can add hover effects here if needed
    }
  }, []);

  const onNewNode = (newNode: Node) => {
    // Add the new node to the existing flat list and regenerate layout
    const currentNodesData = nodes.map(n => n.data);
    const updatedNodesList = [...currentNodesData, newNode];
    
    const { nodes: flowNodes, edges: flowEdges } = generateNodesAndEdges(updatedNodesList);
    setNodes(flowNodes);
    setEdges(flowEdges);
  };

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
      {selectedNode && <NodeModal
        onClose={() => {
          setSelectedNode(null);
        }}
        node={selectedNode}
        onNewNode={onNewNode}
      />}
    </div>
  );
}