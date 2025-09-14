# SMART Goals Management System - Detailed Documentation

## Overview

The SMART Goals Management System is a comprehensive goal tracking and management solution that helps users create, track, and achieve their goals using the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound).

## Architecture

### Component Hierarchy

```
GoalWizard (Entry Point)
├── WizardContext (State Management)
├── Step Components
│   ├── BasicInfoStep
│   ├── SpecificStep
│   ├── MeasurableStep (uses MetricEditor)
│   ├── AchievableStep (uses TaskEditor)
│   ├── RelevantStep
│   ├── TimeboundStep
│   └── ReviewStep (uses SmartScoreBadge)
└── WizardNavigation

Goal Pages
├── /goals (List View)
│   ├── GoalCard (uses SmartScoreBadge)
│   ├── FilterPanel
│   └── SearchBar
├── /goals/[id] (Overview)
│   ├── GoalHeader
│   ├── BreakdownTree
│   └── ProgressSummary
├── /goals/[id]/metrics
│   ├── MetricEditor
│   └── ProgressCharts
├── /goals/[id]/board
│   ├── TaskEditor
│   └── KanbanBoard
└── /goals/[id]/review
    └── DorDodPanel
```

### State Management Architecture

```typescript
// Zustand Store Structure
GoalStore
├── State
│   ├── goals: SmartGoal[]
│   ├── currentGoal: SmartGoal | null
│   ├── loading: LoadingState
│   ├── error: ErrorState
│   ├── filters: FilterOptions
│   ├── sort: SortOptions
│   └── pagination: PaginationState
├── Actions
│   ├── fetchGoals()
│   ├── createGoal()
│   ├── updateGoal()
│   ├── deleteGoal()
│   └── archiveGoal()
└── Optimizations
    ├── cache: Map<string, CachedData>
    ├── optimisticUpdates: Map<string, Goal>
    └── lastFetch: timestamp
```

## Component Details

### 1. GoalWizard
- **Purpose**: Guided goal creation with SMART validation
- **Steps**: 7 sequential steps with validation
- **Features**: Auto-save, templates, draft management
- **State**: React Context with useReducer
- **Validation**: Zod schemas for each step

### 2. SmartScoreBadge
- **Purpose**: Visual indicator of goal quality (0-100)
- **Calculation**: Weighted scoring across SMART criteria
- **Variants**: Compact, detailed, with/without tooltip
- **Colors**: Red (0-39), Yellow (40-69), Green (70-100)

### 3. BreakdownTree
- **Purpose**: Hierarchical visualization of goal structure
- **Components**: Goals → Outcomes → Milestones → Tasks → Subtasks
- **Features**: Collapsible nodes, progress indicators, drag-drop
- **Visualization**: Tree layout with connecting lines

### 4. TaskEditor
- **Purpose**: Comprehensive task management
- **Features**: Subtasks, checklists, acceptance criteria
- **Dependencies**: Task relationships and prerequisites
- **Assignment**: Team member assignment with avatars

### 5. MetricEditor
- **Purpose**: Define and track measurable criteria
- **Types**: Number, Percentage, Currency, Duration, Boolean, Rating, etc.
- **Checkpoints**: Progress updates with timestamps
- **Visualization**: Line charts, bar charts, progress rings

### 6. DorDodPanel
- **Purpose**: Define ready/done criteria
- **Sections**: Definition of Ready, Definition of Done
- **Features**: Checklist items, requirements, validation rules

## Data Models

### Core Types

```typescript
interface SmartGoal {
  id: string;
  title: string;
  description: string;

  // SMART Criteria
  specific: SpecificDetails;
  measurable: MeasurableSpec[];
  achievable: Achievability;
  relevant: Relevance;
  timebound: Timebound;

  // Metadata
  status: GoalStatus;
  priority: GoalPriority;
  category: GoalCategory;
  progress: number;
  smartScore: number;

  // Relationships
  outcomes: Outcome[];
  tasks: Task[];
  milestones: Milestone[];

  // Tracking
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface Task {
  id: string;
  goalId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;

  // Structure
  subtasks: Subtask[];
  checklist: ChecklistItem[];
  acceptanceCriteria: AcceptanceCriteria;

  // Assignment
  assigneeId?: string;
  reviewerId?: string;

  // Timeline
  estimatedHours: number;
  actualHours?: number;
  dueDate?: Date;
  completedDate?: Date;
}

interface MeasurableSpec {
  id: string;
  metricType: MetricType;
  metricName: string;
  currentValue: number;
  targetValue: number;
  unit?: string;

  checkpoints: MetricCheckpoint[];
  frequency?: CheckpointFrequency;

  // Visualization
  showChart: boolean;
  chartType?: 'line' | 'bar' | 'area';
}
```

## API Integration

### Endpoints

```typescript
// Goals API
GET    /api/goals              // List with filtering
POST   /api/goals              // Create new goal
GET    /api/goals/:id          // Get single goal
PUT    /api/goals/:id          // Full update
PATCH  /api/goals/:id          // Partial update
DELETE /api/goals/:id          // Delete goal

// Bulk Operations
POST   /api/goals/bulk/status  // Update multiple statuses
DELETE /api/goals/bulk         // Delete multiple
POST   /api/goals/bulk/archive // Archive multiple

// Specialized
GET    /api/goals/:id/tasks    // Get goal tasks
GET    /api/goals/:id/metrics  // Get metrics data
POST   /api/goals/:id/clone    // Clone goal
```

### Request/Response Examples

