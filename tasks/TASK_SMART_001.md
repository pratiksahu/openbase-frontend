# Task SMART-001: Data Models & Type Definitions

## Objective
Create comprehensive TypeScript interfaces and types for the SMART Goal system, establishing the foundation for all components.

## Prerequisites
- [ ] Verify TypeScript is properly configured
- [ ] Ensure strict mode is enabled in tsconfig.json
- [ ] Check that existing type definitions follow project conventions

## Implementation Tasks

### 1. Create Type Definitions File
- [ ] Create `types/smart-goals.types.ts`
- [ ] Add proper file header with description

### 2. Define Core Interfaces
- [ ] Implement `SmartGoal` interface with all properties:
  - id, title, context, specific, measurable
  - achievable, relevant, timebound
  - smartScore, outcomes, status
  - tags, ownerId, reviewers
  - createdAt, updatedAt
- [ ] Implement `Outcome` interface:
  - id, goalId, title
  - successCriteria array
  - metrics, milestones
- [ ] Implement `Milestone` interface:
  - id, outcomeId, title, due
  - risks, dependencies, tasks
- [ ] Implement `Task` interface:
  - id, milestoneId, title, description
  - estimateHours, assigneeId, due, status
  - dependencies, subtasks, checklist
  - acceptanceCriteria
- [ ] Implement `Subtask` interface:
  - id, taskId, title
  - estimateHours, status
- [ ] Implement `ChecklistItem` interface:
  - id, text, done

### 3. Define Metric-Related Interfaces
- [ ] Implement `MeasurableSpec` interface:
  - id, name, type, baseline
  - target, unit, direction
  - samplePlan, checkpoints
- [ ] Implement `MetricCheckpoint` interface:
  - at, value, evidence

### 4. Define Supporting Interfaces
- [ ] Implement `Achievability` interface:
  - constraints, resources
- [ ] Implement `Relevance` interface:
  - businessImpact, alignment
- [ ] Implement `Timebound` interface:
  - start, end, cadence

### 5. Add Type Utilities
- [ ] Create status type unions
- [ ] Create ID type alias
- [ ] Add validation type guards
- [ ] Export all types properly

### 6. Create Mock Data Factory
- [ ] Create `lib/mock-data/smart-goals.ts`
- [ ] Implement `createMockGoal()` function
- [ ] Implement `createMockOutcome()` function
- [ ] Implement `createMockMilestone()` function
- [ ] Implement `createMockTask()` function
- [ ] Create sample dataset with 3-5 complete goals
- [ ] Include various status states
- [ ] Add metric checkpoint examples

### 7. Unit Tests
- [ ] Create `types/__tests__/smart-goals.types.test.ts`
- [ ] Test type guards for each interface
- [ ] Test mock data factory functions
- [ ] Validate data structure integrity
- [ ] Test edge cases (empty arrays, optional fields)

## Testing Checklist

### Pre-Implementation Testing
- [ ] Run existing tests to establish baseline: `npx playwright test`
- [ ] Verify no TypeScript errors: `npm run typecheck`
- [ ] Check linting passes: `npm run lint`

### Post-Implementation Testing
- [ ] TypeScript compilation successful: `npm run typecheck`
- [ ] No new linting errors: `npm run lint`
- [ ] All existing Playwright tests still pass: `npx playwright test`
- [ ] New unit tests pass: `npm test -- smart-goals.types`
- [ ] Mock data can be imported without errors
- [ ] Build succeeds: `npm run build`

### Integration Verification
- [ ] Types can be imported in components
- [ ] IntelliSense works correctly in VSCode
- [ ] No circular dependencies detected
- [ ] Types are properly exported from barrel file

## Success Criteria
- [ ] All interfaces match specification exactly
- [ ] 100% TypeScript strict mode compliance
- [ ] Mock data factory generates valid data
- [ ] All existing tests remain green
- [ ] No console errors or warnings
- [ ] Code follows project conventions

## Rollback Plan
If issues arise:
1. Revert changes: `git checkout -- types/ lib/mock-data/`
2. Identify specific failing tests
3. Fix incrementally
4. Re-run test suite

## Notes
- Keep interfaces in single file for now, can split later if needed
- Follow existing naming conventions in the project
- Ensure all IDs use consistent type (string)
- Document complex types with JSDoc comments