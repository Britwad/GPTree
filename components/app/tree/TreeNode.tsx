import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { type Node as PrismaNode } from '@prisma/client';
import { colors } from '@/lib/colors';

function TreeNode({ data, onClick }: NodeProps & { onClick?: (node: PrismaNode) => void }) {
  const nodeData = data as PrismaNode;

  return (
    <>
      <div
        onClick={() => onClick?.(nodeData)}
        className="w-24 h-16 flex items-center justify-center rounded-md shadow-md transition-colors text-center px-2 text-xs cursor-pointer overflow-hidden"
        style={{
          backgroundColor: colors.white,
          borderWidth: '2px',
          borderColor: colors.lightGray,
          color: colors.darkGray,
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.green}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.lightGray}
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
