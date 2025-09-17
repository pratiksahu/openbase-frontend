# TODO: SMART Goal Page Implementation

## Overview
Implementation plan for creating a comprehensive SMART Goal page with full CRUD operations, validation, and Playwright E2E testing.

## SMART Goal Criteria
- **S**pecific: Clear, well-defined goal
- **M**easurable: Quantifiable metrics and progress indicators
- **A**chievable: Realistic and attainable
- **R**elevant: Aligned with broader objectives
- **T**ime-bound: Clear deadline or timeframe

## Phase 1: Page Structure & Routing
- [ ] Create `/app/smart-goals/page.tsx` - Main SMART Goals listing page
- [ ] Create `/app/smart-goals/new/page.tsx` - Create new SMART Goal page
- [ ] Create `/app/smart-goals/[id]/page.tsx` - View single SMART Goal
- [ ] Create `/app/smart-goals/[id]/edit/page.tsx` - Edit SMART Goal
- [ ] Add navigation links to main app navigation

## Phase 2: Component Development

### 2.1 Core Components
- [ ] Create `components/smart-goals/SmartGoalForm.tsx`
  - [ ] Specific field (title, description)
  - [ ] Measurable field (metrics, KPIs, target values)
  - [ ] Achievable field (resources, constraints)
  - [ ] Relevant field (alignment, category)
  - [ ] Time-bound field (start date, end date, milestones)
- [ ] Create `components/smart-goals/SmartGoalCard.tsx` - Display goal summary
- [ ] Create `components/smart-goals/SmartGoalList.tsx` - List all goals
- [ ] Create `components/smart-goals/SmartGoalDetail.tsx` - Full goal view
- [ ] Create `components/smart-goals/ProgressTracker.tsx` - Visual progress

### 2.2 Form Validation
- [ ] Implement Zod schema for SMART Goal validation
- [ ] Add field-level validation messages
- [ ] Implement form submission handling
- [ ] Add success/error toast notifications

### 2.3 UI Components (using shadcn/ui)
- [ ] Use Card component for goal display
- [ ] Use Form components for goal creation/editing
- [ ] Use Dialog for delete confirmations
- [ ] Use Progress component for goal progress
- [ ] Use Badge for goal status/category
- [ ] Use Tabs for different goal views

## Phase 3: State Management

