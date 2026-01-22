// Widget Data Model
export type WidgetType = 'card' | 'table' | 'chart';

export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  symbol: string;
  apiUrl: string;
  refreshInterval: number; // in seconds
  selectedFields: string[];
  layout: WidgetLayout;
  createdAt: number;
  lastUpdated?: number;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  week52High?: number;
  week52Low?: number;
}

export interface ChartDataPoint {
  time: string;
  price: number;
  volume?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetched?: number;
}

export interface DashboardConfig {
  widgets: Widget[];
  version: string;
  exportedAt: number;
}

export const DEFAULT_WIDGET_SIZES: Record<WidgetType, Partial<WidgetLayout>> = {
  card: { w: 3, h: 2, minW: 2, minH: 2 },
  table: { w: 6, h: 4, minW: 4, minH: 3 },
  chart: { w: 6, h: 4, minW: 4, minH: 3 },
};

export const AVAILABLE_FIELDS: Record<WidgetType, string[]> = {
  card: ['symbol', 'name', 'price', 'change', 'changePercent', 'volume'],
  table: ['symbol', 'name', 'price', 'change', 'changePercent', 'open', 'high', 'low', 'volume', 'marketCap'],
  chart: ['price', 'volume'],
};

export const POPULAR_SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'DIS', name: 'Walt Disney Co.' },
];
