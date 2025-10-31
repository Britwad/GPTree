"use client";

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodeModal from '@/components/app/tree/NodeModal';
import { useParams } from 'next/navigation';
import { type Node, type Tree } from '@/app/generated/prisma/client';
import { GetTreeByHashResponse, GetNodeByHashResponse } from '@/lib/validation_schemas';

interface FlowNode {
  id: string;
  position: XYPosition
  data: Node;
}

interface FlowEdge {  
  id: string;
  source: string;
  target: string;
}

const generateNodesAndEdges = (treeData: GetTreeByHashResponse) => {
  const flowNodes: FlowNode[] = [];
  const flowEdges: FlowEdge[] = [];

  // Helper function to process node and its children recursively
  const processNode = (node: GetNodeByHashResponse, level: number, index: number, siblingCount: number) => {
    const horizontalSpacing = 200;
    const verticalSpacing = 100;
    
    // Calculate position - center the node among its siblings
    const x = (index - (siblingCount - 1) / 2) * horizontalSpacing;
    const y = level * verticalSpacing;

    // Add node
    flowNodes.push({
      id: node.id.toString(),
      position: { x, y },
      data: node
    });

    // Process children and add edges
    if (node.children && node.children.length > 0) {
      node.children.forEach((child, childIndex) => {
        // Add edge from this node to child
        flowEdges.push({
          id: `${node.id}-${child.id}`,
          source: node.id.toString(),
          target: child.id.toString(),
        });

        // Process child node recursively
        processNode(child as GetNodeByHashResponse, level + 1, childIndex, node.children.length);
      });
    }
  };

  // Find and process root node (node without parent)
  const rootNode = treeData.nodes.find(node => !node.parentId);
  if (rootNode) {
    processNode(rootNode, 0, 0, 1);
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
    // Find parent node to determine position
    const parentNode = nodes.find(n => n.id === newNode.parentId?.toString());
    if (!parentNode) return;

    // Get current siblings of the new node
    const siblings = nodes.filter(n => n.data.parentId === newNode.parentId);
    
    // Calculate position relative to parent
    const horizontalSpacing = 200;
    const verticalSpacing = 100;
    
    // Position new node below parent and to the right of existing siblings
    const x = parentNode.position.x + (siblings.length * horizontalSpacing);
    const y = parentNode.position.y + verticalSpacing;

    // Create new flow node
    const newFlowNode: FlowNode = {
      id: newNode.id.toString(),
      position: { x, y },
      data: newNode
    };

    // Create new edge from parent to new node
    const newFlowEdge: FlowEdge = {
      id: `${parentNode.id}-${newNode.id}`,
      source: parentNode.id,
      target: newNode.id.toString()
    };

    // Update state
    setNodes(nodes => [...nodes, newFlowNode]);
    setEdges(edges => [...edges, newFlowEdge]);
  }
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeHover}
        onNodeMouseLeave={(event) => onNodeHover(null, null)}
        nodesDraggable={false}
        fitView
      />
      <NodeModal 
        isOpen={!!selectedNode}
        onClose={() => {
          setSelectedNode(null);
        }}
        node={selectedNode}
        onNewNode = {onNewNode}
      />
    </div>
  );
}