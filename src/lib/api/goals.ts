/**
 * Goals API Service - SMART Goals CRUD Operations
 *
 * This module provides API services for SMART Goals:
 * - Goal CRUD operations
 * - Filtering and pagination
 * - Bulk operations
 * - Status management
 * - Archive operations
 *
 * @fileoverview API service layer for SMART Goals
 * @version 1.0.0
 */

import { apiClient, ApiResponse } from './client';
import {
  SmartGoal,
  SmartGoalSummary,
  SmartGoalCreate,
  SmartGoalUpdate,
  GoalFilters,
  GoalSort,
  GoalStatus,
  GoalPriority,
} from '@/types/smart-goals.types';
import { createSampleGoalsDataset, createMockSmartGoal } from '@/lib/mock-data/smart-goals';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetGoalsRequest {
  filters?: GoalFilters;
  sort?: GoalSort;
  page?: number;
  limit?: number;
}

export interface BulkOperationResponse {
  success: boolean;
  updatedIds: string[];
  errors: Array<{
    id: string;
    error: string;
  }>;
}

// =============================================================================
// Mock Data Management
// =============================================================================

let mockGoals: SmartGoal[] = [];

// Initialize mock data
const initializeMockData = () => {
  if (mockGoals.length === 0) {
    mockGoals = createSampleGoalsDataset(20).map(goal => createMockSmartGoal({ ...goal }));
  }
};

// Helper function to simulate API delay
const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to simulate potential API errors
const simulateRandomError = (chance: number = 0.05): void => {
  if (Math.random() < chance) {
    throw new Error('Simulated API error');
  }
};

// =============================================================================
// Filtering and Sorting Utilities
// =============================================================================

const applyFilters = (goals: SmartGoal[], filters: GoalFilters): SmartGoal[] => {
  let filteredGoals = goals;

  if (filters.status && filters.status.length > 0) {
    filteredGoals = filteredGoals.filter(goal =>
      filters.status!.includes(goal.status)
    );
  }

  if (filters.priority && filters.priority.length > 0) {
    filteredGoals = filteredGoals.filter(goal =>
      filters.priority!.includes(goal.priority)
    );
  }

  if (filters.category && filters.category.length > 0) {
    filteredGoals = filteredGoals.filter(goal =>
      filters.category!.includes(goal.category)
    );
  }

  if (filters.ownerId && filters.ownerId.length > 0) {
    filteredGoals = filteredGoals.filter(goal =>
      filters.ownerId!.includes(goal.ownerId)
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredGoals = filteredGoals.filter(goal =>
      filters.tags!.some(tag => goal.tags.includes(tag))
    );
  }

  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    filteredGoals = filteredGoals.filter(goal => {
      const goalDate = new Date(goal.createdAt);
      return goalDate >= start && goalDate <= end;
    });
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredGoals = filteredGoals.filter(goal =>
      goal.title.toLowerCase().includes(query) ||
      goal.description.toLowerCase().includes(query) ||
      goal.specificObjective.toLowerCase().includes(query) ||
      goal.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filteredGoals;
};

const applySorting = (goals: SmartGoal[], sort: GoalSort): SmartGoal[] => {
  return goals.sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    // Handle different data types
    if (aValue instanceof Date && bValue instanceof Date) {
      const result = aValue.getTime() - bValue.getTime();
      return sort.direction === 'asc' ? result : -result;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue);
      return sort.direction === 'asc' ? result : -result;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const result = aValue - bValue;
      return sort.direction === 'asc' ? result : -result;
    }

    // Fallback to string comparison
    const result = String(aValue).localeCompare(String(bValue));
    return sort.direction === 'asc' ? result : -result;
  });
};

