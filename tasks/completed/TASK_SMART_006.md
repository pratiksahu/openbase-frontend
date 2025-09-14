# Task SMART-006: GoalWizard Component

## Objective
Create a multi-step wizard component for creating SMART goals with validation, progress tracking, and preview capabilities.

## Prerequisites
- [ ] Complete TASK_SMART_001 (Type Definitions)
- [ ] Complete TASK_SMART_002 (SmartScoreBadge)
- [ ] Verify stepper UI components available
- [ ] Review existing wizard patterns

## Implementation Tasks

### 1. Component Structure
- [ ] Create directory `components/GoalWizard/`
- [ ] Create `GoalWizard.tsx` main container
- [ ] Create `WizardStepper.tsx` for navigation
- [ ] Create `WizardContext.tsx` for state
- [ ] Create steps directory `steps/`
- [ ] Create `GoalWizard.types.ts`
- [ ] Create `GoalWizard.utils.ts`
- [ ] Create `index.ts` barrel export

### 2. Wizard State Management
- [ ] Create wizard context with:
  - Current step index
  - Form data for all steps
  - Validation state per step
  - Navigation history
  - Draft saving capability
- [ ] Implement state persistence:
  - Local storage for drafts
  - Auto-save every 30 seconds
  - Recovery on browser refresh
- [ ] Add state validation helpers
- [ ] Create state reset functionality

### 3. WizardStepper Component
- [ ] Create horizontal stepper UI
- [ ] Show step indicators:
  - Context
  - Specific
  - Measurable
  - Achievable
  - Relevant
  - Time-bound
  - Preview
- [ ] Add step status icons:
  - Not started (gray)
  - In progress (blue)
  - Completed (green)
  - Error (red)
- [ ] Implement step navigation
- [ ] Add progress bar
- [ ] Include step descriptions

### 4. Context Step Component
- [ ] Create `steps/ContextStep.tsx`
- [ ] Add background information form:
  - Current situation textarea
  - Problem statement
  - Initial goal description
  - Stakeholders involved
- [ ] Include context templates:
  - Business goal
  - Personal development
  - Project milestone
  - Team objective
- [ ] Add validation rules
- [ ] Include help content

### 5. Specific Step Component
- [ ] Create `steps/SpecificStep.tsx`
- [ ] Refine goal statement:
  - Clear objective field
  - Success definition
  - Scope boundaries
  - Non-goals section
- [ ] Add specificity checklist:
  - What will be accomplished?
  - Who is involved?
  - Where will it happen?
  - Which resources needed?
  - Why is this important?
- [ ] Include AI suggestions
- [ ] Add validation scoring

### 6. Measurable Step Component
- [ ] Create `steps/MeasurableStep.tsx`
- [ ] Integrate MetricEditor component
- [ ] Add multiple metrics support
- [ ] Include success criteria editor
- [ ] Add measurement templates:
  - KPIs
  - OKRs
  - Balanced scorecard
- [ ] Set baseline values
- [ ] Define target values
- [ ] Add validation for metrics

### 7. Achievable Step Component
- [ ] Create `steps/AchievableStep.tsx`
- [ ] Resource assessment form:
  - Team members needed
  - Budget requirements
  - Tools/systems required
  - Time allocation
- [ ] Risk identification:
  - Known risks list
  - Mitigation strategies
  - Dependencies tracking
- [ ] Constraint documentation
- [ ] Feasibility score calculation

### 8. Relevant Step Component
- [ ] Create `steps/RelevantStep.tsx`
- [ ] Business impact form:
  - Strategic alignment
  - Expected outcomes
  - Beneficiaries
  - Success impact
- [ ] Alignment mapping:
  - Company OKRs
  - Department goals
  - Personal objectives
- [ ] Priority ranking
- [ ] ROI estimation

### 9. Timebound Step Component
- [ ] Create `steps/TimeboundStep.tsx`
- [ ] Timeline configuration:
  - Start date picker
  - End date picker
  - Milestone scheduler
  - Cadence selector
- [ ] Duration calculator
- [ ] Buffer time addition
- [ ] Critical path identification
- [ ] Calendar integration preview

### 10. Preview Step Component
- [ ] Create `steps/PreviewStep.tsx`
- [ ] Show complete goal summary
- [ ] Display SMART score with breakdown
- [ ] Include visual timeline
- [ ] Show metrics dashboard preview
- [ ] Add edit capabilities per section
- [ ] Include export options:
  - PDF summary
  - JSON data
  - Markdown format
- [ ] Add submission confirmation

### 11. Navigation Controls
- [ ] Create navigation bar:
  - Previous button
  - Next button
  - Save draft button
  - Cancel button
- [ ] Add keyboard shortcuts:
  - Ctrl+Enter for next
  - Escape for cancel
- [ ] Implement validation on next
- [ ] Add unsaved changes warning
- [ ] Include step jumping (if valid)

### 12. Storybook Stories
- [ ] Create `GoalWizard.stories.tsx`
- [ ] Add complete flow story
- [ ] Add individual step stories
- [ ] Add validation error story
- [ ] Add draft recovery story
- [ ] Add mobile responsive story
- [ ] Add dark mode story
- [ ] Add template selection story

### 13. Component Tests
- [ ] Create `GoalWizard.test.tsx`
- [ ] Test navigation flow
- [ ] Test step validation
- [ ] Test data persistence
- [ ] Test draft saving
- [ ] Test score calculation
- [ ] Test template application
- [ ] Test export functionality

### 14. Playwright E2E Tests
- [ ] Create `tests/goal-wizard.spec.ts`
- [ ] Test complete wizard flow
- [ ] Test step navigation
- [ ] Test validation blocking
- [ ] Test draft save/recovery
- [ ] Test data persistence
- [ ] Test keyboard navigation
- [ ] Test mobile responsiveness
- [ ] Test export functions

## Testing Checklist

### Pre-Implementation Testing
- [ ] Run existing tests: `npx playwright test`
- [ ] Verify components available
- [ ] Check TypeScript config

### Wizard Flow Testing
- [ ] Can complete all steps
- [ ] Navigation works correctly
- [ ] Validation prevents bad data
- [ ] Draft saving works
- [ ] Recovery after refresh works
- [ ] Score updates correctly

### Step Testing
- [ ] Each step renders properly
- [ ] Forms validate correctly
- [ ] Data persists between steps
- [ ] Templates apply correctly
- [ ] Help content displays

### Integration Testing
- [ ] Works with existing components
- [ ] Storybook stories function
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Mobile responsive

### Accessibility Testing
- [ ] Keyboard navigation complete
- [ ] Screen reader compatible
- [ ] Focus management correct
- [ ] ARIA labels present
- [ ] Error messages announced

### Regression Testing
- [ ] Existing tests pass: `npx playwright test`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No memory leaks

## Success Criteria
- [ ] All 7 steps functional
- [ ] Navigation intuitive
- [ ] Validation comprehensive
- [ ] Draft saving reliable
- [ ] SMART score accurate
- [ ] Templates helpful
- [ ] Export works correctly
- [ ] Fully accessible
- [ ] All tests pass
- [ ] No regression

## Rollback Plan
If issues arise:
1. Remove GoalWizard directory
2. Revert context provider changes
3. Remove test files
4. Clear local storage data
5. Verify other forms work

## Notes
- Keep steps loosely coupled
- Use React.lazy for step components
- Implement progressive disclosure
- Consider wizard analytics
- Document keyboard shortcuts