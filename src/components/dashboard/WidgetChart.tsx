import { Widget } from '@/types/widget';
import { useChartData, useStockData } from '@/hooks/useStockData';
import { formatCurrency, formatPercent } from '@/lib/mockData';
import { TrendingUp, TrendingDown, RefreshCw, X, GripVertical, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface WidgetChartProps {
  widget: Widget;
}

export function WidgetChart({ widget }: WidgetChartProps) {
  const { data: chartData, loading, error, refetch, lastFetched } = useChartData(
    widget.symbol,
    widget.refreshInterval
  );
  const { data: stockData } = useStockData(widget.symbol, 0);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  
  const isPositive = stockData?.change && stockData.change >= 0;
  const minPrice = chartData ? Math.min(...chartData.map((d) => d.price)) * 0.999 : 0;
  const maxPrice = chartData ? Math.max(...chartData.map((d) => d.price)) * 1.001 : 100;
  
  return (
    <div className="h-full flex flex-col glass-card rounded-xl overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-muted-foreground widget-drag-handle opacity-0 group-hover:opacity-100 transition-opacity" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{widget.symbol}</h3>
              {stockData && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                    isPositive 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="font-mono">{formatPercent(stockData.changePercent)}</span>
                </div>
              )}
            </div>
            {stockData && (
              <span className="text-xs text-muted-foreground">{stockData.name}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {stockData && (
            <span className="font-mono font-bold text-lg">
              {formatCurrency(stockData.price)}
            </span>
          )}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => removeWidget(widget.id)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Chart Content */}
      <div className="flex-1 p-2 min-h-0">
        {loading && !chartData ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-full h-full bg-muted rounded animate-pulse" />
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Retry
            </Button>
          </div>
        ) : chartData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                formatter={(value: number) => [formatCurrency(value), 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth={2}
                fill={`url(#gradient-${widget.id})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))",
                  strokeWidth: 2,
                  stroke: 'hsl(var(--card))',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </div>
      
      {/* Footer */}
      {lastFetched && (
        <div className="px-4 py-2 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-subtle" />
          <span>Updated {new Date(lastFetched).toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
}