const applyPagination = <T>(items: T[], page: number, limit: number): PaginatedResponse<T> => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = items.slice(startIndex, endIndex);

  return {
    data,
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// =============================================================================
// Goals API Implementation
// =============================================================================

export class GoalsApi {

  // =============================================================================
  // Read Operations
  // =============================================================================

  /**
   * Get paginated list of goals with filtering and sorting
   */
  async getGoals(request: GetGoalsRequest = {}): Promise<PaginatedResponse<SmartGoalSummary>> {
    try {
      // In a real API, this would make an HTTP request
      // For now, we'll use mock data and simulate the API behavior

      await simulateDelay(300);
      simulateRandomError(0.02); // 2% chance of error

      initializeMockData();

      const {
        filters = {},
        sort = { field: 'updatedAt', direction: 'desc' },
        page = 1,
        limit = 20,
      } = request;

      // Apply filters
      let filteredGoals = applyFilters(mockGoals, filters);

      // Apply sorting
      filteredGoals = applySorting(filteredGoals, sort);

      // Convert to summary format
      const goalSummaries: SmartGoalSummary[] = filteredGoals.map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        status: goal.status,
        priority: goal.priority,
        progress: goal.progress,
        category: goal.category,
        ownerId: goal.ownerId,
        timebound: goal.timebound,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      }));

      // Apply pagination
      return applyPagination(goalSummaries, page, limit);

    } catch (error) {
      throw new Error(`Failed to fetch goals: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a single goal by ID
   */
  async getGoal(id: string): Promise<SmartGoal> {
    try {
      await simulateDelay(200);
      simulateRandomError(0.02);

      initializeMockData();

      const goal = mockGoals.find(g => g.id === id);
      if (!goal) {
        const error = new Error('Goal not found') as any;
        error.status = 404;
        throw error;
      }

      return { ...goal };

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to fetch goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get goals by status
   */
  async getGoalsByStatus(status: GoalStatus): Promise<SmartGoalSummary[]> {
    const result = await this.getGoals({
      filters: { status: [status] },
      limit: 1000, // Get all matching goals
    });

    return result.data;
  }

  /**
   * Get goals by priority
   */
  async getGoalsByPriority(priority: GoalPriority): Promise<SmartGoalSummary[]> {
    const result = await this.getGoals({
      filters: { priority: [priority] },
      limit: 1000,
    });

    return result.data;
  }

  /**
   * Search goals by query
   */
  async searchGoals(query: string, limit: number = 20): Promise<SmartGoalSummary[]> {
    const result = await this.getGoals({
      filters: { searchQuery: query },
      limit,
    });

    return result.data;
  }

  // =============================================================================
  // Create Operations
  // =============================================================================

  /**
   * Create a new goal
   */
  async createGoal(goalData: SmartGoalCreate): Promise<SmartGoal> {
    try {
      await simulateDelay(800);
      simulateRandomError(0.03);

      initializeMockData();

      // Create new goal with generated ID and timestamps
      const now = new Date();
      const newGoal: SmartGoal = {
        ...goalData,
        id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
        createdBy: goalData.ownerId, // In real app, this would come from auth context
        updatedBy: goalData.ownerId,
        isDeleted: false,
        checkpoints: [],
        tasks: [],
        milestones: [],
        outcomes: [],
        childGoalIds: [],
        actualStartDate: goalData.status === GoalStatus.ACTIVE ? now : undefined,
        actualCompletionDate: goalData.status === GoalStatus.COMPLETED ? now : undefined,
        lastProgressUpdate: now,
        nextReviewDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        comments: [],
      };

      // Add to mock data
      mockGoals.unshift(newGoal);

      return { ...newGoal };

    } catch (error) {
      throw new Error(`Failed to create goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Update Operations
  // =============================================================================

  /**
   * Update an existing goal
   */
  async updateGoal(id: string, updates: Partial<SmartGoalUpdate>): Promise<SmartGoal> {
    try {
      await simulateDelay(600);
      simulateRandomError(0.03);

      initializeMockData();

      const goalIndex = mockGoals.findIndex(g => g.id === id);
      if (goalIndex === -1) {
        const error = new Error('Goal not found') as any;
        error.status = 404;
        throw error;
      }

      const existingGoal = mockGoals[goalIndex];
      const now = new Date();

      // Apply updates
      const updatedGoal: SmartGoal = {
        ...existingGoal,
        ...updates,
        id: existingGoal.id, // Don't allow ID updates
        createdAt: existingGoal.createdAt, // Don't allow creation date updates
        createdBy: existingGoal.createdBy, // Don't allow creator updates
        updatedAt: now,
        updatedBy: updates.updatedBy || existingGoal.ownerId,
        lastProgressUpdate: updates.progress !== undefined ? now : existingGoal.lastProgressUpdate,
        actualCompletionDate:
          updates.status === GoalStatus.COMPLETED && existingGoal.status !== GoalStatus.COMPLETED
            ? now
            : existingGoal.actualCompletionDate,
        actualStartDate:
          updates.status === GoalStatus.ACTIVE && !existingGoal.actualStartDate
            ? now
            : existingGoal.actualStartDate,
      };

      // Update in mock data
      mockGoals[goalIndex] = updatedGoal;

      return { ...updatedGoal };

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to update goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update goal status
   */
  async updateGoalStatus(id: string, status: GoalStatus): Promise<SmartGoal> {
    return this.updateGoal(id, { status });
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(id: string, progress: number): Promise<SmartGoal> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    return this.updateGoal(id, { progress });
  }

  // =============================================================================
  // Delete Operations
  // =============================================================================

  /**
   * Delete a goal (soft or hard delete)
   */
  async deleteGoal(id: string, permanent: boolean = false): Promise<void> {
    try {
      await simulateDelay(400);
      simulateRandomError(0.02);

      initializeMockData();

      const goalIndex = mockGoals.findIndex(g => g.id === id);
      if (goalIndex === -1) {
        const error = new Error('Goal not found') as any;
        error.status = 404;
        throw error;
      }

      if (permanent) {
        // Hard delete - remove from array
        mockGoals.splice(goalIndex, 1);
      } else {
        // Soft delete - mark as deleted
        const now = new Date();
        mockGoals[goalIndex] = {
          ...mockGoals[goalIndex],
          isDeleted: true,
          deletedAt: now,
          deletedBy: mockGoals[goalIndex].ownerId, // In real app, from auth context
          updatedAt: now,
          updatedBy: mockGoals[goalIndex].ownerId,
        };
      }

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to delete goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Restore a soft-deleted goal
   */
  async restoreGoal(id: string): Promise<SmartGoal> {
    try {
      await simulateDelay(400);
      simulateRandomError(0.02);

      initializeMockData();

      const goalIndex = mockGoals.findIndex(g => g.id === id && g.isDeleted);
      if (goalIndex === -1) {
        const error = new Error('Deleted goal not found') as any;
        error.status = 404;
        throw error;
      }

      const now = new Date();
      const restoredGoal: SmartGoal = {
        ...mockGoals[goalIndex],
        isDeleted: false,
        deletedAt: undefined,
        deletedBy: undefined,
        updatedAt: now,
        updatedBy: mockGoals[goalIndex].ownerId,
      };

      mockGoals[goalIndex] = restoredGoal;

      return { ...restoredGoal };

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to restore goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Archive Operations
  // =============================================================================

  /**
   * Archive a goal
   */
  async archiveGoal(id: string, reason?: string): Promise<SmartGoal> {
    try {
      await simulateDelay(400);
      simulateRandomError(0.02);

      return this.updateGoal(id, {
        isArchived: true,
        archivedAt: new Date(),
        archiveReason: reason,
      });

    } catch (error) {
      throw new Error(`Failed to archive goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Unarchive a goal
   */
  async unarchiveGoal(id: string): Promise<SmartGoal> {
    try {
      await simulateDelay(400);
      simulateRandomError(0.02);

      return this.updateGoal(id, {
        isArchived: false,
        archivedAt: undefined,
        archiveReason: undefined,
      });

    } catch (error) {
      throw new Error(`Failed to unarchive goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Bulk Operations
  // =============================================================================

  /**
   * Bulk update goal statuses
   */
  async bulkUpdateStatus(ids: string[], status: GoalStatus): Promise<BulkOperationResponse> {
    try {
      await simulateDelay(800);
      simulateRandomError(0.03);

      const updatedIds: string[] = [];
      const errors: Array<{ id: string; error: string }> = [];

      for (const id of ids) {
        try {
          await this.updateGoalStatus(id, status);
          updatedIds.push(id);
        } catch (error) {
          errors.push({
            id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      return {
        success: errors.length === 0,
        updatedIds,
        errors,
      };

    } catch (error) {
      throw new Error(`Bulk status update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Bulk delete goals
   */
  async bulkDelete(ids: string[], permanent: boolean = false): Promise<BulkOperationResponse> {
    try {
      await simulateDelay(800);
      simulateRandomError(0.03);

      const updatedIds: string[] = [];
      const errors: Array<{ id: string; error: string }> = [];

      for (const id of ids) {
        try {
          await this.deleteGoal(id, permanent);
          updatedIds.push(id);
        } catch (error) {
          errors.push({
            id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      return {
        success: errors.length === 0,
        updatedIds,
        errors,
      };

    } catch (error) {
      throw new Error(`Bulk delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Bulk archive goals
   */
  async bulkArchive(ids: string[], reason?: string): Promise<BulkOperationResponse> {
    try {
      await simulateDelay(800);
      simulateRandomError(0.03);

      const updatedIds: string[] = [];
      const errors: Array<{ id: string; error: string }> = [];

      for (const id of ids) {
        try {
          await this.archiveGoal(id, reason);
          updatedIds.push(id);
        } catch (error) {
          errors.push({
            id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      return {
        success: errors.length === 0,
        updatedIds,
        errors,
      };

    } catch (error) {
      throw new Error(`Bulk archive failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Analytics and Reporting
  // =============================================================================

  /**
   * Get goal statistics
   */
  async getGoalStats(): Promise<{
    total: number;
    byStatus: Record<GoalStatus, number>;
    byPriority: Record<GoalPriority, number>;
    completionRate: number;
  }> {
    try {
      await simulateDelay(300);
      initializeMockData();

      const activeGoals = mockGoals.filter(g => !g.isDeleted && !g.isArchived);
      const total = activeGoals.length;

      const byStatus = Object.values(GoalStatus).reduce((acc, status) => {
        acc[status] = activeGoals.filter(g => g.status === status).length;
        return acc;
      }, {} as Record<GoalStatus, number>);

      const byPriority = Object.values(GoalPriority).reduce((acc, priority) => {
        acc[priority] = activeGoals.filter(g => g.priority === priority).length;
        return acc;
      }, {} as Record<GoalPriority, number>);

      const completedGoals = byStatus[GoalStatus.COMPLETED] || 0;
      const completionRate = total > 0 ? (completedGoals / total) * 100 : 0;

      return {
        total,
        byStatus,
        byPriority,
        completionRate,
      };

    } catch (error) {
      throw new Error(`Failed to fetch goal stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Utility Methods
  // =============================================================================

  /**
   * Clear all mock data (for testing)
   */
  clearMockData(): void {
    mockGoals = [];
  }

  /**
   * Get all mock data (for testing)
   */
  getAllMockData(): SmartGoal[] {
    initializeMockData();
    return [...mockGoals];
  }

  /**
   * Set mock data (for testing)
   */
  setMockData(goals: SmartGoal[]): void {
    mockGoals = [...goals];
  }
}

// =============================================================================
// Default Instance
// =============================================================================

export const goalsApi = new GoalsApi();

export default goalsApi;