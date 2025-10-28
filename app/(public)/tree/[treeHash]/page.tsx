"use client";

import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeModal } from '@/components/app/tree/NodeModal';
 
const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
 
export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
 
  const onNodesChange = useCallback(
    (changes: any) => {
      // Filter out position changes to prevent node movement
      const nonPositionChanges = changes.filter((change: any) => change.type !== 'position');
      return setNodes((nodesSnapshot) => applyNodeChanges(nonPositionChanges, nodesSnapshot));
    },
    [],
  );
  
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, []);

  const onNodeHover = useCallback((event: React.MouseEvent | null, node: any | null) => {
    if (node) {
      // You can add hover effects here if needed
    }
  }, []);
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
      />
    </div>
  );
}