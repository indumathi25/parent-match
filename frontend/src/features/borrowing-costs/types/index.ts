export interface DataPoint {
  period: string;
  value: number;
  unit: string;
}
export interface MainChartProps {
  data: Array<DataPoint>;
}

export type StatusVariant = 'loading' | 'error' | 'empty';

export interface StatusDisplayProps {
  variant: StatusVariant;
  onSync?: () => void;
  isSyncing?: boolean;
}