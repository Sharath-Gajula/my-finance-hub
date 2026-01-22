import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Widget, WidgetLayout, DashboardConfig } from '@/types/widget';

interface GridLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DashboardState {
  widgets: Widget[];
  isDarkMode: boolean;
  
  // Widget CRUD operations
  addWidget: (widget: Omit<Widget, 'id' | 'createdAt'>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  updateWidgetLayout: (id: string, layout: Partial<WidgetLayout>) => void;
  updateAllLayouts: (layouts: GridLayout[]) => void;
  
  // Dashboard operations
  clearDashboard: () => void;
  exportDashboard: () => DashboardConfig;
  importDashboard: (config: DashboardConfig) => boolean;
  
  // Theme
  toggleDarkMode: () => void;
}

// Generate unique ID
const generateId = () => `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: [],
      isDarkMode: true,
      
      addWidget: (widgetData) => {
        const newWidget: Widget = {
          ...widgetData,
          id: generateId(),
          createdAt: Date.now(),
        };
        
        set((state) => ({
          widgets: [...state.widgets, newWidget],
        }));
      },
      
      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        }));
      },
      
      updateWidget: (id, updates) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, ...updates, lastUpdated: Date.now() } : w
          ),
        }));
      },
      
      updateWidgetLayout: (id, layout) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, layout: { ...w.layout, ...layout } } : w
          ),
        }));
      },
      
      updateAllLayouts: (layouts) => {
        set((state) => ({
          widgets: state.widgets.map((widget) => {
            const layout = layouts.find((l) => l.i === widget.id);
            if (layout) {
              return {
                ...widget,
                layout: {
                  ...widget.layout,
                  x: layout.x,
                  y: layout.y,
                  w: layout.w,
                  h: layout.h,
                },
              };
            }
            return widget;
          }),
        }));
      },
      
      clearDashboard: () => {
        set({ widgets: [] });
      },
      
      exportDashboard: () => {
        const { widgets } = get();
        return {
          widgets,
          version: '1.0.0',
          exportedAt: Date.now(),
        };
      },
      
      importDashboard: (config) => {
        try {
          if (!config.widgets || !Array.isArray(config.widgets)) {
            return false;
          }
          
          // Regenerate IDs to avoid conflicts
          const importedWidgets = config.widgets.map((w) => ({
            ...w,
            id: generateId(),
            createdAt: Date.now(),
          }));
          
          set({ widgets: importedWidgets });
          return true;
        } catch {
          return false;
        }
      },
      
      toggleDarkMode: () => {
        set((state) => {
          const newMode = !state.isDarkMode;
          // Apply to document
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newMode };
        });
      },
    }),
    {
      name: 'finboard-dashboard',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Apply dark mode on rehydration
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