### 3.1 Data Structure
```typescript
interface SmartGoal {
  id: string;
  // Specific
  title: string;
  description: string;

  // Measurable
  metrics: {
    name: string;
    currentValue: number;
    targetValue: number;
    unit: string;
  }[];

  // Achievable
  resources: string[];
  constraints: string[];

  // Relevant
  category: string;
  alignment: string;
  priority: 'low' | 'medium' | 'high';

  // Time-bound
  startDate: Date;
  endDate: Date;
  milestones: {
    title: string;
    date: Date;
    completed: boolean;
  }[];

  // Meta
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 State Implementation
- [ ] Create `hooks/useSmartGoals.ts` - Custom hook for goals state
- [ ] Implement local storage persistence
- [ ] Add CRUD operations (Create, Read, Update, Delete)
- [ ] Implement filtering and sorting functionality

## Phase 4: Features Implementation

### 4.1 Create Goal
- [ ] Multi-step form wizard
- [ ] Real-time validation
- [ ] Preview before saving
- [ ] Auto-save draft functionality

### 4.2 View Goals
- [ ] Grid/List view toggle
- [ ] Filter by status, category, priority
- [ ] Sort by date, progress, priority
- [ ] Search functionality
- [ ] Pagination or infinite scroll

### 4.3 Edit Goal
- [ ] Load existing data into form
- [ ] Track changes
- [ ] Confirm before saving
- [ ] Version history (optional)

### 4.4 Delete Goal
- [ ] Confirmation dialog
- [ ] Soft delete with recovery option
- [ ] Cascade delete related data

### 4.5 Progress Tracking
- [ ] Update progress manually
- [ ] Calculate automatic progress from metrics
- [ ] Visual progress indicators
- [ ] Progress history/timeline

## Phase 5: Playwright E2E Testing

### 5.1 Test File Structure
- [ ] Create `tests/smart-goals/smart-goal-crud.spec.ts`
- [ ] Create `tests/smart-goals/smart-goal-validation.spec.ts`
- [ ] Create `tests/smart-goals/smart-goal-progress.spec.ts`
- [ ] Create `tests/smart-goals/smart-goal-filters.spec.ts`

### 5.2 Test Scenarios

#### Create Goal Tests
- [ ] Test successful goal creation with all fields
- [ ] Test validation for required fields
- [ ] Test date validation (end date after start date)
- [ ] Test metric validation (target > 0)
- [ ] Test form reset after submission
- [ ] Test draft saving functionality

#### Read/View Tests
- [ ] Test goals list display
- [ ] Test individual goal detail view
- [ ] Test empty state when no goals
- [ ] Test pagination/scroll
- [ ] Test search functionality
- [ ] Test filter combinations

#### Update Tests
- [ ] Test editing all goal fields
- [ ] Test partial updates
- [ ] Test validation on edit
- [ ] Test cancel edit functionality
- [ ] Test optimistic updates

#### Delete Tests
- [ ] Test delete confirmation dialog
- [ ] Test successful deletion
- [ ] Test cancel deletion
- [ ] Test bulk delete (if implemented)

#### Progress Tests
- [ ] Test manual progress update
- [ ] Test automatic progress calculation
- [ ] Test milestone completion
- [ ] Test status changes (in-progress, completed, overdue)

#### Integration Tests
- [ ] Test goal creation → view → edit → delete flow
- [ ] Test multiple goals interaction
- [ ] Test data persistence on page reload
- [ ] Test responsive design on different viewports

### 5.3 Test Utilities
- [ ] Create test data generators
- [ ] Create page object models
- [ ] Create custom assertions
- [ ] Create test helpers for common actions

## Phase 6: Accessibility & Performance

### 6.1 Accessibility
- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader
- [ ] Ensure proper focus management
- [ ] Add skip links for navigation
- [ ] Ensure color contrast meets WCAG standards

### 6.2 Performance
- [ ] Implement lazy loading for goal list
- [ ] Optimize re-renders with React.memo
- [ ] Add loading skeletons
- [ ] Implement virtual scrolling for large lists
- [ ] Add error boundaries

## Phase 7: Documentation & Cleanup

### 7.1 Documentation
- [ ] Update FEATURES.md with SMART Goals feature
- [ ] Add JSDoc comments to components
- [ ] Create user guide/help text
- [ ] Document API/hook usage

### 7.2 Code Quality
- [ ] Run ESLint and fix issues: `npm run lint`
- [ ] Run type checking: `npm run typecheck`
- [ ] Format code: `npm run format`
- [ ] Remove console.log statements
- [ ] Review and refactor duplicate code

### 7.3 Final Testing
- [ ] Run full Playwright test suite: `npx playwright test`
- [ ] Test in different browsers
- [ ] Test on mobile devices
- [ ] Verify dark mode support
- [ ] Performance audit with Lighthouse

## Success Criteria
- [ ] All SMART criteria fields are implemented and functional
- [ ] Full CRUD operations work correctly
- [ ] All Playwright tests pass (100% success rate)
- [ ] Page is fully accessible (WCAG 2.1 AA compliant)
- [ ] Performance metrics meet targets (LCP < 2.5s)
- [ ] Code passes all quality checks (lint, typecheck, build)
- [ ] Feature is documented in FEATURES.md

## Notes
- Use existing shadcn/ui components wherever possible
- Follow existing code patterns in the codebase
- Ensure consistent styling with the rest of the application
- Consider mobile-first responsive design
- Implement proper error handling and user feedback
- Use TypeScript for type safety throughout

## Dependencies
- React Hook Form for form management
- Zod for validation
- shadcn/ui components
- date-fns for date handling
- Playwright for testing

## Estimated Timeline
- Phase 1-2: 2-3 hours (Basic structure and components)
- Phase 3-4: 3-4 hours (State management and features)
- Phase 5: 2-3 hours (Comprehensive testing)
- Phase 6-7: 1-2 hours (Polish and documentation)

Total: 8-12 hours for complete implementation