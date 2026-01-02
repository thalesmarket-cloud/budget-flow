
import React, { useRef } from 'react';
import { Node } from 'reactflow';
import { Trash2, Palette, Image as ImageIcon, Upload, X } from 'lucide-react';
import { NodeData, TableRow } from '../types';

interface PropertiesPanelProps {
  node: Node;
  onUpdate: (id: string, data: Partial<NodeData>) => void;
  onDelete: (id: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ node, onUpdate, onDelete }) => {
  const data = node.data as NodeData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = e.target.type === 'number' ? parseFloat(value) : value;
    onUpdate(node.id, { [name]: finalValue });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(node.id, { imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onUpdate(node.id, { imageUrl: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTableUpdate = (index: number, field: keyof TableRow, value: string) => {
    const newTableData = [...(data.tableData || [])];
    newTableData[index] = { ...newTableData[index], [field]: value };
    onUpdate(node.id, { tableData: newTableData });
  };

  const addTableRow = () => {
    const newTableData = [...(data.tableData || []), { metric: 'Nouvelle Métrique', value: '0' }];
    onUpdate(node.id, { tableData: newTableData });
  };

  const colors = [
    { name: 'Bleu Marque', class: 'bg-brand-blue' },
    { name: 'Indigo', class: 'bg-indigo-600' },
    { name: 'Vert', class: 'bg-emerald-600' },
    { name: 'Ambre', class: 'bg-amber-600' },
    { name: 'Rose', class: 'bg-rose-600' },
    { name: 'Ardoise', class: 'bg-slate-600' },
  ];

  const isDestination = node.type === 'destination' || node.data.label?.toLowerCase().includes('page') || node.data.label?.toLowerCase().includes('form');

  return (
    <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex flex-col gap-6 overflow-y-auto z-10 shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Propriétés</h2>
        <button 
          onClick={() => onDelete(node.id)}
          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
          title="Supprimer le bloc"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Libellé</label>
          <input 
            type="text" 
            name="label"
            value={data.label || ''}
            onChange={handleInputChange}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none transition-all"
          />
        </div>

        {(node.type === 'budget' || node.type === 'channel' || node.type === 'destination') && (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget (MAD)</label>
            <input 
              type="number" 
              name="value"
              value={data.value ?? 0}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-black text-brand-blue focus:ring-2 focus:ring-brand-blue outline-none transition-all"
            />
          </div>
        )}

        {isDestination && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ImageIcon size={14} /> Aperçu Visuel
             </label>
             {data.imageUrl ? (
               <div className="relative group">
                 <img src={data.imageUrl} className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm" alt="Preview" />
                 <button 
                   onClick={removeImage}
                   className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <X size={14} />
                 </button>
               </div>
             ) : (
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="w-full h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-400"
               >
                 <Upload size={20} />
                 <span className="text-[10px] font-black uppercase">Uploader image</span>
               </button>
             )}
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleImageUpload} 
               accept="image/*" 
               className="hidden" 
             />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Allocation (%)</label>
              <input 
                type="number" 
                name="percentage"
                value={data.percentage ?? 0}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-black focus:ring-2 focus:ring-brand-blue outline-none transition-all"
              />
            </div>
          </div>
        )}

        {node.type === 'table' && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center justify-between">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Métriques</label>
               <button onClick={addTableRow} className="text-[10px] font-black uppercase bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-lg hover:bg-brand-blue/20 transition-colors">Ajouter</button>
             </div>
             <div className="space-y-2">
                {data.tableData?.map((row, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={row.metric}
                      onChange={(e) => handleTableUpdate(idx, 'metric', e.target.value)}
                      placeholder="Nom"
                      className="w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-[11px] font-bold"
                    />
                    <input 
                      type="text" 
                      value={row.value}
                      onChange={(e) => handleTableUpdate(idx, 'value', e.target.value)}
                      placeholder="Valeur"
                      className="w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-[11px] font-black text-brand-blue"
                    />
                  </div>
                ))}
             </div>
          </div>
        )}

        <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Palette size={14} /> Couleur de fond
          </label>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((c) => (
              <button 
                key={c.name}
                onClick={() => onUpdate(node.id, { color: c.class })}
                className={`w-9 h-9 rounded-xl ${c.class} ring-offset-2 dark:ring-offset-slate-900 transition-all ${data.color === c.class ? 'ring-4 ring-brand-blue scale-110' : 'hover:scale-105 shadow-sm'}`}
                title={c.name}
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notes & Stratégie</label>
          <textarea 
            name="notes"
            value={data.notes || ''}
            onChange={handleInputChange}
            placeholder="Écrivez vos observations ici..."
            className="w-full h-24 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-brand-blue outline-none transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
