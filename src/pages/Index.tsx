import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { AddWidgetModal } from '@/components/dashboard/AddWidgetModal';
import { useDashboardStore } from '@/store/dashboardStore';

const Index = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const isDarkMode = useDashboardStore((s) => s.isDarkMode);
  
  // Apply dark mode on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader onAddWidget={() => setShowAddModal(true)} />
      <DashboardGrid onAddWidget={() => setShowAddModal(true)} />
      <AddWidgetModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
};

export default Index;
