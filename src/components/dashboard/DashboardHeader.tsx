import { useState, useRef } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { DashboardConfig } from '@/types/widget';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  MoreVertical, 
  Download, 
  Upload, 
  Trash2, 
  Moon, 
  Sun,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  onAddWidget: () => void;
}

export function DashboardHeader({ onAddWidget }: DashboardHeaderProps) {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const widgets = useDashboardStore((s) => s.widgets);
  const isDarkMode = useDashboardStore((s) => s.isDarkMode);
  const toggleDarkMode = useDashboardStore((s) => s.toggleDarkMode);
  const exportDashboard = useDashboardStore((s) => s.exportDashboard);
  const importDashboard = useDashboardStore((s) => s.importDashboard);
  const clearDashboard = useDashboardStore((s) => s.clearDashboard);
  
  const handleExport = () => {
    const config = exportDashboard();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finboard-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Dashboard exported successfully!');
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string) as DashboardConfig;
        const success = importDashboard(config);
        if (success) {
          toast.success(`Imported ${config.widgets.length} widgets!`);
        } else {
          toast.error('Invalid dashboard configuration');
        }
      } catch {
        toast.error('Failed to parse dashboard file');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClear = () => {
    clearDashboard();
    setShowClearDialog(false);
    toast.success('Dashboard cleared');
  };
  
  return (
    <>
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="gradient-text">FinBoard</span>
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Real-time Finance Dashboard
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <LayoutGrid className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{widgets.length}</span>
              <span className="text-muted-foreground">widgets</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hidden sm:flex"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Button onClick={onAddWidget} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Widget</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleExport} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={toggleDarkMode} 
                  className="gap-2 sm:hidden"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sm:hidden" />
                <DropdownMenuItem 
                  onClick={() => setShowClearDialog(true)} 
                  className="gap-2 text-destructive focus:text-destructive"
                  disabled={widgets.length === 0}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </header>
      
      {/* Clear confirmation dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Dashboard?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all {widgets.length} widgets from your dashboard. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
