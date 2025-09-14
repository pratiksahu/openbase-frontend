/**
 * Metrics API Service - Goal Metrics and Checkpoints
 *
 * This module provides API services for Goal Metrics:
 * - Metric checkpoints CRUD
 * - Progress tracking
 * - Analytics and reporting
 * - Data visualization support
 *
 * @fileoverview API service layer for goal metrics and checkpoints
 * @version 1.0.0
 */

import { createMockMetricCheckpoint } from '@/lib/mock-data/smart-goals';
import { MetricCheckpoint } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface MetricAnalytics {
  goalId: string;
  totalCheckpoints: number;
  latestValue: number;
  previousValue: number;
  changeAmount: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  averageValue: number;
  minValue: number;
  maxValue: number;
  progressToTarget: number;
  estimatedCompletionDate?: Date;
  velocityPerDay: number;
}

export interface MetricTrendData {
  date: string;
  value: number;
  target?: number;
  note?: string;
}

export interface CreateCheckpointRequest {
  goalId: string;
  value: number;
  recordedDate?: Date;
  note?: string;
  isAutomatic?: boolean;
  source?: string;
  confidence?: number;
}

export interface UpdateCheckpointRequest {
  value?: number;
  recordedDate?: Date;
  note?: string;
  confidence?: number;
}

// =============================================================================
// Mock Data Management
// =============================================================================

let mockCheckpoints: MetricCheckpoint[] = [];

const initializeMockCheckpoints = () => {
  if (mockCheckpoints.length === 0) {
    // Generate sample checkpoints for different goals
    const sampleGoalIds = ['goal-1', 'goal-2', 'goal-3', 'goal-4', 'goal-5'];

    sampleGoalIds.forEach(goalId => {
      const checkpointCount = Math.floor(Math.random() * 10) + 5; // 5-15 checkpoints
      for (let i = 0; i < checkpointCount; i++) {
        const daysAgo = checkpointCount - i;
        const checkpoint = createMockMetricCheckpoint(goalId, {
          recordedDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
          value: Math.random() * 100,
        });
        mockCheckpoints.push(checkpoint);
      }
    });

    // Sort by recorded date
    mockCheckpoints.sort((a, b) => b.recordedDate.getTime() - a.recordedDate.getTime());
  }
};

const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const simulateRandomError = (chance: number = 0.02): void => {
  if (Math.random() < chance) {
    throw new Error('Simulated API error');
  }
};

// =============================================================================
// Metrics API Implementation
// =============================================================================

export class MetricsApi {

  // =============================================================================
  // Checkpoint CRUD Operations
  // =============================================================================

