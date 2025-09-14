# SMART Goals System Documentation

## Overview

The SMART Goals system is a comprehensive goal management solution that helps users create, track, and achieve their objectives using the SMART criteria framework. This system provides a complete workflow from goal creation to completion, including team collaboration, metrics tracking, and visual progress monitoring.

## SMART Criteria

Our implementation strictly follows the SMART framework:

- **S**pecific: Clear and unambiguous goals with well-defined outcomes
- **M**easurable: Quantifiable metrics and trackable progress indicators
- **A**chievable: Realistic assessment of resources and constraints
- **R**elevant: Aligned with broader objectives and stakeholder needs
- **T**ime-bound: Clear deadlines and timeline specifications

## Features

### 🎯 Goal Creation Wizard
- **Multi-step wizard** guiding users through each SMART criterion
- **Real-time validation** ensuring all required fields are completed
- **SMART score calculation** providing immediate feedback on goal quality
- **Template system** for quick goal creation from predefined patterns
- **Auto-save functionality** preventing data loss during creation

### 📊 Comprehensive Tracking
- **Visual progress indicators** showing completion percentage
- **Metrics dashboard** with charts and trend analysis
- **Checkpoint system** for recording progress milestones
- **Automated progress calculation** based on task completion and metrics

### 📋 Task Management
- **Hierarchical task breakdown** with tasks, subtasks, and checklists
- **Kanban board interface** for visual task management
- **Drag-and-drop functionality** for easy status updates
- **Task assignment** and team collaboration features
- **Due date tracking** and deadline notifications

### 👥 Team Collaboration
- **Comment system** with threading and mentions
- **Review and approval workflow** with DoR/DoD checklists
- **Real-time notifications** for team updates
- **Reviewer assignment** and approval tracking
- **Activity timeline** showing all goal-related actions

### 📈 Analytics & Reporting
- **Progress analytics** with trend analysis and forecasting
- **Performance metrics** tracking velocity and completion rates
- **Visual charts** displaying progress over time
- **Export functionality** for data analysis and reporting
- **Achievement insights** and improvement recommendations

### 🎨 Multiple Views
- **Overview dashboard** with SMART criteria breakdown
- **Visual canvas** for goal mapping and relationships
- **Kanban board** for task management
- **Metrics dashboard** for progress tracking
- **Review interface** for collaboration and approval

## Architecture

### Component Structure

```
src/components/
├── SmartScoreBadge/          # SMART score display component
├── GoalWizard/               # Multi-step goal creation wizard
│   ├── steps/                # Individual wizard steps
│   └── WizardContext.tsx     # Shared wizard state
├── BreakdownTree/            # Hierarchical task breakdown
├── TaskEditor/               # Task creation and editing
├── MetricEditor/             # Metrics configuration and tracking
└── DorDodPanel/              # Definition of Ready/Done checklists
```

### Data Model

The system uses a comprehensive type system defined in `types/smart-goals.types.ts`:

- **SmartGoal**: Main goal entity with all SMART criteria
- **Task**: Individual work items with subtasks and checklists
- **Milestone**: Key checkpoints with success criteria
- **Outcome**: Expected results and success measures
- **MetricCheckpoint**: Progress measurements over time

### State Management

The application uses a combination of:
- **React Context** for wizard state management
- **Custom hooks** for API interactions
- **Local storage** for auto-save functionality
- **Optimistic updates** for improved user experience

## API Documentation

### Goal Endpoints

#### GET /api/goals
Retrieve all goals with optional filtering and pagination.

**Query Parameters:**
- `status`: Filter by goal status (active, completed, draft, etc.)
- `priority`: Filter by priority level
- `category`: Filter by goal category
- `page`: Page number for pagination
- `limit`: Number of items per page
- `search`: Text search in goal titles and descriptions

