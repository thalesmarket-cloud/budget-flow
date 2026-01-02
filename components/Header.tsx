
import React from 'react';
import { 
  Download, 
  Sun, 
  Moon, 
  RotateCcw, 
  RotateCw,
  FileBarChart,
  Grid3X3,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDark: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showGrid: boolean;
  onToggleGrid: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  onToggleDark, 
  onExport, 
  onUndo, 
  onRedo,
  canUndo,
  canRedo,
  showGrid,
  onToggleGrid
}) => {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-6 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
          <FileBarChart size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-lg font-black text-gray-900 dark:text-white leading-none tracking-tight">BudgetFlow</h1>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Marketing Architect</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 p-1 rounded-lg mr-2">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className="p-1.5 rounded hover:bg-white dark:hover:bg-gray-600 disabled:opacity-30 transition-all text-gray-600 dark:text-gray-300"
            title="Annuler"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={onRedo} 
            disabled={!canRedo}
            className="p-1.5 rounded hover:bg-white dark:hover:bg-gray-600 disabled:opacity-30 transition-all text-gray-600 dark:text-gray-300"
            title="Rétablir"
          >
            <RotateCw size={18} />
          </button>
        </div>

        <button 
          onClick={onToggleGrid}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 border ${showGrid ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
          title="Afficher/Masquer la grille"
        >
          <Grid3X3 size={20} />
          <span className="text-xs font-bold uppercase tracking-tight hidden sm:inline">Grid</span>
        </button>

        <button 
          onClick={onToggleDark}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent"
          title={isDarkMode ? "Mode Clair" : "Mode Sombre"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button 
          onClick={onExport}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 group relative"
        >
          <Download size={18} />
          <span>Export PNG HD</span>
          <div className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
