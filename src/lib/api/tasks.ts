/**
 * Tasks API Service - Goal Tasks and Subtasks Management
 *
 * This module provides API services for Task Management:
 * - Task and subtask CRUD operations
 * - Status management
 * - Progress tracking
 * - Assignment and collaboration
 * - Dependencies handling
 *
 * @fileoverview API service layer for goal tasks and subtasks
 * @version 1.0.0
 */

import { createMockTask, createMockSubtask } from '@/lib/mock-data/smart-goals';
import { Task, Subtask, TaskStatus, GoalPriority, ChecklistItem } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface CreateTaskRequest {
  goalId: string;
  title: string;
  description?: string;
  priority: GoalPriority;
  assignedTo?: string;
  estimatedHours?: number;
  dueDate?: Date;
  startDate?: Date;
  tags?: string[];
  dependencies?: string[];
  order?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: GoalPriority;
  assignedTo?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;
  progress?: number;
  tags?: string[];
  dependencies?: string[];
  order?: number;
  notes?: string;
}

export interface CreateSubtaskRequest {
  taskId: string;
  title: string;
  description?: string;
  priority: GoalPriority;
  assignedTo?: string;
  estimatedHours?: number;
  dueDate?: Date;
  tags?: string[];
  dependencies?: string[];
}

export interface UpdateSubtaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: GoalPriority;
  assignedTo?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  completedAt?: Date;
  progress?: number;
  tags?: string[];
  dependencies?: string[];
  notes?: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: GoalPriority[];
  assignedTo?: string[];
  tags?: string[];
  dueDate?: {
    start: Date;
    end: Date;
  };
  overdue?: boolean;
  completed?: boolean;
}

export interface TaskStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<GoalPriority, number>;
  completionRate: number;
  averageProgress: number;
  overdueCount: number;
  totalEstimatedHours: number;
  totalActualHours: number;
}

// =============================================================================
// Mock Data Management
// =============================================================================

let mockTasks: Task[] = [];
let mockSubtasks: Subtask[] = [];

