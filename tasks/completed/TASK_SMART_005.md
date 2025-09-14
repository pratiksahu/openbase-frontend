# Task SMART-005: MetricEditor Component

## Objective
Create a comprehensive metric editing component with checkpoint tracking, progress visualization, and evidence management.

## Prerequisites
- [ ] Complete TASK_SMART_001 (Type Definitions)
- [ ] Verify chart library availability (recharts/chart.js)
- [ ] Check date picker component
- [ ] Review existing data visualization patterns

## Implementation Tasks

### 1. Component Structure
- [ ] Create directory `components/MetricEditor/`
- [ ] Create `MetricEditor.tsx` main component
- [ ] Create `CheckpointTracker.tsx` for checkpoints
- [ ] Create `MetricChart.tsx` for visualization
- [ ] Create `MetricTypeSelector.tsx`
- [ ] Create `MetricEditor.types.ts`
- [ ] Create `MetricEditor.utils.ts`
- [ ] Create `index.ts` barrel export

### 2. Metric Configuration Form
- [ ] Create metric definition form:
  - Name field (required)
  - Type selector (absolute/percent/ratio/count/rate/duration)
  - Baseline value (optional)
  - Target value (required)
  - Unit field (%, ms, users, etc.)
  - Direction selector (≥/≤/==)
- [ ] Add validation rules per type
- [ ] Include sample plan textarea
- [ ] Add measurement frequency selector
- [ ] Create help tooltips per field

### 3. MetricTypeSelector Component
- [ ] Create type dropdown with icons
- [ ] Define type configurations:
  - Absolute: raw numbers
  - Percent: 0-100 with %
  - Ratio: x:y format
  - Count: integer only
  - Rate: value per unit time
  - Duration: time-based
- [ ] Auto-set units based on type
- [ ] Adjust validation per type
- [ ] Show type-specific examples

### 4. CheckpointTracker Component
- [ ] Create checkpoint list view
- [ ] Add "Add Checkpoint" button
- [ ] Implement checkpoint form:
  - Date/time picker
  - Value input with validation
  - Evidence field (URL/note)
  - Confidence level selector
- [ ] Show checkpoint timeline
- [ ] Add edit/delete actions
- [ ] Sort by date automatically
- [ ] Calculate trend indicators
- [ ] Show progress to target

### 5. MetricChart Component
- [ ] Set up chart library (recharts)
- [ ] Create line chart for progress
- [ ] Add target line indicator
- [ ] Mark checkpoint positions
- [ ] Include baseline reference
- [ ] Add hover tooltips
- [ ] Implement zoom/pan for date range
- [ ] Add chart type toggle:
  - Line chart
  - Bar chart
  - Area chart
- [ ] Export chart as image

### 6. Progress Calculations
- [ ] Calculate completion percentage
- [ ] Implement trend analysis:
  - Linear regression
  - Moving average
  - Projection to target
- [ ] Add status indicators:
  - On track (green)
  - At risk (yellow)
  - Off track (red)
- [ ] Calculate velocity/rate
- [ ] Estimate completion date

### 7. Evidence Management
- [ ] Create evidence attachment UI
- [ ] Support multiple formats:
  - URLs/links
  - Text notes
  - File references
- [ ] Add evidence preview
- [ ] Implement evidence validation
- [ ] Track evidence history

### 8. Metric Templates
- [ ] Create common metric templates:
  - Conversion rate
  - Response time
  - User satisfaction
  - Revenue growth
  - Bug count
- [ ] Allow custom templates
- [ ] Include industry benchmarks
- [ ] Add template picker UI

### 9. Storybook Stories
- [ ] Create `MetricEditor.stories.tsx`
- [ ] Add new metric story
- [ ] Add metric with checkpoints story
- [ ] Add different metric types stories
- [ ] Add chart visualization story
- [ ] Add progress tracking story
- [ ] Add evidence attachment story
- [ ] Add template selection story

### 10. Component Tests
- [ ] Create `MetricEditor.test.tsx`
- [ ] Test metric configuration
- [ ] Test type-specific validation
- [ ] Test checkpoint CRUD
- [ ] Test chart rendering
- [ ] Test progress calculations
- [ ] Test evidence management
- [ ] Test template application

### 11. Playwright E2E Tests
- [ ] Create `tests/metric-editor.spec.ts`
- [ ] Test metric creation flow
- [ ] Test checkpoint addition
- [ ] Test chart interactions
- [ ] Test evidence attachment
- [ ] Test validation errors
- [ ] Test progress indicators
- [ ] Test export functionality

## Testing Checklist

### Pre-Implementation Testing
- [ ] Run existing tests: `npx playwright test`
- [ ] Verify TypeScript: `npm run typecheck`
- [ ] Check chart library setup

### Component Testing
- [ ] Form renders correctly
- [ ] All metric types work
- [ ] Checkpoints can be added/edited
- [ ] Charts display accurately
- [ ] Progress calculates correctly
- [ ] Evidence can be attached
- [ ] Templates apply properly

### Calculation Testing
- [ ] Percentage calculations accurate
- [ ] Trend analysis correct
- [ ] Projections reasonable
- [ ] Status indicators accurate
- [ ] Edge cases handled

### Visualization Testing
- [ ] Charts render properly
- [ ] Data points accurate
- [ ] Interactions smooth
- [ ] Responsive on mobile
- [ ] Export works correctly

### Integration Testing
- [ ] Works with mock data
- [ ] Storybook stories function
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Dark mode compatible

### Accessibility Testing
- [ ] Chart has text alternatives
- [ ] Form fields labeled
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient

### Regression Testing
- [ ] Existing tests pass: `npx playwright test`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No performance degradation

## Success Criteria
- [ ] All metric types supported
- [ ] Checkpoints fully manageable
- [ ] Charts accurately visualize progress
- [ ] Progress tracking is accurate
- [ ] Evidence can be attached
- [ ] Templates speed up creation
- [ ] All tests pass
- [ ] Component is accessible
- [ ] No regression in existing features

## Rollback Plan
If issues arise:
1. Remove MetricEditor directory
2. Remove chart library if added
3. Revert package.json changes
4. Remove test files
5. Verify build still works

## Notes
- Consider using recharts for consistency
- Implement data caching for performance
- Keep calculations pure functions
- Use Web Workers for heavy calculations if needed
- Document metric type specifications