import { StockData, ChartDataPoint } from '@/types/widget';

// Generate realistic mock stock data
export function generateMockStockData(symbol: string): StockData {
  const basePrice = getBasePrice(symbol);
  const volatility = 0.02;
  const change = (Math.random() - 0.5) * basePrice * volatility * 2;
  const price = basePrice + change;
  
  return {
    symbol,
    name: getCompanyName(symbol),
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(((change / basePrice) * 100).toFixed(2)),
    open: Number((basePrice * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
    high: Number((price * (1 + Math.random() * 0.02)).toFixed(2)),
    low: Number((price * (1 - Math.random() * 0.02)).toFixed(2)),
    volume: Math.floor(Math.random() * 50000000) + 10000000,
    marketCap: Math.floor(basePrice * (Math.random() * 100 + 50) * 1e9),
    pe: Number((Math.random() * 40 + 10).toFixed(2)),
    week52High: Number((price * (1 + Math.random() * 0.3)).toFixed(2)),
    week52Low: Number((price * (1 - Math.random() * 0.2)).toFixed(2)),
  };
}

export function generateMockChartData(symbol: string, points: number = 30): ChartDataPoint[] {
  const basePrice = getBasePrice(symbol);
  const data: ChartDataPoint[] = [];
  let currentPrice = basePrice;
  
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMinutes(date.getMinutes() - i * 5);
    
    // Random walk with mean reversion
    const change = (Math.random() - 0.5) * basePrice * 0.005;
    const reversion = (basePrice - currentPrice) * 0.02;
    currentPrice += change + reversion;
    
    data.push({
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      price: Number(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }
  
  return data;
}

export function generateMockTableData(count: number = 10): StockData[] {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'V', 'WMT', 'NFLX', 'DIS'];
  return symbols.slice(0, count).map(generateMockStockData);
}

function getBasePrice(symbol: string): number {
  const prices: Record<string, number> = {
    AAPL: 178.50,
    GOOGL: 141.25,
    MSFT: 378.90,
    AMZN: 178.35,
    TSLA: 248.75,
    META: 505.60,
    NVDA: 875.40,
    JPM: 195.80,
    V: 275.50,
    WMT: 165.30,
    NFLX: 485.20,
    DIS: 112.45,
  };
  return prices[symbol] || 100 + Math.random() * 200;
}

function getCompanyName(symbol: string): string {
  const names: Record<string, string> = {
    AAPL: 'Apple Inc.',
    GOOGL: 'Alphabet Inc.',
    MSFT: 'Microsoft Corporation',
    AMZN: 'Amazon.com Inc.',
    TSLA: 'Tesla Inc.',
    META: 'Meta Platforms Inc.',
    NVDA: 'NVIDIA Corporation',
    JPM: 'JPMorgan Chase & Co.',
    V: 'Visa Inc.',
    WMT: 'Walmart Inc.',
    NFLX: 'Netflix Inc.',
    DIS: 'Walt Disney Co.',
  };
  return names[symbol] || `${symbol} Corporation`;
}

export function formatNumber(num: number): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

export function formatPercent(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}
