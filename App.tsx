
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import ReactFlow, { 
  addEdge, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  MarkerType
} from 'reactflow';
import { toPng } from 'html-to-image';

import BudgetNode from './components/BudgetNode';
import TableNode from './components/TableNode';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import Header from './components/Header';
import { NodeData, NodeType } from './types';

const nodeTypes = {
  budget: BudgetNode,
  channel: BudgetNode,
  destination: BudgetNode,
  table: TableNode,
  note: BudgetNode,
  leads: BudgetNode,
  action: BudgetNode,
};

// EDGE CONFIG (RED as requested)
const RED_COLOR = '#ff0000';

const defaultEdgeOptions = {
  animated: false,
  style: { stroke: RED_COLOR, strokeWidth: 3.5 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: RED_COLOR,
    width: 25,
    height: 25,
  },
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'budget',
    data: { label: 'Budget Global', value: 10000, color: 'bg-brand-blue' },
    position: { x: 350, y: 0 },
  },
  {
    id: '2',
    type: 'channel',
    data: { label: 'Google Ads', value: 3000, color: 'bg-brand-blue' },
    position: { x: 50, y: 150 },
  },
  {
    id: '3',
    type: 'channel',
    data: { label: 'Meta Ads', value: 3000, color: 'bg-brand-blue' },
    position: { x: 350, y: 150 },
  },
  {
    id: '4',
    type: 'channel',
    data: { label: 'LinkedIn Ads', value: 4000, color: 'bg-brand-blue' },
    position: { x: 650, y: 150 },
  },
  {
    id: '5',
    type: 'destination',
    data: { 
      label: 'Landing Page', 
      percentage: 70, 
      value: 7000, 
      description: 'Optimisation du taux de conversion (CRO)',
      color: 'bg-brand-blue',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    },
    position: { x: 150, y: 350 },
  },
  {
    id: '6',
    type: 'destination',
    data: { 
      label: 'Formulaires', 
      percentage: 30, 
      value: 3000, 
      description: 'Qualification des leads entrants',
      color: 'bg-brand-blue',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    },
    position: { x: 550, y: 350 },
  },
  {
    id: '7',
    type: 'leads',
    data: { label: 'LEADS GÉNÉRÉS', color: 'bg-brand-blue' },
    position: { x: 350, y: 550 },
  },
  // NOUVELLES ÉTAPES POST-LEAD
  {
    id: '8',
    type: 'action',
    data: { label: 'Réception CRM', notes: 'Attribution automatique au commercial libre', color: 'bg-brand-blue' },
    position: { x: 350, y: 720 },
  },
  {
    id: '9',
    type: 'action',
    data: { label: 'Appel Commercial < 24h', notes: 'Taux de conversion x7 si appelé dans l\'heure', color: 'bg-brand-blue' },
    position: { x: 350, y: 880 },
  },
  {
    id: '10',
    type: 'action',
    data: { label: 'Nurturing Email', notes: 'Relance J+2 si inatteignable au téléphone', color: 'bg-brand-blue' },
    position: { x: 650, y: 880 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
  { id: 'e2-5', source: '2', target: '5' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e2-6', source: '2', target: '6' },
  { id: 'e3-6', source: '3', target: '6' },
  { id: 'e4-6', source: '4', target: '6' },
  { id: 'e5-7', source: '5', target: '7' },
  { id: 'e6-7', source: '6', target: '7' },
  // LIAISONS POST-LEAD
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
  { id: 'e9-10', source: '9', target: '10', animated: true },
].map(edge => ({ ...edge, ...defaultEdgeOptions }));

const FlowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    setHistory([{ nodes: initialNodes, edges: initialEdges }]);
    setHistoryIndex(0);
  }, []);

  const saveToHistory = useCallback((n: Node[], e: Edge[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, { nodes: [...n], edges: [...e] }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setNodes(prev.nodes);
      setEdges(prev.edges);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setNodes(next.nodes);
      setEdges(next.edges);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge({ ...params, ...defaultEdgeOptions }, edges);
      setEdges(newEdges);
      saveToHistory(nodes, newEdges);
    },
    [nodes, edges, setEdges, saveToHistory]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  const handleUpdateNode = useCallback((id: string, updatedData: Partial<NodeData>) => {
    setNodes((nds) => {
      let nextNodes = nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...updatedData } };
        }
        return node;
      });

      if (id === '1' && updatedData.value !== undefined) {
        const newGlobal = updatedData.value;
        nextNodes = nextNodes.map(node => {
          if (node.type === 'destination' && node.data.percentage) {
            return {
              ...node,
              data: { ...node.data, value: (node.data.percentage / 100) * newGlobal }
            };
          }
          return node;
        });
      }
      
      const globalNode = nextNodes.find(n => n.id === '1');
      const globalValue = globalNode?.data.value || 0;
      if (updatedData.percentage !== undefined) {
        nextNodes = nextNodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: { ...node.data, value: (updatedData.percentage! / 100) * globalValue }
            };
          }
          return node;
        });
      }

      return nextNodes;
    });
  }, [setNodes]);

  const nodesWithCallback = useMemo(() => {
    return nodes.map(n => ({
      ...n,
      data: { ...n.data, onUpdate: handleUpdateNode }
    }));
  }, [nodes, handleUpdateNode]);

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const addNode = (type: NodeType) => {
    const id = `${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        label: type === 'leads' ? 'Leads' : type === 'action' ? 'Action Commerciale' : `Nouveau ${type}`, 
        value: 0, 
        color: 'bg-brand-blue',
        tableData: type === 'table' ? [{ metric: 'CPC', value: '$1.00' }] : undefined
      },
    };
    const nextNodes = [...nodes, newNode];
    setNodes(nextNodes);
    saveToHistory(nextNodes, edges);
  };

  const deleteNode = (id: string) => {
    const nextNodes = nodes.filter(n => n.id !== id);
    const nextEdges = edges.filter(e => e.source !== id && e.target !== id);
    setNodes(nextNodes);
    setEdges(nextEdges);
    setSelectedNodeId(null);
    saveToHistory(nextNodes, nextEdges);
  };

  const exportAsImage = () => {
    if (reactFlowWrapper.current === null) return;
    
    // Capture ultra HD
    const flowContainer = reactFlowWrapper.current.querySelector('.react-flow') as HTMLElement;
    if (!flowContainer) return;

    toPng(flowContainer, {
      cacheBust: true,
      pixelRatio: 4, 
      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
      style: {
        backgroundImage: showGrid 
          ? (isDarkMode ? 'radial-gradient(#374151 1.5px, transparent 1.5px)' : 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)') 
          : 'none',
        backgroundSize: '24px 24px',
      },
      filter: (node: HTMLElement) => {
        const classesToHide = [
          'react-flow__controls', 
          'react-flow__minimap', 
          'react-flow__attribution',
          'react-flow__panel'
        ];
        return !classesToHide.some(cls => node.classList?.contains(cls));
      }
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `marketing-architect-hd.png`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('Export failed', err);
    });
  };

  return (
    <div className={`flex flex-col h-full w-full ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header 
        isDarkMode={isDarkMode} 
        onToggleDark={() => setIsDarkMode(!isDarkMode)} 
        onExport={exportAsImage}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onAddNode={addNode} />
        
        <div className={`flex-1 relative transition-colors duration-300 ${showGrid ? 'bg-dots-pattern' : 'bg-white dark:bg-slate-950'}`} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodesWithCallback}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
          >
            <Controls />
            <MiniMap 
              nodeColor={() => '#5170ff'} 
              style={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff' }}
            />
          </ReactFlow>
        </div>

        {selectedNode && (
          <PropertiesPanel 
            node={selectedNode} 
            onUpdate={handleUpdateNode} 
            onDelete={deleteNode}
          />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
};

export default App;
