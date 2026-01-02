
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../types';
import { Table as TableIcon } from 'lucide-react';

const TableNode: React.FC<NodeProps<NodeData>> = ({ data, selected }) => {
  return (
    <div className={`
      relative px-0 py-0 shadow-2xl rounded-2xl border-2 transition-all duration-200 overflow-hidden
      ${selected ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-transparent'}
      bg-white dark:bg-slate-900 min-w-[260px]
    `}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-brand-blue border-2 border-white" />
      
      <div className="bg-brand-blue px-5 py-3 border-b border-white/10 flex items-center gap-3">
        <TableIcon size={18} className="text-white" />
        <h3 className="text-sm font-black uppercase tracking-wider text-white">
          {data.label}
        </h3>
      </div>

      <div className="p-1">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black">
            <tr>
              <th className="px-4 py-3 font-bold">Métrique</th>
              <th className="px-4 py-3 font-bold">Valeur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.tableData?.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-tighter text-[11px]">{row.metric}</td>
                <td className="px-4 py-3 text-brand-blue dark:text-indigo-400 font-black text-sm">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-brand-blue border-2 border-white" />
    </div>
  );
};

export default memo(TableNode);
