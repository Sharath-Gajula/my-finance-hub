import { useCallback, useMemo } from 'react';
import { GridLayout, useContainerWidth, LayoutItem, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { Widget } from '@/types/widget';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetCard } from './WidgetCard';
import { WidgetTable } from './WidgetTable';
import { WidgetChart } from './WidgetChart';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardGridProps {
  onAddWidget: () => void;
}

export function DashboardGrid({ onAddWidget }: DashboardGridProps) {
  const { width, containerRef, mounted } = useContainerWidth({ initialWidth: 1200 });
  const widgets = useDashboardStore((s) => s.widgets);
  const updateAllLayouts = useDashboardStore((s) => s.updateAllLayouts);
  
  const layout: Layout = useMemo(() => widgets.map((widget): LayoutItem => ({
    i: widget.id,
    x: widget.layout.x,
    y: widget.layout.y,
    w: widget.layout.w,
    h: widget.layout.h,
    minW: widget.layout.minW,
    minH: widget.layout.minH,
    maxW: widget.layout.maxW,
    maxH: widget.layout.maxH,
  })), [widgets]);
  
  const handleLayoutChange = useCallback((newLayout: Layout) => {
    const mappedLayouts = newLayout.map((l) => ({
      i: l.i,
      x: l.x,
      y: l.y,
      w: l.w,
      h: l.h,
    }));
    updateAllLayouts(mappedLayouts);
  }, [updateAllLayouts]);
  
  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'card':
        return <WidgetCard widget={widget} />;
      case 'table':
        return <WidgetTable widget={widget} />;
      case 'chart':
        return <WidgetChart widget={widget} />;
      default:
        return null;
    }
  };
  
  if (widgets.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
            <Plus className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Dashboard is Empty</h2>
            <p className="text-muted-foreground max-w-md">
              Start by adding widgets to track your favorite stocks, view price charts, and monitor market data.
            </p>
          </div>
          <Button size="lg" onClick={onAddWidget} className="gap-2">
            <Plus className="w-5 h-5" />
            Add Your First Widget
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className="flex-1 p-4 overflow-auto">
      {mounted && (
        <GridLayout
          className="layout"
          layout={layout}
          width={width - 32}
          gridConfig={{
            cols: 12,
            rowHeight: 80,
            margin: [16, 16],
            containerPadding: [0, 0],
            maxRows: Infinity,
          }}
          dragConfig={{
            enabled: true,
            bounded: false,
            handle: '.widget-drag-handle',
            threshold: 3,
          }}
          resizeConfig={{
            enabled: true,
            handles: ['se'],
          }}
          onLayoutChange={handleLayoutChange}
          autoSize={true}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="animate-scale-in">
              {renderWidget(widget)}
            </div>
          ))}
        </GridLayout>
      )}
    </div>
  );
}