**Response:**
```json
{
  "goals": [
    {
      "id": "goal-123",
      "title": "Complete Product Launch",
      "status": "active",
      "progress": 75,
      "smartScore": 89,
      "category": "professional",
      "priority": "high"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### POST /api/goals
Create a new goal.

**Request Body:**
```json
{
  "title": "Goal Title",
  "description": "Goal description",
  "specificObjective": "What exactly will be accomplished",
  "measurable": {
    "metricType": "percentage",
    "targetValue": 100,
    "currentValue": 0,
    "unit": "percent"
  },
  "achievability": {
    "requiredResources": [],
    "constraints": [],
    "successProbability": 0.85
  },
  "relevance": {
    "rationale": "Why this goal matters",
    "stakeholders": []
  },
  "timebound": {
    "startDate": "2024-01-01",
    "targetDate": "2024-03-31",
    "estimatedDuration": 90
  }
}
```

#### GET /api/goals/:id
Retrieve a specific goal with full details.

#### PUT /api/goals/:id
Update an existing goal.

#### DELETE /api/goals/:id
Delete a goal (soft delete with archive option).

### Task Endpoints

#### GET /api/goals/:goalId/tasks
Retrieve all tasks for a specific goal.

#### POST /api/goals/:goalId/tasks
Create a new task within a goal.

#### PUT /api/goals/:goalId/tasks/:taskId
Update a task.

#### DELETE /api/goals/:goalId/tasks/:taskId
Delete a task.

### Metrics Endpoints

#### GET /api/goals/:goalId/metrics
Retrieve metrics and checkpoints for a goal.

#### POST /api/goals/:goalId/checkpoints
Add a new metric checkpoint.

```json
{
  "value": 75,
  "recordedDate": "2024-02-15",
  "note": "Quarterly progress review",
  "source": "manual"
}
```

## Component Usage Guide

### SmartScoreBadge

Display the SMART score of a goal with optional tooltip breakdown.

```tsx
import { SmartScoreBadge } from '@/components/SmartScoreBadge';

<SmartScoreBadge
  goal={smartGoal}
  size="md"
  showTooltip={true}
  onClick={() => console.log('Score clicked')}
/>
```

**Props:**
- `goal`: SmartGoal object
- `size`: 'sm' | 'md' | 'lg'
- `showTooltip`: boolean
- `onClick`: optional click handler

### GoalWizard

Multi-step wizard for creating new goals.

```tsx
import { GoalWizard } from '@/components/GoalWizard';

<GoalWizard
  onSave={(goal) => handleGoalSave(goal)}
  onCancel={() => handleCancel()}
  initialData={existingGoal} // optional
  templates={goalTemplates} // optional
/>
```

**Props:**
- `onSave`: Function called when goal is saved
- `onCancel`: Function called when wizard is cancelled
- `initialData`: Pre-populate wizard with existing goal data
- `templates`: Array of goal templates for quick creation

### TaskEditor

Comprehensive task editing interface with subtasks and checklists.

```tsx
import { TaskEditor } from '@/components/TaskEditor';

<TaskEditor
  task={taskData}
  onSave={(task) => handleTaskSave(task)}
  onDelete={(taskId) => handleTaskDelete(taskId)}
  assignees={teamMembers}
  mode="edit" // 'create' | 'edit' | 'view'
/>
```

### MetricEditor

Configure and track goal metrics with visual charts.

```tsx
import { MetricEditor } from '@/components/MetricEditor';

<MetricEditor
  goalId="goal-123"
  metric={metricConfig}
  checkpoints={checkpointHistory}
  onSave={(metric) => handleMetricSave(metric)}
  onAddCheckpoint={(checkpoint) => handleCheckpointAdd(checkpoint)}
