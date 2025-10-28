import Modal from 'react-modal';

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: {
    id: string;
    data: {
      label: string;
      [key: string]: any;
    };
  } | null;
}

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
import { useEffect } from 'react';

export function NodeModal({ isOpen, onClose, node }: NodeModalProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('body');
    }
  }, []);
  if (!node) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={`Node: ${node.data.label}`}
    >
      <div>
        <h2 className="text-xl font-bold mb-4">{node.data.label}</h2>
        <div className="mb-4">
          <p>Node ID: {node.id}</p>
          {/* Add more node-specific content here */}
        </div>
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
