"use client";

import { useState, useCallback } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NodeModal } from "@/components/app/tree/NodeModal";

// Mock conversation data
const mockConversations = [
  {
    id: "c1",
    title: "Conversation 1",
    messages: [
      { sender: "user", text: "Hi" },
      { sender: "bot", text: "Hello!" },
      { sender: "user", text: "How are you?" },
    ],
  },
  {
    id: "c2",
    title: "Conversation 2",
    messages: [
      { sender: "user", text: "I need help with a topic" },
      { sender: "bot", text: "What is the topic?" },
      { sender: "user", text: "Matrix Multiplication"},
      { sender: "bot", text: "Would you like a conceptual explination or some concret examples?"}
    ],
  },
];

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [conversations] = useState(mockConversations);
  const [activeConv, setActiveConv] = useState(mockConversations[0]);

  const onNodesChange = useCallback((changes: any) => {
    const nonPositionChanges = changes.filter((change: any) => change.type !== "position");
    setNodes((nodesSnapshot) => applyNodeChanges(nonPositionChanges, nodesSnapshot));
  }, []);

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "250px 1fr 400px",
        height: "100vh",
      }}
    >
      {/* Left Panel: Conversations */}
      <div style={{ borderRight: "1px solid #ccc", overflowY: "auto", padding: 10 }}>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveConv(conv)}
            style={{
              padding: 10,
              marginBottom: 5,
              cursor: "pointer",
              backgroundColor: conv.id === activeConv.id ? "#eef" : "transparent",
              borderRadius: 5,
            }}
          >
            {conv.title}
          </div>
        ))}
      </div>

      {/* Middle Panel: Active Conversation */}
      <div style={{ padding: 16, overflowY: "auto", borderRight: "1px solid #ccc" }}>
        {activeConv.messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              backgroundColor: msg.sender === "user" ? "#daf1fc" : "#eee",
              margin: "5px 0",
              padding: 8,
              borderRadius: 10,
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Right Panel: Tree */}
      <div style={{ width: "100%", height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodesDraggable={false}
          fitView
        />
        <NodeModal
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          node={selectedNode}
        />
      </div>
    </div>
  );
}
