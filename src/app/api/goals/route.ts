/**
 * Goals API Routes
 *
 * REST API endpoints for goal CRUD operations:
 * - GET /api/goals - List goals with filtering and pagination
 * - POST /api/goals - Create a new goal
 */

import { NextRequest, NextResponse } from 'next/server';

import { mockGoals } from '@/lib/mock-data/smart-goals';
import type { SmartGoal, GoalFilters, GoalSort } from '@/types/smart-goals.types';

// =============================================================================
// Types
// =============================================================================

interface GoalsListResponse {
  goals: SmartGoal[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

const parseFilters = (searchParams: URLSearchParams): GoalFilters => {
  const filters: GoalFilters = {};

  // Status filter
  const status = searchParams.get('status');
  if (status) {
    filters.status = status.split(',') as any[];
  }

  // Priority filter
  const priority = searchParams.get('priority');
  if (priority) {
    filters.priority = priority.split(',') as any[];
  }

  // Category filter
  const category = searchParams.get('category');
  if (category) {
    filters.category = category.split(',') as any[];
  }

  // Owner filter
  const ownerId = searchParams.get('ownerId');
  if (ownerId) {
    filters.ownerId = ownerId.split(',');
  }

  // Tags filter
  const tags = searchParams.get('tags');
  if (tags) {
    filters.tags = tags.split(',');
  }

  // Date range filter
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  if (startDate && endDate) {
    filters.dateRange = {
      start: new Date(startDate),
      end: new Date(endDate),
    };
  }

  // Search query
  const search = searchParams.get('search');
  if (search) {
    filters.searchQuery = search;
  }

  return filters;
};

const parseSort = (searchParams: URLSearchParams): GoalSort => {
  const sortField = searchParams.get('sortField') || 'updatedAt';
  const sortDirection = searchParams.get('sortDirection') || 'desc';

  return {
    field: sortField as keyof SmartGoal,
    direction: sortDirection as 'asc' | 'desc',
  };
};

const applyFilters = (goals: SmartGoal[], filters: GoalFilters): SmartGoal[] => {
  return goals.filter(goal => {
    // Status filter
    if (filters.status?.length && !filters.status.includes(goal.status)) {
      return false;
    }

    // Priority filter
    if (filters.priority?.length && !filters.priority.includes(goal.priority)) {
      return false;
    }

    // Category filter
    if (filters.category?.length && !filters.category.includes(goal.category)) {
      return false;
    }

    // Owner filter
    if (filters.ownerId?.length && !filters.ownerId.includes(goal.ownerId)) {
      return false;
    }

    // Tags filter
    if (filters.tags?.length) {
      const hasMatchingTag = filters.tags.some(tag =>
        goal.tags.some(goalTag => goalTag.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasMatchingTag) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const goalDate = new Date(goal.createdAt);
      if (goalDate < filters.dateRange.start || goalDate > filters.dateRange.end) {
        return false;
      }
    }

    // Search query
    if (filters.searchQuery) {
      const searchTerm = filters.searchQuery.toLowerCase();
      const searchFields = [
        goal.title,
        goal.description,
        goal.specificObjective,
        ...goal.tags,
        ...goal.successCriteria,
      ].join(' ').toLowerCase();

      if (!searchFields.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
};

const applySort = (goals: SmartGoal[], sort: GoalSort): SmartGoal[] => {
  return [...goals].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    let comparison = 0;

    // Handle different data types
    if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sort.direction === 'desc' ? -comparison : comparison;
  });
};

const applyPagination = (goals: SmartGoal[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedGoals = goals.slice(start, end);
  const hasMore = end < goals.length;

  return { goals: paginatedGoals, hasMore };
};

// =============================================================================
// GET /api/goals - List goals
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Max 100 items per page

    // Parse filters and sorting
    const filters = parseFilters(searchParams);
    const sort = parseSort(searchParams);

    // Apply filters and sorting
    let filteredGoals = applyFilters(mockGoals, filters);
    filteredGoals = applySort(filteredGoals, sort);

    // Apply pagination
    const { goals: paginatedGoals, hasMore } = applyPagination(filteredGoals, page, limit);

    const response: GoalsListResponse = {
      goals: paginatedGoals,
      total: filteredGoals.length,
      page,
      limit,
      hasMore,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching goals:', error);

    const errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: 'Failed to fetch goals',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// =============================================================================
// POST /api/goals - Create a new goal
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.description) {
      const errorResponse: ErrorResponse = {
        error: 'Validation Error',
        message: 'Title and description are required',
        code: 'MISSING_REQUIRED_FIELDS',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create new goal with generated ID and timestamps
    const newGoal: SmartGoal = {
      ...body,
      id: `goal-${Date.now()}`, // In production, use a proper UUID library
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user', // In production, get from authentication
      updatedBy: 'current-user',

      // Set defaults for missing fields
      progress: body.progress || 0,
      checkpoints: body.checkpoints || [],
      tasks: body.tasks || [],
      milestones: body.milestones || [],
      outcomes: body.outcomes || [],
      childGoalIds: body.childGoalIds || [],
      collaborators: body.collaborators || [],
      tags: body.tags || [],
      successCriteria: body.successCriteria || [],

      // Default visibility and archive status
      visibility: body.visibility || 'team',
      isArchived: false,
      isDeleted: false,
    };

    // In a real implementation, you would save to a database here
    // For now, we'll just return the created goal

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);

    const errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: 'Failed to create goal',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// =============================================================================
// Method Not Allowed handler
// =============================================================================

export async function PUT() {
  return NextResponse.json(
    { error: 'Method Not Allowed', message: 'PUT method not allowed on this endpoint' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method Not Allowed', message: 'DELETE method not allowed on this endpoint' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method Not Allowed', message: 'PATCH method not allowed on this endpoint' },
    { status: 405 }
  );
}