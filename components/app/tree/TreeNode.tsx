import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { type Node as PrismaNode } from '@/app/generated/prisma/client';

function TreeNode({ data, onClick }: NodeProps & { onClick?: (node: PrismaNode) => void }) {
  const nodeData = data as PrismaNode;

  return (
    <>
      <div
        onClick={() => onClick?.(nodeData)}
        className="w-24 h-16 flex items-center justify-center bg-white border-2 border-gray-300 rounded-md shadow-md hover:border-blue-500 transition-colors text-center px-2 text-xs cursor-pointer overflow-hidden"
      >
        <span className="line-clamp-3 break-words overflow-wrap-anywhere">
          {nodeData.name}
        </span>
      </div>

      <Handle type="target" position={Position.Bottom} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Top} className="!bg-transparent !border-0" />
    </>
  );
}

export default memo(TreeNode);