const initializeMockTasks = () => {
  if (mockTasks.length === 0) {
    // Generate sample tasks for different goals
    const sampleGoalIds = ['goal-1', 'goal-2', 'goal-3', 'goal-4', 'goal-5'];

    sampleGoalIds.forEach(goalId => {
      const taskCount = Math.floor(Math.random() * 5) + 3; // 3-8 tasks per goal
      for (let i = 0; i < taskCount; i++) {
        const task = createMockTask(goalId);
        mockTasks.push(task);

        // Create subtasks for each task
        const subtaskCount = Math.floor(Math.random() * 4) + 1; // 1-4 subtasks per task
        for (let j = 0; j < subtaskCount; j++) {
          const subtask = createMockSubtask(task.id);
          mockSubtasks.push(subtask);
        }
      }
    });

    // Sort by creation date
    mockTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    mockSubtasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
// Tasks API Implementation
// =============================================================================

export class TasksApi {

  // =============================================================================
  // Task CRUD Operations
  // =============================================================================

  /**
   * Get all tasks for a goal
   */
  async getTasks(goalId: string, filters?: TaskFilters): Promise<Task[]> {
    try {
      await simulateDelay();
      simulateRandomError();

      initializeMockTasks();

      let goalTasks = mockTasks.filter(task => task.goalId === goalId && !task.isDeleted);

      // Apply filters
      if (filters) {
        if (filters.status && filters.status.length > 0) {
          goalTasks = goalTasks.filter(task => filters.status!.includes(task.status));
        }

        if (filters.priority && filters.priority.length > 0) {
          goalTasks = goalTasks.filter(task => filters.priority!.includes(task.priority));
        }

        if (filters.assignedTo && filters.assignedTo.length > 0) {
          goalTasks = goalTasks.filter(task =>
            task.assignedTo && filters.assignedTo!.includes(task.assignedTo)
          );
        }

        if (filters.tags && filters.tags.length > 0) {
          goalTasks = goalTasks.filter(task =>
            task.tags && filters.tags!.some(tag => task.tags!.includes(tag))
          );
        }

        if (filters.dueDate) {
          const { start, end } = filters.dueDate;
          goalTasks = goalTasks.filter(task => {
            if (!task.dueDate) return false;
            return task.dueDate >= start && task.dueDate <= end;
          });
        }

        if (filters.overdue) {
          const now = new Date();
          goalTasks = goalTasks.filter(task =>
            task.dueDate &&
            task.dueDate < now &&
            task.status !== TaskStatus.COMPLETED
          );
        }

        if (filters.completed !== undefined) {
          goalTasks = goalTasks.filter(task =>
            filters.completed ? task.status === TaskStatus.COMPLETED : task.status !== TaskStatus.COMPLETED
          );
        }
      }

      // Add subtasks to each task
      const tasksWithSubtasks = goalTasks.map(task => ({
        ...task,
        subtasks: mockSubtasks.filter(subtask => subtask.taskId === task.id && !subtask.isDeleted),
      }));

      return tasksWithSubtasks.sort((a, b) => a.order - b.order);

    } catch (error) {
      throw new Error(`Failed to fetch tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a specific task by ID
   */
  async getTask(id: string): Promise<Task> {
    try {
      await simulateDelay(200);
      simulateRandomError();

      initializeMockTasks();

      const task = mockTasks.find(t => t.id === id && !t.isDeleted);
      if (!task) {
        const error = new Error('Task not found') as any;
        error.status = 404;
        throw error;
      }

      // Add subtasks
      const subtasks = mockSubtasks.filter(subtask => subtask.taskId === task.id && !subtask.isDeleted);

      return {
        ...task,
        subtasks,
      };

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to fetch task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new task
   */
  async createTask(request: CreateTaskRequest): Promise<Task> {
    try {
      await simulateDelay(400);
      simulateRandomError();

      initializeMockTasks();

      const now = new Date();
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'current-user',
        updatedBy: 'current-user',
        isDeleted: false,
        title: request.title,
        description: request.description,
        status: TaskStatus.TODO,
        priority: request.priority,
        assignedTo: request.assignedTo,
        estimatedHours: request.estimatedHours,
        actualHours: undefined,
        dueDate: request.dueDate,
        startDate: request.startDate,
        completedAt: undefined,
        progress: 0,
        tags: request.tags || [],
        subtasks: [],
        checklist: [],
        dependencies: request.dependencies,
        goalId: request.goalId,
        order: request.order || mockTasks.filter(t => t.goalId === request.goalId).length + 1,
        notes: '',
        comments: [],
      };

      mockTasks.unshift(newTask);

      return { ...newTask };

    } catch (error) {
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    try {
      await simulateDelay(400);
      simulateRandomError();

      initializeMockTasks();

      const taskIndex = mockTasks.findIndex(t => t.id === id && !t.isDeleted);
      if (taskIndex === -1) {
        const error = new Error('Task not found') as any;
        error.status = 404;
        throw error;
      }

      const existingTask = mockTasks[taskIndex];
      const now = new Date();

      // Handle status transitions
      const isCompleting = updates.status === TaskStatus.COMPLETED && existingTask.status !== TaskStatus.COMPLETED;
      const completedAt = isCompleting ? now : (updates.completedAt || existingTask.completedAt);
      const progress = updates.status === TaskStatus.COMPLETED ? 100 : (updates.progress || existingTask.progress);

      const updatedTask: Task = {
        ...existingTask,
        ...updates,
        id: existingTask.id,
        createdAt: existingTask.createdAt,
        createdBy: existingTask.createdBy,
        goalId: existingTask.goalId,
        updatedAt: now,
        updatedBy: 'current-user',
        completedAt,
        progress,
        subtasks: existingTask.subtasks,
      };

      mockTasks[taskIndex] = updatedTask;

      return { ...updatedTask };

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a task (soft delete)
   */
  async deleteTask(id: string, permanent: boolean = false): Promise<void> {
    try {
      await simulateDelay(300);
      simulateRandomError();

      initializeMockTasks();

      const taskIndex = mockTasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
        const error = new Error('Task not found') as any;
        error.status = 404;
        throw error;
      }

      if (permanent) {
        // Hard delete - remove from array
        mockTasks.splice(taskIndex, 1);
        // Also delete all subtasks
        mockSubtasks = mockSubtasks.filter(s => s.taskId !== id);
      } else {
        // Soft delete
        const now = new Date();
        mockTasks[taskIndex] = {
          ...mockTasks[taskIndex],
          isDeleted: true,
          deletedAt: now,
          deletedBy: 'current-user',
          updatedAt: now,
          updatedBy: 'current-user',
        };

        // Also soft delete subtasks
        mockSubtasks
          .filter(s => s.taskId === id)
          .forEach(subtask => {
            const subtaskIndex = mockSubtasks.findIndex(s => s.id === subtask.id);
            if (subtaskIndex !== -1) {
              mockSubtasks[subtaskIndex] = {
                ...mockSubtasks[subtaskIndex],
                isDeleted: true,
                deletedAt: now,
                deletedBy: 'current-user',
                updatedAt: now,
                updatedBy: 'current-user',
              };
            }
          });
      }

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update task status
   */
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(id, { status });
  }

  /**
   * Update task progress
   */
  async updateTaskProgress(id: string, progress: number): Promise<Task> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    const status = progress === 100 ? TaskStatus.COMPLETED :
                  progress > 0 ? TaskStatus.IN_PROGRESS : TaskStatus.TODO;

    return this.updateTask(id, { progress, status });
  }

  // =============================================================================
  // Subtask Operations
  // =============================================================================

  /**
   * Get subtasks for a task
   */
  async getSubtasks(taskId: string): Promise<Subtask[]> {
    try {
      await simulateDelay(200);
      simulateRandomError();

      initializeMockTasks();

      return mockSubtasks
        .filter(subtask => subtask.taskId === taskId && !subtask.isDeleted)
        .map(subtask => ({ ...subtask }));

    } catch (error) {
      throw new Error(`Failed to fetch subtasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new subtask
   */
  async createSubtask(request: CreateSubtaskRequest): Promise<Subtask> {
    try {
      await simulateDelay(400);
      simulateRandomError();

      initializeMockTasks();

      const now = new Date();
      const newSubtask: Subtask = {
        id: `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'current-user',
        updatedBy: 'current-user',
        isDeleted: false,
        title: request.title,
        description: request.description,
        status: TaskStatus.TODO,
        priority: request.priority,
        assignedTo: request.assignedTo,
        estimatedHours: request.estimatedHours,
        actualHours: undefined,
        dueDate: request.dueDate,
        completedAt: undefined,
        progress: 0,
        tags: request.tags || [],
        checklist: [],
        dependencies: request.dependencies,
        taskId: request.taskId,
        notes: '',
        comments: [],
      };

      mockSubtasks.unshift(newSubtask);

      return { ...newSubtask };

    } catch (error) {
      throw new Error(`Failed to create subtask: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing subtask
   */
  async updateSubtask(id: string, updates: UpdateSubtaskRequest): Promise<Subtask> {
    try {
      await simulateDelay(400);
      simulateRandomError();

      initializeMockTasks();

      const subtaskIndex = mockSubtasks.findIndex(s => s.id === id && !s.isDeleted);
      if (subtaskIndex === -1) {
        const error = new Error('Subtask not found') as any;
        error.status = 404;
        throw error;
      }

      const existingSubtask = mockSubtasks[subtaskIndex];
      const now = new Date();

      // Handle status transitions
      const isCompleting = updates.status === TaskStatus.COMPLETED && existingSubtask.status !== TaskStatus.COMPLETED;
      const completedAt = isCompleting ? now : (updates.completedAt || existingSubtask.completedAt);
      const progress = updates.status === TaskStatus.COMPLETED ? 100 : (updates.progress || existingSubtask.progress);

      const updatedSubtask: Subtask = {
        ...existingSubtask,
        ...updates,
        id: existingSubtask.id,
        createdAt: existingSubtask.createdAt,
        createdBy: existingSubtask.createdBy,
        taskId: existingSubtask.taskId,
        updatedAt: now,
        updatedBy: 'current-user',
        completedAt,
        progress,
      };

      mockSubtasks[subtaskIndex] = updatedSubtask;

      return { ...updatedSubtask };

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to update subtask: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a subtask
   */
  async deleteSubtask(id: string, permanent: boolean = false): Promise<void> {
    try {
      await simulateDelay(300);
      simulateRandomError();

      initializeMockTasks();

      const subtaskIndex = mockSubtasks.findIndex(s => s.id === id);
      if (subtaskIndex === -1) {
        const error = new Error('Subtask not found') as any;
        error.status = 404;
        throw error;
      }

      if (permanent) {
        mockSubtasks.splice(subtaskIndex, 1);
      } else {
        const now = new Date();
        mockSubtasks[subtaskIndex] = {
          ...mockSubtasks[subtaskIndex],
          isDeleted: true,
          deletedAt: now,
          deletedBy: 'current-user',
          updatedAt: now,
          updatedBy: 'current-user',
        };
      }

    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new Error(`Failed to delete subtask: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Checklist Operations
  // =============================================================================

  /**
   * Add checklist item to task
   */
  async addChecklistItem(taskId: string, title: string, description?: string, isRequired: boolean = false): Promise<Task> {
    try {
      await simulateDelay(300);

      const task = await this.getTask(taskId);

      const newItem: ChecklistItem = {
        id: `checklist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user',
        updatedBy: 'current-user',
        title,
        description,
        isCompleted: false,
        order: task.checklist.length + 1,
        isRequired,
      };

      return this.updateTask(taskId, {
        // We would need to update the checklist array, but since we're using mock data
        // this would need special handling in the update logic
      });

    } catch (error) {
      throw new Error(`Failed to add checklist item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Bulk Operations
  // =============================================================================

  /**
   * Bulk update task statuses
   */
  async bulkUpdateTaskStatus(ids: string[], status: TaskStatus): Promise<Task[]> {
    try {
      await simulateDelay(600);
      simulateRandomError();

      const updatedTasks: Task[] = [];

      for (const id of ids) {
        try {
          const updatedTask = await this.updateTaskStatus(id, status);
          updatedTasks.push(updatedTask);
        } catch (error) {
          console.error(`Failed to update task ${id}:`, error);
          // Continue with other tasks
        }
      }

      return updatedTasks;

    } catch (error) {
      throw new Error(`Bulk task status update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Bulk delete tasks
   */
  async bulkDeleteTasks(ids: string[], permanent: boolean = false): Promise<void> {
    try {
      await simulateDelay(600);
      simulateRandomError();

      for (const id of ids) {
        try {
          await this.deleteTask(id, permanent);
        } catch (error) {
          console.error(`Failed to delete task ${id}:`, error);
          // Continue with other tasks
        }
      }

    } catch (error) {
      throw new Error(`Bulk task deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Analytics and Reporting
  // =============================================================================

  /**
   * Get task statistics for a goal
   */
  async getTaskStats(goalId: string): Promise<TaskStats> {
    try {
      await simulateDelay(300);
      simulateRandomError();

      const tasks = await this.getTasks(goalId);

      const total = tasks.length;

      const byStatus = Object.values(TaskStatus).reduce((acc, status) => {
        acc[status] = tasks.filter(t => t.status === status).length;
        return acc;
      }, {} as Record<TaskStatus, number>);

      const byPriority = Object.values(GoalPriority).reduce((acc, priority) => {
        acc[priority] = tasks.filter(t => t.priority === priority).length;
        return acc;
      }, {} as Record<GoalPriority, number>);

      const completedTasks = byStatus[TaskStatus.COMPLETED] || 0;
      const completionRate = total > 0 ? (completedTasks / total) * 100 : 0;

      const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
      const averageProgress = total > 0 ? totalProgress / total : 0;

      const now = new Date();
      const overdueCount = tasks.filter(task =>
        task.dueDate &&
        task.dueDate < now &&
        task.status !== TaskStatus.COMPLETED
      ).length;

      const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
      const totalActualHours = tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);

      return {
        total,
        byStatus,
        byPriority,
        completionRate,
        averageProgress,
        overdueCount,
        totalEstimatedHours,
        totalActualHours,
      };

    } catch (error) {
      throw new Error(`Failed to get task stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(goalId?: string): Promise<Task[]> {
    try {
      await simulateDelay(300);
      initializeMockTasks();

      let tasks = mockTasks.filter(t => !t.isDeleted);

      if (goalId) {
        tasks = tasks.filter(t => t.goalId === goalId);
      }

      const now = new Date();
      const overdueTasks = tasks.filter(task =>
        task.dueDate &&
        task.dueDate < now &&
        task.status !== TaskStatus.COMPLETED
      );

      // Add subtasks to each task
      return overdueTasks.map(task => ({
        ...task,
        subtasks: mockSubtasks.filter(subtask => subtask.taskId === task.id && !subtask.isDeleted),
      }));

    } catch (error) {
      throw new Error(`Failed to get overdue tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================================================
  // Utility Methods
  // =============================================================================

  /**
   * Clear all mock data (for testing)
   */
  clearMockData(): void {
    mockTasks = [];
    mockSubtasks = [];
  }

  /**
   * Get all mock data (for testing)
   */
  getAllMockData(): { tasks: Task[]; subtasks: Subtask[] } {
    initializeMockTasks();
    return { tasks: [...mockTasks], subtasks: [...mockSubtasks] };
  }

  /**
   * Set mock data (for testing)
   */
  setMockData(tasks: Task[], subtasks: Subtask[]): void {
    mockTasks = [...tasks];
    mockSubtasks = [...subtasks];
  }
}

// =============================================================================
// Default Instance
// =============================================================================

export const tasksApi = new TasksApi();

export default tasksApi;