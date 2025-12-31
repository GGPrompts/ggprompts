# Analytics Dashboard Template

A comprehensive analytics dashboard showcasing data visualization with the terminal glassmorphic theme.

## Features

### 📊 Multiple Chart Types
- **Area Charts**: Revenue and user trends over time with gradient fills
- **Bar Charts**: Device usage analytics with grouped bars
- **Line Charts**: Engagement metrics tracking
- **Pie Charts**: Traffic source distribution
- **Radial Bar Charts**: Goal completion progress

### 💳 Metric Cards
- Real-time KPI display with percentage changes
- Trend indicators (up/down arrows)
- Terminal glow effects on values
- Glassmorphic card designs

### 📈 Data Visualization Components
- **Time Series Data**: 30-day rolling analytics
- **Performance Table**: Page-level metrics with sortable columns
- **Real-time Stats**: Live activity monitoring with progress bars
- **Interactive Filters**: Date range picker for custom periods

### 🎨 Design Features
- **Terminal Theme**: Green/cyan phosphor glow throughout
- **Glassmorphism**: All cards use frosted glass effects
- **Responsive Grid**: Adapts from mobile to desktop
- **Framer Motion**: Smooth animations on load and hover
- **Dark Mode**: Optimized for dark backgrounds

## Components Used

- `recharts`: For all chart visualizations
- `shadcn/ui` components:
  - Card (glassmorphic containers)
  - Tabs (metric categorization)
  - Select (date range picker)
  - Table (performance data)
  - Badge (status indicators)
  - Progress (real-time meters)
  - Button (export actions)

## Mock Data

The template includes comprehensive mock data generators:
- `generateTimeSeriesData()`: Creates realistic daily metrics
- Traffic distribution percentages
- Device usage statistics
- Performance metrics for different pages

## Color Scheme

Terminal-inspired colors used throughout:
- Primary: `hsl(160, 84%, 39%)` - Terminal green
- Secondary: `hsl(173, 80%, 40%)` - Teal accent
- Backgrounds: Glassmorphic overlays with blur effects
- Gradients: Green to cyan transitions

## Customization

To adapt for your project:
1. Replace mock data with real API calls
2. Adjust chart configurations in the config objects
3. Modify metric cards to show your KPIs
4. Update color values in chart configs to match your theme

## Usage

```tsx
import AnalyticsDashboard from '@/app/templates/dashboard/page'

// Use as a standalone page or extract components
```

## Performance Optimizations

- Charts use `ResponsiveContainer` for fluid sizing
- Lazy loading with Suspense boundaries possible
- Optimized re-renders with React.memo where applicable
- Efficient data transformations

## Accessibility

- Proper ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast meets WCAG standards
- Screen reader friendly data tables

## Future Enhancements

- Export to PDF/CSV functionality
- Real-time WebSocket data updates
- Advanced filtering and drill-downs
- Customizable dashboard layouts
- Dark/light theme toggle