/>
```

## Development Guidelines

### Adding New Features

1. **Follow SMART Principles**: Ensure all features align with SMART criteria
2. **Type Safety**: Use TypeScript interfaces defined in `smart-goals.types.ts`
3. **Testing**: Write comprehensive tests for all new functionality
4. **Accessibility**: Ensure WCAG 2.1 AA compliance
5. **Performance**: Optimize for large datasets and complex hierarchies

### Code Style

```tsx
// Good: Clear component structure with TypeScript
interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onStatusChange, onEdit }: TaskCardProps) {
  const handleStatusChange = useCallback((newStatus: TaskStatus) => {
    onStatusChange(task.id, newStatus);
  }, [task.id, onStatusChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Task content */}
      </CardContent>
    </Card>
  );
}
```

### Testing Strategy

1. **Unit Tests**: Test individual components and utilities
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows
4. **Accessibility Tests**: Automated accessibility validation
5. **Performance Tests**: Load testing and optimization validation

### Performance Optimization

1. **Lazy Loading**: Code-split large components
2. **Virtualization**: Handle large lists efficiently
3. **Memoization**: Prevent unnecessary re-renders
4. **Optimistic Updates**: Improve perceived performance
5. **Caching**: Smart caching strategies for API responses

## Accessibility Features

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantics
- **Color Contrast**: 4.5:1 minimum contrast ratios
- **Focus Management**: Clear focus indicators and logical tab order
- **Alternative Text**: Meaningful descriptions for visual elements

### Keyboard Shortcuts

- `Ctrl/Cmd + N`: Create new goal
- `Ctrl/Cmd + S`: Save current changes
- `Escape`: Close modals/dialogs
- `Tab/Shift+Tab`: Navigate between elements
- `Space/Enter`: Activate buttons and links
- `Arrow Keys`: Navigate within components

### Screen Reader Features

- Live regions for status updates
- Descriptive button and link text
- Proper heading hierarchy
- Form label associations
- Progress announcements

## Deployment and Production

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yoursite.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.yoursite.com/ws

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yoursite.com

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_COLLABORATION=true
```

### Production Optimizations

1. **Build Optimization**: Tree shaking and code splitting
2. **Image Optimization**: Next.js Image component with WebP
3. **Font Optimization**: Google Fonts with display swap
4. **Service Worker**: PWA functionality with offline support
5. **CDN**: Static asset delivery optimization

### Monitoring and Analytics

- **Error Tracking**: Sentry integration for error monitoring
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Goal completion and usage metrics
- **A/B Testing**: Feature flag system for experimentation

## Troubleshooting

### Common Issues

#### Goal Creation Fails
- Check network connectivity
- Verify required fields are completed
- Ensure date formats are valid
- Check browser console for JavaScript errors

#### Tasks Not Loading
- Verify API endpoints are accessible
- Check authentication status
- Clear browser cache and local storage
- Ensure proper permissions for goal access

#### Metrics Not Updating
- Verify checkpoint data format
- Check metric configuration
- Ensure proper date/time values
- Validate numerical input ranges

#### Performance Issues
- Check for large datasets
- Verify efficient API queries
- Monitor browser memory usage
- Optimize component re-renders

### Debug Mode

Enable debug mode with environment variable:
```env
NEXT_PUBLIC_DEBUG=true
```

This provides:
- Detailed console logging
- Performance timing information
- State change notifications
- API request/response details

## Contributing

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `PORT=3001 npm run dev`
5. Run tests: `npm test`

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Ensure all tests pass
4. Update documentation
5. Submit pull request with detailed description

### Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Components are accessible (WCAG compliant)
- [ ] Tests cover new functionality
- [ ] Performance impact is considered
- [ ] Documentation is updated
- [ ] Mobile responsiveness is verified

## Support and Resources

### Documentation Links
- [API Reference](./API.md)
- [Component Library](./COMPONENTS.md)
- [Testing Guide](./TESTING.md)
- [Accessibility Guide](./ACCESSIBILITY.md)

### Community Resources
- GitHub Issues for bug reports
- Discussions for feature requests
- Wiki for additional documentation
- Examples repository for implementation samples

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: Development Team