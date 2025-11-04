"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodeModal from '@/components/app/tree/NodeModal';
import TreeNode from '@/components/app/tree/TreeNode';
import { useParams } from 'next/navigation';
import { type Node, type Tree } from '@/app/generated/prisma/client';
import { GetTreeByHashResponse, GetNodeByHashResponse } from '@/lib/validation_schemas';

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

const horizontalSpacing = 200;
const verticalSpacing = 100;

const generateNodesAndEdges = (treeData: GetTreeByHashResponse) => {
  const flowNodes: FlowNode[] = [];
  const flowEdges: FlowEdge[] = [];
  
  // First pass: count nodes per level
  const nodesPerLevel: Map<number, number> = new Map();
  const countNodesPerLevel = (node: GetNodeByHashResponse, level: number) => {
    nodesPerLevel.set(level, (nodesPerLevel.get(level) || 0) + 1);
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        countNodesPerLevel(child as GetNodeByHashResponse, level + 1);
      });
    }
  };

  // Track position index per level for horizontal placement
  const levelIndexes: Map<number, number> = new Map();

  // Helper function to process node and its children recursively
  const processNode = (node: GetNodeByHashResponse, level: number) => {
    // Get current index for this level
    const currentIndex = levelIndexes.get(level) || 0;
    levelIndexes.set(level, currentIndex + 1);

    // Get total nodes at this level
    const totalNodesAtLevel = nodesPerLevel.get(level) || 1;

    // Calculate position - distribute nodes evenly across the level
    const x = (currentIndex - (totalNodesAtLevel - 1) / 2) * horizontalSpacing;
    const y = -level * verticalSpacing;

    // Add node
    flowNodes.push({
      id: node.id.toString(),
      position: { x, y },
      data: node
    });

    // Process children and add edges
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        // Add edge from this node to child
        flowEdges.push({
          id: `${node.id}-${child.id}`,
          source: node.id.toString(),
          target: child.id.toString(),
        });

        // Process child node recursively
        processNode(child as GetNodeByHashResponse, level + 1);
      });
    }
  };

  // Process root nodes (API now returns array of root nodes with nested children)
  if (treeData.nodes && treeData.nodes.length > 0) {
    // First count all nodes per level for all root nodes
    treeData.nodes.forEach(rootNode => {
      countNodesPerLevel(rootNode, 0);
    });
    
    // Then position all root nodes and their descendants
    treeData.nodes.forEach(rootNode => {
      processNode(rootNode, 0);
    });
  }

  return { nodes: flowNodes, edges: flowEdges };
};

export default function App() {
  const params = useParams();
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define custom node types - TreeNode is the default for all nodes
  const nodeTypes = useMemo(() => ({ default: TreeNode }), []);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await fetch(`/api/trees/${params.treeHash}`);
        if (!res.ok) {
          throw new Error('Failed to fetch tree data');
        }
        const treeData: GetTreeByHashResponse = await res.json();
        const { nodes: flowNodes, edges: flowEdges } = generateNodesAndEdges(treeData);
        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [params.treeHash]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
    setSelectedNode(node.data);
  }, []);

  const onNodeHover = useCallback((event: React.MouseEvent | null, node: any | null) => {
    if (node) {
      // You can add hover effects here if needed
    }
  }, []);

  const onNewNode = (newNode: Node) => {
    // Instead of refetching, insert the new node into existing structure
    // Find parent in current nodes and recalculate layout
    
    // Find the parent node in the flow
    const parentFlowNode = nodes.find(n => n.id === newNode.parentId?.toString());
    if (!parentFlowNode) {
      console.error('Parent node not found, refetching entire tree');
      // Fallback: refetch if we can't find parent
      refetchTree();
      return;
    }

    // Get the parent's level by counting ancestors
    const getNodeLevel = (nodeId: string): number => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node || !node.data.parentId) return 0;
      return getNodeLevel(node.data.parentId.toString()) + 1;
    };
    
    const newLevel = getNodeLevel(newNode.parentId!.toString()) + 1;

    // Count current nodes at the new level
    const nodesAtNewLevel = nodes.filter(n => {
      const level = getNodeLevel(n.id);
      return level === newLevel;
    }).length;

    // Calculate position for the new node
    // We need to recalculate all nodes at this level to maintain spacing
    const currentIndex = nodesAtNewLevel;
    const totalNodesAtLevel = nodesAtNewLevel + 1;
    
    const x = (currentIndex - (totalNodesAtLevel - 1) / 2) * horizontalSpacing;
    const y = -newLevel * verticalSpacing;

    // Create new flow node
    const newFlowNode: FlowNode = {
      id: newNode.id.toString(),
      position: { x, y },
      data: { ...newNode, children: [], flashcards: [] } as any
    };

    // Create new edge from parent to new node
    const newFlowEdge: FlowEdge = {
      id: `${newNode.parentId}-${newNode.id}`,
      source: newNode.parentId!.toString(),
      target: newNode.id.toString()
    };

    // Reposition existing nodes at the same level to maintain even spacing
    const updatedNodes = nodes.map(node => {
      const nodeLevel = getNodeLevel(node.id);
      if (nodeLevel === newLevel) {
        const currentNodes = nodes.filter(n => getNodeLevel(n.id) === newLevel);
        const index = currentNodes.findIndex(n => n.id === node.id);
        const newX = (index - totalNodesAtLevel / 2 + 0.5) * horizontalSpacing;
        return { ...node, position: { ...node.position, x: newX } };
      }
      return node;
    });

    // Update state with new node and repositioned existing nodes
    setNodes([...updatedNodes, newFlowNode]);
    setEdges([...edges, newFlowEdge]);
  };

  // Helper function to refetch tree (fallback)
  const refetchTree = async () => {
    try {
      const res = await fetch(`/api/trees/${params.treeHash}`);
      if (!res.ok) {
        throw new Error('Failed to fetch tree data');
      }
      const treeData: GetTreeByHashResponse = await res.json();
      const { nodes: flowNodes, edges: flowEdges } = generateNodesAndEdges(treeData);
      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (err) {
      console.error('Error refreshing tree:', err);
    }
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