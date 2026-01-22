import { useState } from 'react';
import { WidgetType, DEFAULT_WIDGET_SIZES, POPULAR_SYMBOLS, AVAILABLE_FIELDS } from '@/types/widget';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Table2, LineChart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddWidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WIDGET_TYPES: { type: WidgetType; label: string; icon: typeof CreditCard; description: string }[] = [
  { type: 'card', label: 'Finance Card', icon: CreditCard, description: 'Price, change, and key metrics' },
  { type: 'table', label: 'Stock Table', icon: Table2, description: 'Paginated list of stocks' },
  { type: 'chart', label: 'Price Chart', icon: LineChart, description: 'Real-time price visualization' },
];

const REFRESH_OPTIONS = [
  { value: '10', label: '10 seconds' },
  { value: '30', label: '30 seconds' },
  { value: '60', label: '1 minute' },
  { value: '300', label: '5 minutes' },
  { value: '0', label: 'Manual only' },
];

export function AddWidgetModal({ open, onOpenChange }: AddWidgetModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<WidgetType>('card');
  const [title, setTitle] = useState('');
  const [symbol, setSymbol] = useState('AAPL');
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [selectedFields, setSelectedFields] = useState<string[]>(['price', 'change', 'changePercent']);
  
  const addWidget = useDashboardStore((s) => s.addWidget);
  const widgets = useDashboardStore((s) => s.widgets);
  
  const handleTypeSelect = (type: WidgetType) => {
    setSelectedType(type);
    // Set default fields for the type
    const defaultFields = AVAILABLE_FIELDS[type].slice(0, 4);
    setSelectedFields(defaultFields);
    setStep(2);
  };
  
  const handleSubmit = () => {
    const defaultLayout = DEFAULT_WIDGET_SIZES[selectedType];
    
    // Calculate position to avoid overlap
    const maxY = widgets.reduce((max, w) => Math.max(max, w.layout.y + w.layout.h), 0);
    
    addWidget({
      type: selectedType,
      title: title || `${symbol} ${selectedType === 'card' ? 'Price' : selectedType === 'table' ? 'Watchlist' : 'Chart'}`,
      symbol,
      apiUrl: `/api/stock/${symbol}`,
      refreshInterval: parseInt(refreshInterval),
      selectedFields,
      layout: {
        x: 0,
        y: maxY,
        w: defaultLayout.w || 3,
        h: defaultLayout.h || 2,
        minW: defaultLayout.minW,
        minH: defaultLayout.minH,
      },
    });
    
    // Reset and close
    setStep(1);
    setTitle('');
    setSymbol('AAPL');
    setRefreshInterval('30');
    onOpenChange(false);
  };
  
  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 1 ? 'Add Widget' : 'Configure Widget'}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? 'Choose the type of widget you want to add to your dashboard.'
              : 'Customize your widget settings and data fields.'}
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 ? (
          <div className="grid gap-3 py-4">
            {WIDGET_TYPES.map(({ type, label, icon: Icon, description }) => (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                  "hover:border-primary hover:bg-primary/5",
                  selectedType === type ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{label}</div>
                  <div className="text-sm text-muted-foreground">{description}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Widget Title (optional)</Label>
              <Input
                id="title"
                placeholder={`${symbol} ${selectedType === 'card' ? 'Price' : selectedType === 'table' ? 'Watchlist' : 'Chart'}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            {/* Symbol Selection */}
            {selectedType !== 'table' && (
              <div className="space-y-2">
                <Label>Stock Symbol</Label>
                <Select value={symbol} onValueChange={setSymbol}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_SYMBOLS.map((s) => (
                      <SelectItem key={s.symbol} value={s.symbol}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{s.symbol}</span>
                          <span className="text-muted-foreground text-sm">{s.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Refresh Interval */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Refresh Interval
              </Label>
              <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REFRESH_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Field Selection */}
            <div className="space-y-3">
              <Label>Display Fields</Label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_FIELDS[selectedType].map((field) => (
                  <label
                    key={field}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedFields.includes(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <span className="text-sm capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Add Widget
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
