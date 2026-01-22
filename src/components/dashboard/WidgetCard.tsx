import { Widget } from '@/types/widget';
import { useStockData } from '@/hooks/useStockData';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/mockData';
import { TrendingUp, TrendingDown, RefreshCw, X, GripVertical, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';

interface WidgetCardProps {
  widget: Widget;
}

export function WidgetCard({ widget }: WidgetCardProps) {
  const { data, loading, error, refetch, lastFetched } = useStockData(
    widget.symbol,
    widget.refreshInterval
  );
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  
  const isPositive = data?.change && data.change >= 0;
  
  return (
    <div className="h-full flex flex-col glass-card rounded-xl overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground widget-drag-handle opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-semibold text-sm truncate">{widget.title}</h3>
        </div>
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
      
      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        {loading && !data ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 bg-muted rounded w-24" />
            <div className="h-6 bg-muted rounded w-16" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Retry
            </Button>
          </div>
        ) : data ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono tracking-tight">
                {formatCurrency(data.price)}
              </span>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full",
                  isPositive 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span className="font-mono">{formatPercent(data.changePercent)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-mono font-medium text-foreground">{data.symbol}</span>
              <span className="truncate">{data.name}</span>
            </div>
            
            {widget.selectedFields.includes('volume') && (
              <div className="pt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="opacity-70">Vol: </span>
                  <span className="font-mono">{formatNumber(data.volume)}</span>
                </div>
                <div>
                  <span className="opacity-70">H: </span>
                  <span className="font-mono">{formatCurrency(data.high)}</span>
                </div>
                <div>
                  <span className="opacity-70">L: </span>
                  <span className="font-mono">{formatCurrency(data.low)}</span>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
      
      {/* Footer with last updated */}
      {lastFetched && (
        <div className="px-4 py-2 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-subtle" />
          <span>
            Updated {new Date(lastFetched).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}