  /**
   * Get all checkpoints for a goal
   */
  async getCheckpoints(goalId: string): Promise<MetricCheckpoint[]> {
    try {
      await simulateDelay();
      simulateRandomError();

      initializeMockCheckpoints();

      const goalCheckpoints = mockCheckpoints
        .filter(checkpoint => checkpoint.goalId === goalId)
        .sort((a, b) => b.recordedDate.getTime() - a.recordedDate.getTime());

      return goalCheckpoints.map(checkpoint => ({ ...checkpoint }));

    } catch (error) {
      throw new Error(`Failed to fetch checkpoints: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a specific checkpoint by ID
   */
  async getCheckpoint(id: string): Promise<MetricCheckpoint> {
    try {
      await simulateDelay(200);
      simulateRandomError();

      initializeMockCheckpoints();

      const checkpoint = mockCheckpoints.find(c => c.id === id);
      if (!checkpoint) {
        const error = new Error('Checkpoint not found') as any;
        error.status = 404;
        throw error;
      }

      return { ...checkpoint };

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to fetch checkpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new checkpoint
   */
  async createCheckpoint(request: CreateCheckpointRequest): Promise<MetricCheckpoint> {
    try {
      await simulateDelay(400);
      simulateRandomError();

      initializeMockCheckpoints();

      const now = new Date();
      const newCheckpoint: MetricCheckpoint = {
        id: `checkpoint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'current-user', // In real app, from auth context
        updatedBy: 'current-user',
        goalId: request.goalId,
        value: request.value,
        recordedDate: request.recordedDate || now,
        note: request.note,
        isAutomatic: request.isAutomatic || false,
        source: request.source || 'manual-entry',
        confidence: request.confidence || 1.0,
      };

      mockCheckpoints.unshift(newCheckpoint);

      return { ...newCheckpoint };

    } catch (error) {
      throw new Error(`Failed to create checkpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing checkpoint
   */
  async updateCheckpoint(id: string, updates: UpdateCheckpointRequest): Promise<MetricCheckpoint> {
    try {
      await simulateDelay(400);
      simulateRandomError();

      initializeMockCheckpoints();

      const checkpointIndex = mockCheckpoints.findIndex(c => c.id === id);
      if (checkpointIndex === -1) {
        const error = new Error('Checkpoint not found') as any;
        error.status = 404;
        throw error;
      }

      const existingCheckpoint = mockCheckpoints[checkpointIndex];
      const now = new Date();

      const updatedCheckpoint: MetricCheckpoint = {
        ...existingCheckpoint,
        ...updates,
        id: existingCheckpoint.id,
        createdAt: existingCheckpoint.createdAt,
        createdBy: existingCheckpoint.createdBy,
        updatedAt: now,
        updatedBy: 'current-user',
        goalId: existingCheckpoint.goalId,
      };

      mockCheckpoints[checkpointIndex] = updatedCheckpoint;

      return { ...updatedCheckpoint };

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to update checkpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a checkpoint
   */
  async deleteCheckpoint(id: string): Promise<void> {
    try {
      await simulateDelay(300);
      simulateRandomError();

      initializeMockCheckpoints();

      const checkpointIndex = mockCheckpoints.findIndex(c => c.id === id);
      if (checkpointIndex === -1) {
        const error = new Error('Checkpoint not found') as any;
        error.status = 404;
        throw error;
      }

      mockCheckpoints.splice(checkpointIndex, 1);

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to delete checkpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Analytics and Reporting
  // =============================================================================

  /**
   * Get metric analytics for a goal
   */
  async getMetricAnalytics(goalId: string): Promise<MetricAnalytics> {
    try {
      await simulateDelay(400);
      simulateRandomError();

      const checkpoints = await this.getCheckpoints(goalId);

      if (checkpoints.length === 0) {
        throw new Error('No checkpoints found for goal');
      }

      // Sort by recorded date (latest first)
      const sortedCheckpoints = checkpoints.sort(
        (a, b) => b.recordedDate.getTime() - a.recordedDate.getTime()
      );

      const values = sortedCheckpoints.map(c => c.value);
      const latestValue = values[0];
      const previousValue = values[1] || latestValue;

      const changeAmount = latestValue - previousValue;
      const changePercentage = previousValue !== 0 ? (changeAmount / previousValue) * 100 : 0;

      let trend: 'up' | 'down' | 'stable';
      if (changeAmount > 0.01) trend = 'up';
      else if (changeAmount < -0.01) trend = 'down';
      else trend = 'stable';

      const averageValue = values.reduce((sum, val) => sum + val, 0) / values.length;
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      // Calculate velocity (change per day)
      let velocityPerDay = 0;
      if (sortedCheckpoints.length >= 2) {
        const firstCheckpoint = sortedCheckpoints[sortedCheckpoints.length - 1];
        const lastCheckpoint = sortedCheckpoints[0];
        const daysDiff = Math.max(
          (lastCheckpoint.recordedDate.getTime() - firstCheckpoint.recordedDate.getTime()) / (1000 * 60 * 60 * 24),
          1
        );
        velocityPerDay = (lastCheckpoint.value - firstCheckpoint.value) / daysDiff;
      }

      // For this mock, assume target is 100
      const targetValue = 100;
      const progressToTarget = (latestValue / targetValue) * 100;

      // Estimate completion date based on velocity
      let estimatedCompletionDate: Date | undefined;
      if (velocityPerDay > 0 && latestValue < targetValue) {
        const daysToComplete = (targetValue - latestValue) / velocityPerDay;
        estimatedCompletionDate = new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000);
      }

      return {
        goalId,
        totalCheckpoints: checkpoints.length,
        latestValue,
        previousValue,
        changeAmount,
        changePercentage,
        trend,
        averageValue,
        minValue,
        maxValue,
        progressToTarget,
        estimatedCompletionDate,
        velocityPerDay,
      };

    } catch (error) {
      throw new Error(`Failed to generate analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get trend data for charting
   */
  async getTrendData(goalId: string, days?: number): Promise<MetricTrendData[]> {
    try {
      await simulateDelay(300);
      simulateRandomError();

      const checkpoints = await this.getCheckpoints(goalId);

      let filteredCheckpoints = checkpoints;
      if (days) {
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        filteredCheckpoints = checkpoints.filter(c => c.recordedDate >= cutoffDate);
      }

      // Sort by recorded date (oldest first for trend)
      const sortedCheckpoints = filteredCheckpoints.sort(
        (a, b) => a.recordedDate.getTime() - b.recordedDate.getTime()
      );

      return sortedCheckpoints.map(checkpoint => ({
        date: checkpoint.recordedDate.toISOString().split('T')[0],
        value: checkpoint.value,
        target: 100, // Mock target value
        note: checkpoint.note,
      }));

    } catch (error) {
      throw new Error(`Failed to fetch trend data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get latest checkpoint value for a goal
   */
  async getLatestValue(goalId: string): Promise<number | null> {
    try {
      const checkpoints = await this.getCheckpoints(goalId);

      if (checkpoints.length === 0) {
        return null;
      }

      const latestCheckpoint = checkpoints.reduce((latest, current) =>
        current.recordedDate > latest.recordedDate ? current : latest
      );

      return latestCheckpoint.value;

    } catch (error) {
      throw new Error(`Failed to get latest value: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get checkpoint statistics for a date range
   */
  async getCheckpointStats(
    goalId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    count: number;
    averageValue: number;
    minValue: number;
    maxValue: number;
    totalChange: number;
    averageConfidence: number;
  }> {
    try {
      await simulateDelay(300);
      simulateRandomError();

      const checkpoints = await this.getCheckpoints(goalId);

      const filteredCheckpoints = checkpoints.filter(
        c => c.recordedDate >= startDate && c.recordedDate <= endDate
      );

      if (filteredCheckpoints.length === 0) {
        return {
          count: 0,
          averageValue: 0,
          minValue: 0,
          maxValue: 0,
          totalChange: 0,
          averageConfidence: 0,
        };
      }

      const values = filteredCheckpoints.map(c => c.value);
      const confidences = filteredCheckpoints.map(c => c.confidence || 1);

      // Sort by date to calculate change
      const sortedCheckpoints = filteredCheckpoints.sort(
        (a, b) => a.recordedDate.getTime() - b.recordedDate.getTime()
      );

      const firstValue = sortedCheckpoints[0].value;
      const lastValue = sortedCheckpoints[sortedCheckpoints.length - 1].value;
      const totalChange = lastValue - firstValue;

      return {
        count: filteredCheckpoints.length,
        averageValue: values.reduce((sum, val) => sum + val, 0) / values.length,
        minValue: Math.min(...values),
        maxValue: Math.max(...values),
        totalChange,
        averageConfidence: confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length,
      };

    } catch (error) {
      throw new Error(`Failed to get checkpoint stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Bulk Operations
  // =============================================================================

  /**
   * Bulk create checkpoints
   */
  async bulkCreateCheckpoints(requests: CreateCheckpointRequest[]): Promise<MetricCheckpoint[]> {
    try {
      await simulateDelay(600);
      simulateRandomError();

      const createdCheckpoints: MetricCheckpoint[] = [];

      for (const request of requests) {
        try {
          const checkpoint = await this.createCheckpoint(request);
          createdCheckpoints.push(checkpoint);
        } catch (error) {
          console.error(`Failed to create checkpoint for goal ${request.goalId}:`, error);
          // Continue with other checkpoints
        }
      }

      return createdCheckpoints;

    } catch (error) {
      throw new Error(`Bulk checkpoint creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete all checkpoints for a goal
   */
  async deleteAllCheckpoints(goalId: string): Promise<void> {
    try {
      await simulateDelay(400);
      simulateRandomError();

      initializeMockCheckpoints();

      mockCheckpoints = mockCheckpoints.filter(c => c.goalId !== goalId);

    } catch (error) {
      throw new Error(`Failed to delete checkpoints: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Data Export/Import
  // =============================================================================

  /**
   * Export checkpoints as CSV data
   */
  async exportCheckpoints(goalId: string): Promise<string> {
    try {
      const checkpoints = await this.getCheckpoints(goalId);

      const headers = ['Date', 'Value', 'Note', 'Source', 'Confidence', 'Automatic'];
      const rows = checkpoints.map(c => [
        c.recordedDate.toISOString(),
        c.value.toString(),
        c.note || '',
        c.source || '',
        (c.confidence || 1).toString(),
        c.isAutomatic ? 'Yes' : 'No',
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
        .join('\n');

      return csvContent;

    } catch (error) {
      throw new Error(`Failed to export checkpoints: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Utility Methods
  // =============================================================================

  /**
   * Clear all mock checkpoints (for testing)
   */
  clearMockData(): void {
    mockCheckpoints = [];
  }

  /**
   * Get all mock checkpoints (for testing)
   */
  getAllMockData(): MetricCheckpoint[] {
    initializeMockCheckpoints();
    return [...mockCheckpoints];
  }

  /**
   * Set mock checkpoints (for testing)
   */
  setMockData(checkpoints: MetricCheckpoint[]): void {
    mockCheckpoints = [...checkpoints];
  }
}

// =============================================================================
// Default Instance
// =============================================================================

export const metricsApi = new MetricsApi();

export default metricsApi;