```typescript
// Create Goal Request
POST /api/goals
{
  "title": "Launch Product",
  "category": "PROFESSIONAL",
  "priority": "HIGH",
  "specific": {
    "what": "Launch new SaaS product",
    "why": "Expand market reach",
    "who": ["Product Team", "Marketing"],
    "where": "Global market",
    "constraints": ["6 month timeline", "500k budget"]
  },
  "measurable": [{
    "metricType": "NUMBER",
    "metricName": "Active Users",
    "targetValue": 1000,
    "unit": "users"
  }],
  "timebound": {
    "startDate": "2024-01-01",
    "targetDate": "2024-06-30",
    "milestones": [...]
  }
}

// Response
{
  "success": true,
  "data": {
    "id": "goal_abc123",
    "title": "Launch Product",
    "smartScore": 85,
    "status": "ACTIVE",
    ...
  }
}
```

## Usage Patterns

### Creating a Goal

```typescript
// Using the hook
const { createGoal, loading, error } = useGoals();

const handleCreateGoal = async (data: SmartGoalCreate) => {
  try {
    const goal = await createGoal(data);
    router.push(`/goals/${goal.id}`);
  } catch (err) {
    toast.error('Failed to create goal');
  }
};

// Using the store directly
const store = useGoalStore();
await store.createGoal(data);
```

### Tracking Progress

```typescript
// Add checkpoint
const { addCheckpoint } = useMetrics(goalId);

await addCheckpoint({
  value: 250,
  note: "Q1 milestone reached",
  confidence: 'HIGH',
  recordedDate: new Date()
});

// Update task status
const { updateTask } = useTasks(goalId);

await updateTask(taskId, {
  status: TaskStatus.COMPLETED,
  actualHours: 12,
  completedDate: new Date()
});
```

### Filtering and Searching

```typescript
// Using filters
const { goals, setFilters } = useGoals();

setFilters({
  status: [GoalStatus.ACTIVE, GoalStatus.IN_PROGRESS],
  priority: [GoalPriority.HIGH, GoalPriority.CRITICAL],
  category: [GoalCategory.PROFESSIONAL],
  dateRange: {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  }
});

// Searching
const { searchGoals } = useGoalSearch();
const results = await searchGoals('product launch');
```

## Testing Strategy

### E2E Test Coverage

1. **Goal Creation Flow**
   - Wizard navigation
   - Step validation
   - Template selection
   - Draft saving
   - Final submission

2. **Goal Management**
   - CRUD operations
   - Status changes
   - Bulk operations
   - Archive/restore

3. **Progress Tracking**
   - Checkpoint recording
   - Metric updates
   - Chart visualization
   - Trend analysis

4. **Task Management**
   - Task creation
   - Subtask management
   - Status updates
   - Kanban board

5. **Collaboration**
   - Comments
   - Reviews
   - Assignments
   - Notifications

### Test Utilities

```typescript
// Test helpers
import { createMockGoal, createMockTask } from '@/tests/utils/factories';
import { GoalPageObject } from '@/tests/page-objects/goal.page';

// Example test
test('should create and track goal progress', async ({ page }) => {
  const goalPage = new GoalPageObject(page);

  // Create goal
  await goalPage.navigateToWizard();
  await goalPage.fillBasicInfo({ title: 'Test Goal' });
  await goalPage.completeWizard();

  // Track progress
  await goalPage.addCheckpoint(50);
  await expect(goalPage.progressBar).toHaveValue('50');
});
```

## Performance Optimizations

### Implemented Optimizations

1. **Code Splitting**
   - Dynamic imports for large components
   - Route-based splitting
   - Lazy loading of charts

2. **State Management**
   - Optimistic updates for instant feedback
   - Smart caching with TTL
   - Selective re-rendering

3. **Data Loading**
   - Pagination for large lists
   - Virtual scrolling for performance
   - Debounced search

4. **Bundle Size**
   - Tree shaking
   - Component lazy loading
   - Image optimization

### Performance Metrics

- Initial Load: < 2s
- Time to Interactive: < 3s
- Lighthouse Score: > 90
- Bundle Size: < 300KB (gzipped)

## Accessibility

### WCAG 2.1 AA Compliance

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels and descriptions
- ✅ Focus management
- ✅ Color contrast ratios
- ✅ Error identification
- ✅ Form validation feedback

### Keyboard Shortcuts

- `Tab` - Navigate forward
- `Shift+Tab` - Navigate backward
- `Enter/Space` - Activate buttons
- `Arrow keys` - Navigate within components
- `Escape` - Close modals/dropdowns
- `Ctrl+S` - Save draft (in wizard)

## Troubleshooting

### Common Issues

1. **Goal not saving**
   - Check network connection
   - Verify required fields
   - Check console for errors

2. **Charts not rendering**
   - Ensure data is loaded
   - Check browser compatibility
   - Verify Recharts import

3. **Wizard state lost**
   - Check localStorage
   - Verify context provider
   - Check for navigation issues

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem('DEBUG_GOALS', 'true');

// View store state
const state = useGoalStore.getState();
console.log('Goal Store:', state);

// Check cache
console.log('Cache:', state.cache);
```

## Migration Guide

### From v1 to v2

No migration needed - this is the initial implementation.

### Future Migrations

```typescript
// Migration utility (placeholder)
export async function migrateGoals(fromVersion: string) {
  switch(fromVersion) {
    case '1.0.0':
      // Future migration logic
      break;
    default:
      throw new Error(`Unknown version: ${fromVersion}`);
  }
}
```

## Contributing

### Development Setup

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Component documentation

### Pull Request Process

1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit PR with description

## Support

For issues or questions:
- GitHub Issues: [Report bugs](https://github.com/org/repo/issues)
- Documentation: This file and inline JSDoc
- Examples: Storybook stories and test files