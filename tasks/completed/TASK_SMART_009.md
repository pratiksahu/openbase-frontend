# Task SMART-009: State Management & API Integration

## Objective
Implement state management for SMART Goals using React Context/Zustand and create API integration with hooks and error handling.

## Prerequisites
- [ ] Complete TASK_SMART_001-008 (Components and Pages)
- [ ] Decide on state management (Context API vs Zustand)
- [ ] Review existing API patterns
- [ ] Check authentication setup

## Implementation Tasks

### 1. State Management Setup
- [ ] Install state management library (if using Zustand)
- [ ] Create state directory structure:
  ```
  lib/state/
  ├── goals/
  │   ├── goalStore.ts
  │   ├── selectionStore.ts
  │   └── wizardStore.ts
  └── index.ts
  ```
- [ ] Configure TypeScript for state
- [ ] Set up devtools integration

### 2. Goal Store Implementation
- [ ] Create `goalStore.ts` with:
  - Goals list state
  - Current goal state
  - Filter/sort state
  - Pagination state
- [ ] Implement actions:
  - `fetchGoals()`
  - `createGoal()`
  - `updateGoal()`
  - `deleteGoal()`
  - `archiveGoal()`
- [ ] Add optimistic updates
- [ ] Include error handling
- [ ] Add loading states
- [ ] Implement caching

### 3. Selection Store
- [ ] Create `selectionStore.ts` with:
  - Selected items set
  - Selection mode state
  - Bulk action state
- [ ] Implement actions:
  - `selectItem()`
  - `deselectItem()`
  - `selectAll()`
  - `clearSelection()`
  - `toggleSelection()`
- [ ] Add bulk operations:
  - Bulk delete
  - Bulk archive
  - Bulk status update
- [ ] Include undo capability

### 4. Wizard Store
- [ ] Create `wizardStore.ts` with:
  - Form data for each step
  - Current step index
  - Validation state
  - Draft state
- [ ] Implement actions:
  - `updateStepData()`
  - `nextStep()`
  - `previousStep()`
  - `goToStep()`
  - `saveDraft()`
  - `loadDraft()`
  - `clearWizard()`
- [ ] Add validation helpers
- [ ] Include auto-save logic

### 5. API Client Setup
- [ ] Create `lib/api/client.ts`:
  - Base fetch wrapper
  - Request interceptors
  - Response interceptors
  - Error handling
- [ ] Add authentication headers
- [ ] Include retry logic
- [ ] Add request cancellation
- [ ] Implement rate limiting

### 6. API Service Layer
- [ ] Create `lib/api/goals.ts`:
  ```typescript
  - getGoals(filters, pagination)
  - getGoal(id)
  - createGoal(data)
  - updateGoal(id, data)
  - deleteGoal(id)
  - archiveGoal(id)
  ```
- [ ] Create `lib/api/metrics.ts`:
  ```typescript
  - getMetrics(goalId)
  - createMetric(goalId, data)
  - updateMetric(id, data)
  - addCheckpoint(metricId, data)
  ```
- [ ] Create `lib/api/tasks.ts`:
  ```typescript
  - getTasks(milestoneId)
  - createTask(data)
  - updateTask(id, data)
  - updateTaskStatus(id, status)
  ```

### 7. Custom Hooks
- [ ] Create `hooks/useGoals.ts`:
  - Fetch goals with filters
  - Handle pagination
  - Manage loading states
  - Cache results
- [ ] Create `hooks/useGoal.ts`:
  - Fetch single goal
  - Subscribe to updates
  - Handle mutations
  - Optimistic updates
- [ ] Create `hooks/useMetrics.ts`:
  - Fetch goal metrics
  - Update checkpoints
  - Calculate progress
- [ ] Create `hooks/useTasks.ts`:
  - Task CRUD operations
  - Status updates
  - Drag-drop handlers

### 8. Real-time Updates
- [ ] Set up WebSocket connection:
  - Connection management
  - Reconnection logic
  - Event handlers
- [ ] Implement subscriptions:
  - Goal updates
  - Task status changes
  - Metric checkpoints
  - Comments/reviews
- [ ] Add optimistic UI updates
- [ ] Handle connection errors

### 9. Error Handling
- [ ] Create error boundary component
- [ ] Implement error types:
  - Network errors
  - Validation errors
  - Permission errors
  - Not found errors
- [ ] Add error recovery:
  - Retry mechanisms
  - Fallback UI
  - Offline support
- [ ] Create error notifications
- [ ] Log errors to service

### 10. Caching Strategy
- [ ] Implement cache layers:
  - Memory cache
  - LocalStorage cache
  - API response cache
- [ ] Add cache invalidation:
  - Time-based expiry
  - Manual invalidation
  - Smart invalidation
- [ ] Create cache keys system
- [ ] Add cache warming

### 11. Offline Support
- [ ] Detect online/offline status
- [ ] Queue offline actions
- [ ] Sync when online
- [ ] Show offline indicators
- [ ] Cache essential data
- [ ] Handle conflicts

### 12. Performance Optimization
- [ ] Implement request deduplication
- [ ] Add request batching
- [ ] Use cursor pagination
- [ ] Implement virtual scrolling
- [ ] Add lazy loading
- [ ] Optimize re-renders

### 13. Testing
- [ ] Create `__tests__/stores/`:
  - Test store actions
  - Test state updates
  - Test side effects
- [ ] Create `__tests__/api/`:
  - Mock API responses
  - Test error scenarios
  - Test retry logic
- [ ] Create `__tests__/hooks/`:
  - Test hook behavior
  - Test loading states
  - Test error handling

### 14. Playwright E2E Tests
- [ ] Create `tests/state-management.spec.ts`
- [ ] Test data persistence
- [ ] Test optimistic updates
- [ ] Test error recovery
- [ ] Test offline behavior
- [ ] Test real-time updates
- [ ] Test cache behavior

## Testing Checklist

### Pre-Implementation Testing
- [ ] Run existing tests: `npx playwright test`
- [ ] Verify API endpoints available
- [ ] Check network conditions

### State Testing
- [ ] Store initializes correctly
- [ ] Actions update state properly
- [ ] Subscriptions work
- [ ] State persists correctly
- [ ] Optimistic updates revert on error

### API Testing
- [ ] Requests format correctly
- [ ] Responses parse properly
- [ ] Errors handle gracefully
- [ ] Retry logic works
- [ ] Cancellation functions

### Hook Testing
- [ ] Hooks return correct data
- [ ] Loading states accurate
- [ ] Error states handle
- [ ] Refetch works
- [ ] Cleanup happens

### Integration Testing
- [ ] Components use hooks properly
- [ ] State updates reflect in UI
- [ ] Navigation maintains state
- [ ] Forms submit correctly
- [ ] Real-time updates show

### Performance Testing
- [ ] No unnecessary re-renders
- [ ] API calls deduplicated
- [ ] Cache hits work
- [ ] Memory leaks absent
- [ ] Bundle size acceptable

### Regression Testing
- [ ] Existing tests pass: `npx playwright test`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors

## Success Criteria
- [ ] State management reliable
- [ ] API integration smooth
- [ ] Error handling robust
- [ ] Performance optimal
- [ ] Offline support works
- [ ] Real-time updates function
- [ ] All tests pass
- [ ] No memory leaks
- [ ] No regression

## Rollback Plan
If issues arise:
1. Remove state management files
2. Revert to local state
3. Remove API integration
4. Clear cache data
5. Verify components work

## Notes
- Consider using React Query/SWR for caching
- Implement proper cleanup in useEffect
- Use AbortController for cancellation
- Document state shape clearly
- Add state debugging tools