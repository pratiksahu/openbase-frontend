# Task SMART-002: SmartScoreBadge Component

## Objective
Create a visual component that calculates and displays the SMART score (0-100) with color coding and detailed breakdown tooltip.

## Prerequisites
- [ ] Complete TASK_SMART_001 (Type Definitions)
- [ ] Verify shadcn/ui is properly configured
- [ ] Check Tooltip component is available

## Implementation Tasks

### 1. Component Structure
- [ ] Create directory `components/SmartScoreBadge/`
- [ ] Create `SmartScoreBadge.tsx` main component
- [ ] Create `SmartScoreBadge.types.ts` for props interface
- [ ] Create `SmartScoreBadge.utils.ts` for score calculation
- [ ] Create `index.ts` barrel export

### 2. Score Calculation Logic
- [ ] Implement `calculateSmartScore()` function:
  - Specific: 20 points (clarity and detail)
  - Measurable: 20 points (metrics defined)
  - Achievable: 20 points (resources identified)
  - Relevant: 20 points (alignment clear)
  - Time-bound: 20 points (timeline set)
- [ ] Add partial scoring for incomplete sections
- [ ] Implement score breakdown object
- [ ] Add validation for score bounds (0-100)

### 3. Visual Component
- [ ] Create badge container with appropriate sizing
- [ ] Implement color coding:
  - 0-39: Red (needs work)
  - 40-59: Orange (fair)
  - 60-79: Yellow (good)
  - 80-100: Green (excellent)
- [ ] Add score number display
- [ ] Include optional label prop
- [ ] Add size variants (sm, md, lg)

### 4. Tooltip Integration
- [ ] Import shadcn Tooltip component
- [ ] Create detailed breakdown view
- [ ] Show individual SMART criteria scores
- [ ] Add suggestions for improvement
- [ ] Include hover/focus triggers

### 5. Storybook Stories
- [ ] Create `SmartScoreBadge.stories.tsx`
- [ ] Add default story (score: 75)
- [ ] Add low score story (score: 25)
- [ ] Add perfect score story (score: 100)
- [ ] Add interactive story with controls
- [ ] Add all size variants
- [ ] Add tooltip interaction examples

### 6. Component Tests
- [ ] Create `SmartScoreBadge.test.tsx`
- [ ] Test score calculation accuracy
- [ ] Test color coding logic
- [ ] Test tooltip content
- [ ] Test prop validation
- [ ] Test edge cases (0, 100, invalid)

### 7. Playwright E2E Tests
- [ ] Create `tests/smart-score-badge.spec.ts`
- [ ] Test badge renders with correct score
- [ ] Test color changes based on score
- [ ] Test tooltip appears on hover
- [ ] Test tooltip content accuracy
- [ ] Test keyboard navigation
- [ ] Test responsive behavior

## Testing Checklist

### Pre-Implementation Testing
- [ ] Verify existing tests pass: `npx playwright test`
- [ ] Check TypeScript compilation: `npm run typecheck`
- [ ] Verify Storybook runs: `npm run storybook`

### Component Testing
- [ ] Component renders without errors
- [ ] Score calculation is accurate
- [ ] Color coding works correctly
- [ ] Tooltip displays proper content
- [ ] All size variants work
- [ ] Component is accessible (ARIA)

### Integration Testing
- [ ] Component works in Storybook
- [ ] Playwright tests pass: `npx playwright test smart-score-badge`
- [ ] No console errors or warnings
- [ ] Component exports correctly
- [ ] TypeScript types are correct

### Regression Testing
- [ ] All existing tests still pass: `npx playwright test`
- [ ] No new linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No performance degradation

## Success Criteria
- [ ] Score accurately reflects SMART completeness
- [ ] Visual feedback is clear and intuitive
- [ ] Tooltip provides actionable information
- [ ] Component is fully accessible
- [ ] All tests pass (unit, integration, E2E)
- [ ] Storybook stories cover all states
- [ ] No regression in existing functionality

## Rollback Plan
If issues arise:
1. Remove component directory: `rm -rf components/SmartScoreBadge`
2. Remove test files
3. Revert Storybook changes
4. Re-run test suite to verify stability

## Notes
- Follow existing component patterns in the project
- Use CSS variables for colors to support theming
- Ensure dark mode compatibility
- Keep calculation logic pure and testable
- Document score calculation algorithm