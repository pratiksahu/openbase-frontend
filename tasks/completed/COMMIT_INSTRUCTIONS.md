# Commit and Push Instructions for SMART Goals Task Breakdown

## Pre-Commit Checklist
- [x] Task files created in `tasks/` folder (TASK_SMART_001.md through TASK_SMART_010.md)
- [x] Original TODO_SMART.md file remains for reference
- [x] Each task file contains comprehensive testing checklist
- [x] Existing Playwright tests verified (82/98 passing - existing failures unrelated to changes)

## Files to Commit

### New Files Created:
- `TODO_SMART.md` - Master TODO list for SMART Goal Wizard
- `tasks/TASK_SMART_001.md` - Data Models & Type Definitions
- `tasks/TASK_SMART_002.md` - SmartScoreBadge Component
- `tasks/TASK_SMART_003.md` - BreakdownTree Component
- `tasks/TASK_SMART_004.md` - TaskEditor Component
- `tasks/TASK_SMART_005.md` - MetricEditor Component
- `tasks/TASK_SMART_006.md` - GoalWizard Component
- `tasks/TASK_SMART_007.md` - DorDodPanel Component
- `tasks/TASK_SMART_008.md` - Goal Pages & Routing
- `tasks/TASK_SMART_009.md` - State Management & API Integration
- `tasks/TASK_SMART_010.md` - Testing, Documentation & Final Integration
- `tasks/COMMIT_INSTRUCTIONS.md` - This file

## Commit Commands

### 1. Stage all new files:
```bash
git add TODO_SMART.md tasks/
```

### 2. Create commit:
```bash
git commit -m "feat: add SMART Goals task breakdown with comprehensive testing checklists

- Created TODO_SMART.md with complete feature specification
- Broke down into 10 manageable tasks (TASK_SMART_001-010)
- Each task includes:
  - Clear objectives and prerequisites
  - Detailed implementation steps
  - Comprehensive testing checklist
  - Success criteria
  - Rollback plan
- Verified existing tests remain functional (82/98 passing)
- Organized tasks to ensure no breaking changes to existing functionality"
```

### 3. Push to remote branch:
```bash
git push origin SMART
```

## Post-Push Actions

### 1. Create Pull Request (if needed):
```bash
# Using GitHub CLI
gh pr create --title "feat: SMART Goals task breakdown and planning" \
  --body "## Summary
- Added comprehensive task breakdown for SMART Goals feature
- Created 10 sequential tasks with testing requirements
- Each task is self-contained and testable

## Changes
- Added TODO_SMART.md master file
- Created 10 task files in tasks/ folder
- Included testing checklists to prevent regression

## Testing
- Verified existing tests still pass (82/98 - unrelated failures in Edge/Mobile Safari)
- Each task includes its own testing requirements
- No changes to existing code

## Next Steps
- Review task breakdown
- Begin implementation with TASK_SMART_001" \
  --base main
```

### 2. Tag this planning phase (optional):
```bash
git tag -a smart-planning-v1 -m "SMART Goals feature planning complete"
git push origin smart-planning-v1
```

## Implementation Notes

### Order of Implementation:
1. Start with TASK_SMART_001 (Type Definitions) - Foundation
2. Build components in order (002-007) - Each depends on previous
3. Create pages and routing (008) - Integrates components
4. Add state management (009) - Connects everything
5. Complete testing and documentation (010) - Final verification

### Key Principles:
- **No Breaking Changes**: Each task ensures existing tests continue to pass
- **Incremental Development**: Tasks can be completed one at a time
- **Comprehensive Testing**: Every task includes E2E tests with Playwright
- **Documentation First**: Update docs as you implement
- **Rollback Ready**: Each task has a rollback plan if issues arise

### Before Starting Implementation:
1. Review all task files to understand scope
2. Ensure development environment is set up
3. Verify Storybook is running: `npm run storybook`
4. Check that existing tests pass: `npx playwright test`
5. Create feature branch if needed: `git checkout -b smart-implementation`

## Success Metrics
- [ ] All 10 tasks can be completed independently
- [ ] No regression in existing functionality
- [ ] Each component has Storybook stories
- [ ] All features have Playwright tests
- [ ] Documentation is comprehensive
- [ ] Code follows project conventions

## Contact
For questions about the task breakdown or implementation approach, review the individual task files or consult the team lead.