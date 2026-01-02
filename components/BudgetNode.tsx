
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../types';
import { Percent, Image as ImageIcon, CheckCircle2, Phone, Database, Mail, ArrowRight } from 'lucide-react';

const BudgetNode: React.FC<NodeProps<NodeData>> = ({ type, data, selected }) => {
  const isGlobal = data.label === 'Budget Global';
  const isLeads = type === 'leads' || data.label?.toLowerCase().includes('lead');
  const isAction = type === 'action';
  const isDestination = !!data.percentage || data.label?.toLowerCase().includes('page') || data.label?.toLowerCase().includes('form');

  // Helper pour choisir l'icône d'action
  const getActionIcon = () => {
    const label = data.label?.toLowerCase() || '';
    if (label.includes('appel') || label.includes('téléphone') || label.includes('call')) return <Phone size={24} />;
    if (label.includes('crm') || label.includes('base') || label.includes('donnée')) return <Database size={24} />;
    if (label.includes('email') || label.includes('mail') || label.includes('newsletter')) return <Mail size={24} />;
    return <ArrowRight size={24} />;
  };

  if (isLeads || isAction) {
    return (
      <div className={`
        relative shadow-2xl rounded-2xl border-2 transition-all duration-300 overflow-hidden
        ${selected ? 'border-white ring-4 ring-white/30 scale-105' : 'border-transparent'}
        bg-brand-blue flex flex-col items-center justify-center p-8 min-w-[220px]
      `}>
        <Handle type="target" position={Position.Top} className="!w-4 !h-4 !bg-white border-2 border-brand-blue !z-10" />
        
        <div className={`w-14 h-14 bg-white rounded-full flex items-center justify-center text-brand-blue mb-4 shadow-xl ${isAction ? 'animate-bounce' : ''}`}>
          {isLeads ? <CheckCircle2 size={30} /> : getActionIcon()}
        </div>
        
        <h3 className="text-sm font-black text-white uppercase tracking-widest text-center max-w-[180px]">
          {data.label}
        </h3>
        
        <div className="mt-2 text-[10px] font-bold text-blue-100 uppercase tracking-tighter opacity-80">
          {isLeads ? 'Conversion Marketing' : 'Processus Commercial'}
        </div>

        {data.notes && (
          <div className="mt-4 p-3 bg-white/10 rounded-xl text-[11px] text-white text-center italic border border-white/10 w-full">
            "{data.notes}"
          </div>
        )}
        
        <Handle type="source" position={Position.Bottom} className="!w-4 !h-4 !bg-white border-2 border-brand-blue !z-10" />
      </div>
    );
  }

  return (
    <div className={`
      relative shadow-2xl rounded-2xl border-2 transition-all duration-300 overflow-hidden
      ${selected ? 'border-white ring-4 ring-white/30 scale-105' : 'border-transparent'}
      bg-brand-blue min-w-[260px] max-w-[320px]
    `}>
      <Handle type="target" position={Position.Top} className="!w-4 !h-4 !bg-white border-2 border-brand-blue !z-10" />
      
      {data.imageUrl && (
        <div className="w-full h-40 bg-black/20 overflow-hidden border-b border-white/10 relative group">
          <img 
            src={data.imageUrl} 
            alt={data.label} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 text-white text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md bg-white/20 px-2 py-1 rounded">
             <ImageIcon size={10} />
             PREVIEW
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 p-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 opacity-70">
            {isGlobal ? 'Source Budget' : isDestination ? 'Conversion' : 'Canal'}
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
        </div>

        <h3 className="text-lg font-black text-white truncate leading-tight">{data.label}</h3>
        
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white tracking-tighter">
            {data.value?.toLocaleString() || '0'}
          </span>
          <span className="text-xs font-bold text-blue-100 uppercase">MAD</span>
        </div>

        {isDestination && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-2 text-white font-black text-sm bg-white/20 px-3 py-1.5 rounded-lg border border-white/10">
                 <Percent size={14} className="text-white" />
                 <span>{data.percentage}%</span>
               </div>
               <span className="text-[10px] text-blue-100 font-bold uppercase tracking-wider italic">allocation</span>
            </div>
            {data.description && (
              <p className="text-[11px] leading-relaxed text-blue-50 font-medium">
                {data.description}
              </p>
            )}
          </div>
        )}

        {data.notes && (
          <div className="mt-4 p-3 bg-black/10 rounded-xl border border-white/5 text-[11px] text-blue-50 leading-relaxed italic">
            "{data.notes}"
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-4 !h-4 !bg-white border-2 border-brand-blue !z-10" />
    </div>
  );
};

export default memo(BudgetNode);
