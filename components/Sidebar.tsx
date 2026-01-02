
import React from 'react';
import { 
  PlusSquare, 
  Layers, 
  MessageSquare, 
  Table as TableIcon,
  Target,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { NodeType } from '../types';

interface SidebarProps {
  onAddNode: (type: NodeType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {
  const tools = [
    { type: 'channel' as NodeType, icon: <Layers size={18} />, label: 'Canal Pub', color: 'text-green-500' },
    { type: 'destination' as NodeType, icon: <Target size={18} />, label: 'Destination', color: 'text-amber-500' },
    { type: 'leads' as NodeType, icon: <CheckCircle2 size={18} />, label: 'Cible Leads', color: 'text-indigo-500' },
    { type: 'action' as NodeType, icon: <Zap size={18} />, label: 'Action Suivi', color: 'text-rose-500' },
    { type: 'table' as NodeType, icon: <TableIcon size={18} />, label: 'Tableau Métriques', color: 'text-purple-500' },
    { type: 'note' as NodeType, icon: <MessageSquare size={18} />, label: 'Notes Libres', color: 'text-blue-500' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 flex flex-col gap-6 z-10 shadow-sm">
      <div>
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Bibliothèque</h2>
        <div className="grid grid-cols-1 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.label}
              onClick={() => onAddNode(tool.type)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-brand-blue dark:hover:border-brand-blue hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group text-left shadow-sm hover:shadow-md"
            >
              <span className={`${tool.color} group-hover:scale-110 transition-transform`}>
                {tool.icon}
              </span>
              <span className="text-xs font-black uppercase tracking-tight text-slate-700 dark:text-slate-200">
                {tool.label}
              </span>
              <PlusSquare size={14} className="ml-auto text-slate-300 group-hover:text-brand-blue" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
          <h4 className="text-[10px] font-black text-brand-blue uppercase mb-2">Conseil Expert</h4>
          <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
            Connectez vos leads à un bloc "Appel Commercial" pour visualiser l'effort de vente nécessaire.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
