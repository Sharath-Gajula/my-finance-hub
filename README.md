# FinBoard - Customizable Finance Dashboard

A real-time, customizable finance dashboard built with React, TypeScript, and modern web technologies.

## 🎯 Project Overview

FinBoard is a full-stack application that allows users to create a personalized finance dashboard with real-time stock data visualization. Users can add, remove, and rearrange widgets, configure refresh intervals, and persist their dashboard configuration across sessions.

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand with localStorage persistence
- **Grid Layout**: react-grid-layout v2.x
- **Charts**: Recharts
- **Routing**: React Router DOM

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ WidgetCard  │  │ WidgetTable │  │ WidgetChart │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                           │                                     │
│                   ┌───────▼───────┐                            │
│                   │ DashboardGrid │                            │
│                   │(react-grid)   │                            │
│                   └───────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │    Zustand    │
                    │     Store     │
                    │  (persisted)  │
                    └───────────────┘
                            │
                    ┌───────▼───────┐
                    │  localStorage │
                    └───────────────┘
```

### Data Flow

1. **UI Layer**: React components render widgets in a draggable grid
2. **State Management**: Zustand manages widget state with middleware for persistence
3. **Data Fetching**: Custom hooks (`useStockData`, `useChartData`, `useTableData`) handle real-time data with polling
4. **Persistence**: Dashboard configuration automatically saves to localStorage

## 📊 Widget Data Model

```typescript
interface Widget {
  id: string;                    // Unique identifier
  type: 'card' | 'table' | 'chart';  // Widget type
  title: string;                 // Display title
  symbol: string;                // Stock symbol (e.g., 'AAPL')
  apiUrl: string;                // API endpoint for data
  refreshInterval: number;       // Auto-refresh interval in seconds
  selectedFields: string[];      // Fields to display
  layout: {
    x: number;                   // Grid x position
    y: number;                   // Grid y position
    w: number;                   // Width in grid units
    h: number;                   // Height in grid units
    minW?: number;               // Minimum width
    minH?: number;               // Minimum height
  };
  createdAt: number;             // Timestamp
  lastUpdated?: number;          // Last update timestamp
}
```

## 🎨 Features Implemented

### 1️⃣ Dashboard Layout
- ✅ 12-column responsive grid layout
- ✅ Drag-and-drop widget repositioning
- ✅ Widget resizing with handles
- ✅ Empty state with call-to-action
- ✅ Automatic layout compaction

### 2️⃣ Widget Management
- ✅ Add widget modal with type selection
- ✅ Three widget types:
  - **Finance Card**: Price, change, symbol display
  - **Stock Table**: Paginated list with sorting
  - **Line Chart**: Real-time price visualization
- ✅ Remove widgets with confirmation
- ✅ Configurable refresh intervals

### 3️⃣ Data Integration
- ✅ Mock financial data generation (realistic pricing)
- ✅ Loading states with skeleton animations
- ✅ Error handling with retry buttons
- ✅ Simulated rate limit errors (5% chance)
- ✅ Basic caching via React Query

### 4️⃣ Dynamic Field Mapping
- ✅ User-selectable display fields
- ✅ Dynamic rendering based on selection
- ✅ Field options per widget type

### 5️⃣ Real-Time Updates
- ✅ Configurable polling intervals (10s - 5min)
- ✅ Safe interval cleanup on unmount
- ✅ Visual indicator for live data

### 6️⃣ Data Persistence
- ✅ Zustand persist middleware
- ✅ Automatic save on changes
- ✅ Restore layout on refresh
- ✅ Export/Import dashboard as JSON

## 📁 Folder Structure

```
src/
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── AddWidgetModal.tsx
│   │   ├── DashboardGrid.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── WidgetCard.tsx
│   │   ├── WidgetChart.tsx
│   │   └── WidgetTable.tsx
│   ├── ui/                  # shadcn/ui components
│   └── NavLink.tsx
├── hooks/
│   ├── useStockData.ts      # Data fetching hooks
│   └── use-mobile.tsx
├── lib/
│   ├── mockData.ts          # Mock data generators
│   └── utils.ts
├── pages/
│   ├── Index.tsx            # Main dashboard page
│   └── NotFound.tsx
├── store/
│   └── dashboardStore.ts    # Zustand store
├── types/
│   └── widget.ts            # TypeScript types
├── App.tsx
├── main.tsx
└── index.css                # Design system tokens
```

## 🚀 How to Run Locally

```bash
# Clone the repository
git clone <repo-url>

# Navigate to project directory
cd finboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Design Decisions

### Why Zustand for State Management?

1. **Simplicity**: Minimal boilerplate compared to Redux
2. **Performance**: Only re-renders subscribed components
3. **Persistence**: Built-in middleware for localStorage
4. **TypeScript**: Excellent type inference
5. **Size**: ~1KB gzipped

### Why react-grid-layout?

1. **Mature**: Battle-tested library for grid layouts
2. **Feature-rich**: Drag, resize, auto-compaction
3. **Customizable**: Full control over layout behavior
4. **Performance**: Optimized for many items

### Trade-offs

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| Mock data | No API key required | Not real market data |
| localStorage | Simple persistence | No cross-device sync |
| Polling | Simple real-time | Less efficient than WebSocket |
| Client-side | Simpler architecture | API keys exposed |

## 🚧 Limitations

- Uses mock data (no actual API integration)
- No authentication/user accounts
- localStorage only (no cloud sync)
- Mobile experience is basic
- No WebSocket for true real-time

## 🔮 Future Improvements

1. **Real API Integration**: Connect to Alpha Vantage/Finnhub via backend proxy
2. **User Authentication**: Supabase for auth and cloud storage
3. **WebSocket Updates**: Real-time price streaming
4. **Advanced Charts**: Candlestick, volume, technical indicators
5. **Watchlists**: Save multiple dashboard configurations
6. **Alerts**: Price threshold notifications
7. **Mobile App**: PWA or React Native version

## 📝 Interview Talking Points

### Architecture Decisions
- **Separation of concerns**: Types, hooks, components, store are clearly separated
- **Scalability**: Component-based architecture allows easy addition of new widget types
- **Maintainability**: TypeScript provides compile-time safety

### Performance Considerations
- React Query for caching and deduplication
- Memoized callbacks and layouts
- Efficient grid layout library with CSS transforms
- Polling cleanup to prevent memory leaks

### Edge Cases Handled
- Empty dashboard state
- Loading/error states per widget
- API rate limiting simulation
- Invalid import data validation
- Responsive layout for different screen sizes
