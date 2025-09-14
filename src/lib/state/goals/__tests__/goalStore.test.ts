/**
 * Goal Store Tests
 *
 * @fileoverview Unit tests for the Goal Store
 * @version 1.0.0
 */

import { GoalStatus, GoalPriority, GoalCategory } from '@/types/smart-goals.types';

import { useGoalStore } from '../goalStore';

// Mock the API
jest.mock('@/lib/api/goals', () => ({
  goalsApi: {
    getGoals: jest.fn(),
    getGoal: jest.fn(),
    createGoal: jest.fn(),
    updateGoal: jest.fn(),
    deleteGoal: jest.fn(),
    archiveGoal: jest.fn(),
    bulkUpdateStatus: jest.fn(),
    bulkDelete: jest.fn(),
    bulkArchive: jest.fn(),
  },
}));

describe('goalStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useGoalStore.setState({
      goals: [],
      currentGoal: null,
      loading: {
        goals: false,
        currentGoal: false,
        create: false,
        update: false,
        delete: false,
        archive: false,
      },
      error: {
        goals: null,
        currentGoal: null,
        create: null,
        update: null,
        delete: null,
        archive: null,
      },
      filters: {},
      sort: {
        field: 'updatedAt',
        direction: 'desc',
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      cache: new Map(),
      optimisticUpdates: new Map(),
      lastFetch: 0,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useGoalStore.getState();

      expect(state.goals).toEqual([]);
      expect(state.currentGoal).toBeNull();
      expect(state.loading.goals).toBe(false);
      expect(state.error.goals).toBeNull();
      expect(state.filters).toEqual({});
      expect(state.sort).toEqual({
        field: 'updatedAt',
        direction: 'desc',
      });
      expect(state.pagination.page).toBe(1);
      expect(state.pagination.limit).toBe(20);
    });
  });

  describe('Filters and Sorting', () => {
    it('should update filters correctly', () => {
      const { setFilters } = useGoalStore.getState();

      setFilters({ status: [GoalStatus.ACTIVE] });

      const state = useGoalStore.getState();
      expect(state.filters.status).toEqual([GoalStatus.ACTIVE]);
    });

    it('should update sort correctly', () => {
      const { setSort } = useGoalStore.getState();

      setSort({ field: 'createdAt', direction: 'asc' });

      const state = useGoalStore.getState();
      expect(state.sort).toEqual({
        field: 'createdAt',
        direction: 'asc',
      });
    });

    it('should clear filters correctly', () => {
      const { setFilters, clearFilters } = useGoalStore.getState();

      // Set some filters first
      setFilters({ status: [GoalStatus.ACTIVE], priority: [GoalPriority.HIGH] });

      // Clear filters
      clearFilters();

      const state = useGoalStore.getState();
      expect(state.filters).toEqual({});
      expect(state.pagination.page).toBe(1); // Should reset to page 1
    });
  });

  describe('Pagination', () => {
    it('should update page correctly', () => {
      const { setPage } = useGoalStore.getState();

      setPage(3);

      const state = useGoalStore.getState();
      expect(state.pagination.page).toBe(3);
    });

    it('should update page size correctly', () => {
      const { setPageSize } = useGoalStore.getState();

      setPageSize(50);

      const state = useGoalStore.getState();
      expect(state.pagination.limit).toBe(50);
      expect(state.pagination.page).toBe(1); // Should reset to page 1
    });
  });

  describe('Error Handling', () => {
    it('should clear specific error', () => {
      const { clearError } = useGoalStore.getState();

      // Set an error manually for testing
      useGoalStore.setState({
        error: {
          goals: 'Test error',
          currentGoal: 'Another error',
          create: null,
          update: null,
          delete: null,
          archive: null,
        },
      });

      clearError('goals');

      const state = useGoalStore.getState();
      expect(state.error.goals).toBeNull();
      expect(state.error.currentGoal).toBe('Another error'); // Should remain
    });

    it('should clear all errors', () => {
      const { clearAllErrors } = useGoalStore.getState();

      // Set errors manually for testing
      useGoalStore.setState({
        error: {
          goals: 'Test error',
          currentGoal: 'Another error',
          create: 'Create error',
          update: null,
          delete: null,
          archive: null,
        },
      });

      clearAllErrors();

      const state = useGoalStore.getState();
      expect(state.error.goals).toBeNull();
      expect(state.error.currentGoal).toBeNull();
      expect(state.error.create).toBeNull();
    });
  });

  describe('Utility Functions', () => {
    const mockGoals = [
      {
        id: '1',
        title: 'Test Goal 1',
        status: GoalStatus.ACTIVE,
        priority: GoalPriority.HIGH,
        description: 'Test description 1',
        progress: 50,
        category: GoalCategory.PERSONAL,
        ownerId: 'user1',
        timebound: {
          startDate: new Date(),
          targetDate: new Date(),
          estimatedDuration: 30,
          isRecurring: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Test Goal 2',
        status: GoalStatus.COMPLETED,
        priority: GoalPriority.MEDIUM,
        description: 'Test description 2',
        progress: 100,
        category: GoalCategory.PROFESSIONAL,
        ownerId: 'user1',
        timebound: {
          startDate: new Date(),
          targetDate: new Date(),
          estimatedDuration: 60,
          isRecurring: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    beforeEach(() => {
      useGoalStore.setState({ goals: mockGoals });
    });

    it('should get goal by ID', () => {
      const { getGoalById } = useGoalStore.getState();

      const goal = getGoalById('1');
      expect(goal).toBeDefined();
      expect(goal!.title).toBe('Test Goal 1');

      const nonExistentGoal = getGoalById('999');
      expect(nonExistentGoal).toBeNull();
    });

    it('should get goals by status', () => {
      const { getGoalsByStatus } = useGoalStore.getState();

      const activeGoals = getGoalsByStatus(GoalStatus.ACTIVE);
      expect(activeGoals).toHaveLength(1);
      expect(activeGoals[0].id).toBe('1');

      const completedGoals = getGoalsByStatus(GoalStatus.COMPLETED);
      expect(completedGoals).toHaveLength(1);
      expect(completedGoals[0].id).toBe('2');

      const draftGoals = getGoalsByStatus(GoalStatus.DRAFT);
      expect(draftGoals).toHaveLength(0);
    });

    it('should get goals by priority', () => {
      const { getGoalsByPriority } = useGoalStore.getState();

      const highPriorityGoals = getGoalsByPriority(GoalPriority.HIGH);
      expect(highPriorityGoals).toHaveLength(1);
      expect(highPriorityGoals[0].id).toBe('1');

      const mediumPriorityGoals = getGoalsByPriority(GoalPriority.MEDIUM);
      expect(mediumPriorityGoals).toHaveLength(1);
      expect(mediumPriorityGoals[0].id).toBe('2');

      const lowPriorityGoals = getGoalsByPriority(GoalPriority.LOW);
      expect(lowPriorityGoals).toHaveLength(0);
    });
  });

  describe('Cache Management', () => {
    it('should clear cache', () => {
      const { clearCache } = useGoalStore.getState();

      // Add something to cache manually
      const state = useGoalStore.getState();
      state.cache.set('test-key', {
        data: [],
        filters: {},
        sort: { field: 'createdAt', direction: 'asc' },
        timestamp: Date.now(),
        ttl: 5000,
      });

      expect(state.cache.size).toBe(1);

      clearCache();

      const newState = useGoalStore.getState();
      expect(newState.cache.size).toBe(0);
    });

    it('should invalidate specific cache entry', () => {
      const { invalidateCache } = useGoalStore.getState();

      // Add multiple items to cache
      const state = useGoalStore.getState();
      state.cache.set('key1', {
        data: [],
        filters: {},
        sort: { field: 'createdAt', direction: 'asc' },
        timestamp: Date.now(),
        ttl: 5000,
      });
      state.cache.set('key2', {
        data: [],
        filters: {},
        sort: { field: 'updatedAt', direction: 'desc' },
        timestamp: Date.now(),
        ttl: 5000,
      });

      expect(state.cache.size).toBe(2);

      invalidateCache('key1');

      const newState = useGoalStore.getState();
      expect(newState.cache.size).toBe(1);
      expect(newState.cache.has('key2')).toBe(true);
    });
  });

  describe('Store Integration', () => {
    it('should maintain state consistency during updates', () => {
      const { setFilters, setPage } = useGoalStore.getState();

      // Set initial state
      setFilters({ status: [GoalStatus.ACTIVE] });
      setPage(2);

      let state = useGoalStore.getState();
      expect(state.filters.status).toEqual([GoalStatus.ACTIVE]);
      expect(state.pagination.page).toBe(2);

      // Update filters should reset page
      setFilters({ priority: [GoalPriority.HIGH] });

      state = useGoalStore.getState();
      expect(state.filters.priority).toEqual([GoalPriority.HIGH]);
      expect(state.pagination.page).toBe(1); // Should reset
    });
  });
});