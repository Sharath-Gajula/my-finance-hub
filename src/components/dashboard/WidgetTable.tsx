import { useState } from 'react';
import { Widget } from '@/types/widget';
import { useTableData } from '@/hooks/useStockData';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/mockData';
import { TrendingUp, TrendingDown, RefreshCw, X, GripVertical, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WidgetTableProps {
  widget: Widget;
}

const ITEMS_PER_PAGE = 5;

export function WidgetTable({ widget }: WidgetTableProps) {
  const { data, loading, error, refetch, lastFetched } = useTableData(widget.refreshInterval);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const [page, setPage] = useState(0);
  
  const totalPages = data ? Math.ceil(data.length / ITEMS_PER_PAGE) : 0;
  const paginatedData = data?.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  
  return (
    <div className="h-full flex flex-col glass-card rounded-xl overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 flex-shrink-0">
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
      <div className="flex-1 overflow-auto">
        {loading && !data ? (
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center p-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Retry
            </Button>
          </div>
        ) : paginatedData ? (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="font-semibold">Symbol</TableHead>
                <TableHead className="text-right font-semibold">Price</TableHead>
                <TableHead className="text-right font-semibold">Change</TableHead>
                {widget.selectedFields.includes('volume') && (
                  <TableHead className="text-right font-semibold hidden sm:table-cell">Volume</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((stock) => {
                const isPositive = stock.change >= 0;
                return (
                  <TableRow key={stock.symbol} className="border-border/50 hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-mono font-semibold text-sm">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {stock.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(stock.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                        )}
                        <span
                          className={cn(
                            "font-mono text-sm",
                            isPositive ? "text-success" : "text-destructive"
                          )}
                        >
                          {formatPercent(stock.changePercent)}
                        </span>
                      </div>
                    </TableCell>
                    {widget.selectedFields.includes('volume') && (
                      <TableCell className="text-right font-mono text-sm text-muted-foreground hidden sm:table-cell">
                        {formatNumber(stock.volume)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : null}
      </div>
      
      {/* Footer with pagination */}
      <div className="px-4 py-2 border-t border-border/50 flex items-center justify-between flex-shrink-0">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          {lastFetched && (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-subtle" />
              <span>Updated {new Date(lastFetched).toLocaleTimeString()}</span>
            </>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
