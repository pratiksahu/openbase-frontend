# Task SMART-004: TaskEditor Component

## Objective
Create a comprehensive task editing component with support for subtasks, checklists, acceptance criteria, and status management.

## Prerequisites
- [ ] Complete TASK_SMART_001 (Type Definitions)
- [ ] Verify form components from shadcn/ui
- [ ] Check React Hook Form setup
- [ ] Review existing form patterns

## Implementation Tasks

### 1. Component Structure
- [ ] Create directory `components/TaskEditor/`
- [ ] Create `TaskEditor.tsx` main component
- [ ] Create `SubtaskList.tsx` for subtask management
- [ ] Create `ChecklistEditor.tsx` for checklist items
- [ ] Create `AcceptanceCriteria.tsx` for AC editing
- [ ] Create `TaskEditor.types.ts`
- [ ] Create `TaskEditor.utils.ts`
- [ ] Create `index.ts` barrel export

### 2. Main Task Form
- [ ] Set up React Hook Form with Zod validation
- [ ] Create form schema:
  - Title (required, min 3 chars)
  - Description (optional, max 500 chars)
  - Estimate hours (optional, positive number)
  - Assignee selection (optional)
  - Due date picker (optional)
  - Status selector (required)
- [ ] Add form field components
- [ ] Implement validation messages
- [ ] Add dirty state tracking
- [ ] Create save/cancel handlers

### 3. Status Management
- [ ] Create status selector component
- [ ] Define status workflow:
  - todo → doing
  - doing → blocked/done
  - blocked → doing/todo
  - done (terminal)
- [ ] Add status color coding
- [ ] Include status change confirmation
- [ ] Track status history

### 4. SubtaskList Component
- [ ] Create subtask list container
- [ ] Implement add subtask functionality
- [ ] Add inline editing for titles
- [ ] Include estimate hours per subtask
- [ ] Add subtask status tracking
- [ ] Implement delete with confirmation
- [ ] Add reorder via drag-drop
- [ ] Show completion percentage
- [ ] Add bulk operations:
  - Mark all complete
  - Delete all completed

### 5. ChecklistEditor Component
- [ ] Create checklist container
- [ ] Add new item input field
- [ ] Implement checkbox interactions
- [ ] Add inline edit for text
- [ ] Include delete per item
- [ ] Add reorder functionality
- [ ] Show progress indicator
- [ ] Implement markdown support
- [ ] Add bulk operations:
  - Check/uncheck all
  - Remove completed

### 6. AcceptanceCriteria Component
- [ ] Create AC editor with syntax highlighting
- [ ] Support multiple formats:
  - Plain text bullets
  - Gherkin syntax (Given/When/Then)
  - Markdown format
- [ ] Add validation for Gherkin
- [ ] Include auto-formatting
- [ ] Add template snippets
- [ ] Implement preview mode
- [ ] Add copy/paste support

### 7. Dependencies Management
- [ ] Create dependency selector
- [ ] Show dependency tree
- [ ] Validate circular dependencies
- [ ] Add dependency status indicators
- [ ] Include remove functionality

### 8. Time Tracking
- [ ] Add estimated vs actual hours
- [ ] Create time logging interface
- [ ] Show remaining hours
- [ ] Add overtime warnings
- [ ] Include history view

### 9. Storybook Stories
- [ ] Create `TaskEditor.stories.tsx`
- [ ] Add new task story
- [ ] Add existing task edit story
- [ ] Add task with subtasks story
- [ ] Add task with checklist story
- [ ] Add task with AC story
- [ ] Add complete task story
- [ ] Add validation error story
- [ ] Add loading state story

### 10. Component Tests
- [ ] Create `TaskEditor.test.tsx`
- [ ] Test form validation
- [ ] Test save functionality
- [ ] Test cancel with dirty check
- [ ] Test subtask operations
- [ ] Test checklist operations
- [ ] Test AC validation
- [ ] Test status transitions

### 11. Playwright E2E Tests
- [ ] Create `tests/task-editor.spec.ts`
- [ ] Test create new task flow
- [ ] Test edit existing task
- [ ] Test form validation errors
- [ ] Test subtask management
- [ ] Test checklist interactions
- [ ] Test AC editor modes
- [ ] Test save/cancel flows
- [ ] Test keyboard shortcuts

## Testing Checklist

### Pre-Implementation Testing
- [ ] Verify existing tests: `npx playwright test`
- [ ] Check TypeScript: `npm run typecheck`
- [ ] Verify forms work: Test existing forms

### Component Testing
- [ ] Form renders correctly
- [ ] Validation works properly
- [ ] All fields save correctly
- [ ] Subtasks can be managed
- [ ] Checklist items work
- [ ] AC editor functions
- [ ] Status changes work
- [ ] Dependencies validated

### Form Validation Testing
- [ ] Required fields enforced
- [ ] Field length limits work
- [ ] Number fields validated
- [ ] Date picker works
- [ ] Error messages clear
- [ ] Dirty state tracked

### Integration Testing
- [ ] Works in Storybook
- [ ] Data persists correctly
- [ ] No console errors
- [ ] Keyboard navigation works
- [ ] Form resets properly

### Accessibility Testing
- [ ] All fields labeled
- [ ] Error messages announced
- [ ] Keyboard accessible
- [ ] Focus management correct
- [ ] Screen reader compatible

### Regression Testing
- [ ] Existing tests pass: `npx playwright test`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Other forms still work

## Success Criteria
- [ ] All task fields editable
- [ ] Validation prevents bad data
- [ ] Subtasks fully manageable
- [ ] Checklists work intuitively
- [ ] AC supports multiple formats
- [ ] Form is fully accessible
- [ ] All tests pass
- [ ] No performance issues
- [ ] No regression in existing forms

## Rollback Plan
If issues arise:
1. Remove TaskEditor directory
2. Revert form configuration changes
3. Remove test files
4. Restore any modified schemas
5. Verify existing forms work

## Notes
- Use controlled components for all inputs
- Implement auto-save after 3 seconds of inactivity
- Consider optimistic updates for better UX
- Keep form state in context for persistence
- Document keyboard shortcuts