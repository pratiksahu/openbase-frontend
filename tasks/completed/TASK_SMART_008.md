# Task SMART-008: Goal Pages & Routing

## Objective
Create the page structure and routing for the SMART Goals feature, including list view, detail pages with multiple views (canvas, board, metrics, review).

## Prerequisites
- [ ] Complete TASK_SMART_001-007 (All components)
- [ ] Verify Next.js App Router setup
- [ ] Check authentication if needed
- [ ] Review existing page patterns

## Implementation Tasks

### 1. Route Structure Setup
- [ ] Create goals directory structure:
  ```
  app/goals/
  ├── layout.tsx
  ├── page.tsx (list view)
  ├── new/
  │   └── page.tsx
  └── [id]/
      ├── layout.tsx
      ├── page.tsx (overview)
      ├── canvas/
      │   └── page.tsx
      ├── board/
      │   └── page.tsx
      ├── metrics/
      │   └── page.tsx
      └── review/
          └── page.tsx
  ```
- [ ] Set up route params typing
- [ ] Configure metadata for each page

### 2. Goals Layout Component
- [ ] Create `app/goals/layout.tsx`
- [ ] Add navigation header
- [ ] Include breadcrumb component
- [ ] Add action toolbar:
  - Create new goal button
  - Filter dropdown
  - View toggle (list/grid)
  - Search bar
- [ ] Set up layout persistence
- [ ] Add loading states

### 3. Goals List Page
- [ ] Create `app/goals/page.tsx`
- [ ] Implement goal list view:
  - Goal cards/rows
  - Status indicators
  - SMART score badges
  - Progress bars
  - Owner avatars
- [ ] Add filtering:
  - By status
  - By owner
  - By date range
  - By tags
- [ ] Implement sorting:
  - By creation date
  - By due date
  - By SMART score
  - By progress
- [ ] Add pagination/infinite scroll
- [ ] Include empty state
- [ ] Add grid/list view toggle

### 4. New Goal Page
- [ ] Create `app/goals/new/page.tsx`
- [ ] Integrate GoalWizard component
- [ ] Add page title and description
- [ ] Include cancel navigation
- [ ] Add success redirect
- [ ] Handle draft recovery

### 5. Goal Detail Layout
- [ ] Create `app/goals/[id]/layout.tsx`
- [ ] Add goal header:
  - Goal title
  - SMART score
  - Status badge
  - Owner info
  - Last updated
- [ ] Create tab navigation:
  - Overview
  - Canvas
  - Board
  - Metrics
  - Review
- [ ] Add action menu:
  - Edit
  - Clone
  - Archive
  - Delete
  - Share
- [ ] Include loading states

### 6. Goal Overview Page
- [ ] Create `app/goals/[id]/page.tsx`
- [ ] Display goal summary:
  - SMART criteria details
  - Overall progress
  - Key metrics
  - Timeline
- [ ] Show breakdown tree preview
- [ ] Include recent activity
- [ ] Add quick stats:
  - Tasks completed
  - Days remaining
  - Team members
- [ ] Display next actions

### 7. Canvas View Page
- [ ] Create `app/goals/[id]/canvas/page.tsx`
- [ ] Implement visual canvas:
  - Drag-drop interface
  - Node connections
  - Zoom/pan controls
  - Minimap
- [ ] Add canvas toolbar:
  - Add node
  - Connect nodes
  - Layout options
  - Export image
- [ ] Include property panel
- [ ] Add auto-layout options
- [ ] Implement canvas saving

### 8. Board View Page
- [ ] Create `app/goals/[id]/board/page.tsx`
- [ ] Create Kanban board:
  - Status columns (Todo/Doing/Done)
  - Task cards
  - Drag-drop between columns
  - WIP limits
- [ ] Add board filters:
  - By assignee
  - By milestone
  - By priority
- [ ] Include swimlanes:
  - By outcome
  - By assignee
  - By milestone
- [ ] Add card quick edit
- [ ] Show blocked items

### 9. Metrics View Page
- [ ] Create `app/goals/[id]/metrics/page.tsx`
- [ ] Create metrics dashboard:
  - Metric cards
  - Progress charts
  - Checkpoint timeline
  - Trend analysis
- [ ] Add metric filters:
  - By type
  - By status
  - By date range
- [ ] Include comparison view
- [ ] Add export options:
  - CSV data
  - Chart images
  - PDF report
- [ ] Show projections

### 10. Review View Page
- [ ] Create `app/goals/[id]/review/page.tsx`
- [ ] Create review interface:
  - DoR/DoD panel
  - Comments section
  - Approval workflow
  - Change history
- [ ] Add review actions:
  - Request review
  - Approve/reject
  - Add feedback
- [ ] Include reviewer list
- [ ] Show review timeline
- [ ] Add notification triggers

### 11. API Route Handlers
- [ ] Create `app/api/goals/route.ts`:
  - GET: List goals
  - POST: Create goal
- [ ] Create `app/api/goals/[id]/route.ts`:
  - GET: Get goal details
  - PUT: Update goal
  - DELETE: Delete goal
- [ ] Add error handling
- [ ] Include validation
- [ ] Add pagination support

### 12. Loading & Error States
- [ ] Create `app/goals/loading.tsx`
- [ ] Create `app/goals/error.tsx`
- [ ] Create not-found handlers
- [ ] Add skeleton loaders
- [ ] Include retry mechanisms

### 13. Playwright E2E Tests
- [ ] Create `tests/goal-pages.spec.ts`
- [ ] Test navigation flow
- [ ] Test list filtering/sorting
- [ ] Test goal creation
- [ ] Test view switching
- [ ] Test canvas interactions
- [ ] Test board drag-drop
- [ ] Test metrics display
- [ ] Test review workflow
- [ ] Test responsive design

## Testing Checklist

### Pre-Implementation Testing
- [ ] Run existing tests: `npx playwright test`
- [ ] Verify routing works
- [ ] Check existing pages

### Page Testing
- [ ] All pages load correctly
- [ ] Navigation works properly
- [ ] Data displays accurately
- [ ] Filters/sorts function
- [ ] Actions work correctly
- [ ] Forms submit properly

### View Testing
- [ ] Overview displays data
- [ ] Canvas interactions work
- [ ] Board drag-drop functions
- [ ] Metrics charts render
- [ ] Review workflow completes

### Routing Testing
- [ ] URLs are correct
- [ ] Params pass properly
- [ ] Navigation updates URL
- [ ] Back/forward works
- [ ] Deep linking works

### Performance Testing
- [ ] Pages load quickly
- [ ] Large lists perform well
- [ ] Canvas handles many nodes
- [ ] Board manages many cards
- [ ] Charts render efficiently

### Mobile Testing
- [ ] Responsive layouts work
- [ ] Touch interactions function
- [ ] Navigation adapts
- [ ] Modals work on mobile
- [ ] Forms are usable

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen readers work
- [ ] Focus management correct
- [ ] ARIA labels present
- [ ] Skip links available

### Regression Testing
- [ ] Existing tests pass: `npx playwright test`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors

## Success Criteria
- [ ] All pages functional
- [ ] Navigation intuitive
- [ ] Views load quickly
- [ ] Interactions smooth
- [ ] Mobile responsive
- [ ] Fully accessible
- [ ] All tests pass
- [ ] SEO optimized
- [ ] No regression

## Rollback Plan
If issues arise:
1. Remove goals directory
2. Revert routing changes
3. Remove API routes
4. Clear test files
5. Verify other pages work

## Notes
- Use dynamic imports for heavy components
- Implement proper loading states
- Cache API responses
- Use URL state for filters
- Document route structure