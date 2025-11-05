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
    padding: '0',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    backgroundColor: 'white',
    border: 'none'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)'
  }
};

// Set the app element for accessibility - will be set when component mounts
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CreateNode } from '@/lib/validation_schemas';

const NodeModal = ({ isOpen=true, node, onClose, onNewNode }: {
  isOpen?: boolean;
  node: Node
  onClose: () => void;
  onNewNode: (newNode: Node) => void;
}) => {
  const { data: session } = useSession();

  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!node) return null;

  const onSubmit = async () => {
    setIsLoading(true);
    try {
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
        return;
      }
      onClose();
      onNewNode(data);
    } finally {
      setIsLoading(false);
    }
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
      appElement={typeof window !== 'undefined' ? document.body : undefined}
    >
      <div className="bg-white border-2 border-black rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">{node.question}</h2>
        <div className="mb-4">
          <p className="text-gray-900">Node ID: {node.id}</p>
          <p className="text-gray-900">Question: {node.question}</p>
          {/* Add more node-specific content here */}
        </div>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="What do you want to learn about?"
          disabled={isLoading}
          className="w-96 border-2 border-gray-400 rounded-lg px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Go'}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default NodeModal;