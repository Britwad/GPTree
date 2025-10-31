import Modal from 'react-modal';
import { type Node } from '@/app/generated/prisma/client';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)'
  }
};

// Set the app element for accessibility - will be set when component mounts
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CreateNode } from '@/lib/validation_schemas';
import { on } from 'events';

const NodeModal = ({ isOpen, node, onClose, onNewNode }: {
  isOpen: boolean;
  node: Node
  onClose: () => void;
  onNewNode: (newNode: Node) => void;
}) => {
  const { data: session } = useSession();

  const [prompt, setPrompt] = useState<string>("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('body');
    }
  }, []);
  if (!node) return null;

  const onSubmit = async () => {
    const body: CreateNode = {
      question: prompt,
      userId: session?.user?.id || "",
      treeId: node.treeId,
      parentId: node.id,
    }

    const res = await fetch("/api/nodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      // setError((data && data.error) || "Unknown error");
      // setLoading(false);
      return;
    }
    onClose();
    onNewNode(data);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={`Node: ${node.question}`}
    >
      <div>
        <h2 className="text-xl font-bold mb-4">{node.question}</h2>
        <div className="mb-4">
          <p>Node ID: {node.id}</p>
          <p>Question: {node.question}</p>
          {/* Add more node-specific content here */}
        </div>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What do you want to learn about?"
          className="w-96 border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-gray-300 focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Go
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default NodeModal;