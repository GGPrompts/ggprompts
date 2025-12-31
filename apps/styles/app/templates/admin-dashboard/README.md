# Admin Dashboard Template

A comprehensive, terminal-themed admin dashboard with glassmorphic design and full management capabilities.

## Features

### 1. **Sidebar Navigation**
- Collapsible desktop sidebar with smooth animations
- Mobile-responsive drawer navigation
- User profile section with avatar and quick stats
- Navigation sections: Overview, Users, Content, Analytics, Settings
- Terminal green/cyan accent colors throughout

### 2. **Dashboard Overview**
- **Stats Cards**: Real-time metrics with trend indicators
  - Total Users with growth percentage
  - Active Sessions
  - Total Content
  - System Health percentage
- **Traffic Overview**: Area chart showing visits and unique users
- **Content Distribution**: Pie chart with content type breakdown
- **System Health Monitoring**:
  - CPU Usage with progress bars
  - Memory utilization
  - Storage capacity
  - API Response times
- **Activity Feed**: Real-time updates timeline with user/system/content events

### 3. **User Management**
- **Advanced Data Table** powered by TanStack React Table:
  - Sortable columns
  - Global search filtering
  - Column visibility toggle
  - Row selection with checkboxes
  - Bulk actions (Edit/Delete selected)
  - Export functionality
- **User Information Display**:
  - Avatar with fallback initials
  - Role badges (Admin/Editor/Viewer) with icons
  - Status indicators (Active/Suspended/Pending)
  - Last active timestamps
- **Actions Menu** per user:
  - Edit user details
  - View full profile
  - Delete user

### 4. **Content Management**
- **Tabbed Interface**: All Content, Posts, Pages, Media
- **Content Cards** displaying:
  - Title and type
  - Author with avatar
  - Last modified date
  - View counts and engagement metrics
  - Status badges (Published/Draft/Scheduled)
- **Quick Actions**: Edit and delete buttons per item
- **Create New Content** button in header

### 5. **Analytics Dashboard**
- **Performance Metrics**: Multi-line chart showing CPU, Memory, and Disk usage over time
- **User Growth**: Bar chart comparing visits vs unique users
- **Responsive Recharts** with custom tooltips and styling
- **Terminal-themed color scheme** for all visualizations

### 6. **Settings Panel**
- **General Settings**:
  - Enable Notifications toggle
  - Auto Backup configuration
  - Maintenance Mode switch
  - Debug Mode toggle
- **Security Settings**:
  - Two-Factor Authentication
  - Session Timeout
  - IP Whitelist
  - SSL Enforcement
- **Quick Actions Grid**:
  - Backup Now
  - Clear Cache
  - Import Data
  - Export Data

### 7. **Terminal Theme Design**
- Dark background gradient (black → slate-950 → zinc-950)
- Glassmorphic cards with backdrop blur
- Cyan/green phosphor glow effects
- Custom styled scrollbars
- Hover states with subtle glow effects
- Terminal-style text shadows on headers

### 8. **Responsive Design**
- **Desktop**: Collapsible sidebar with tooltip hints
- **Tablet**: Adjusted grid layouts
- **Mobile**: Full-screen drawer navigation, stacked cards

## Technologies Used

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TanStack React Table** for advanced data tables
- **Recharts** for data visualization
- **Framer Motion** for animations
- **shadcn/ui** components (customized with terminal theme)
- **Tailwind CSS** with glassmorphism utilities
- **Lucide Icons** for consistent iconography

## Data Management

All data is currently mocked for demonstration purposes. In a production environment, you would:

1. Replace mock data with API calls
2. Implement real-time WebSocket connections for activity feed
3. Add authentication and authorization
4. Connect to a database for user and content management
5. Implement actual system monitoring endpoints

## Customization

The dashboard is highly customizable:

- Color scheme defined through CSS variables
- Component-based architecture for easy modifications
- Separate sub-components for reusability
- Clear separation of concerns between UI and data

## Performance Features

- Lazy loading of chart components
- Virtualized tables for large datasets
- Optimized re-renders with React.memo
- Efficient state management
- Responsive image loading with Next.js Image component

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Proper heading hierarchy
- Focus management in modals and dropdowns

## Usage

```tsx
import AdminDashboard from '@/app/templates/admin-dashboard/page'

// The component is self-contained and ready to use
<AdminDashboard />
```

## Future Enhancements

- Real-time notifications system
- Advanced filtering and sorting options
- Customizable dashboard widgets
- Dark/light theme toggle
- Export to various formats (CSV, PDF, JSON)
- Audit logs and versioning
- Role-based access control (RBAC)
- Multi-language support