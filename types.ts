
export type NodeType = 'budget' | 'channel' | 'destination' | 'table' | 'note' | 'leads' | 'action';

export interface TableRow {
  metric: string;
  value: string;
}

export interface NodeData {
  label: string;
  value?: number;
  percentage?: number;
  description?: string;
  color?: string;
  imageUrl?: string;
  tableData?: TableRow[];
  notes?: string;
  onUpdate?: (id: string, data: Partial<NodeData>) => void;
}

export interface BudgetState {
  globalBudget: number;
}
