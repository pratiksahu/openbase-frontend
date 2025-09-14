/**
 * Individual Goal API Routes
 *
 * REST API endpoints for individual goal operations:
 * - GET /api/goals/[id] - Get a specific goal
 * - PUT /api/goals/[id] - Update a specific goal
 * - DELETE /api/goals/[id] - Delete a specific goal
 * - PATCH /api/goals/[id] - Partial update of a specific goal
 */

import { NextRequest, NextResponse } from 'next/server';

import { mockGoals } from '@/lib/mock-data/smart-goals';
import type { SmartGoal } from '@/types/smart-goals.types';

// =============================================================================
// Types
// =============================================================================

interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
}

interface RouteParams {
  params: {
    id: string;
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

const findGoalById = (id: string): SmartGoal | null => {
  return mockGoals.find(goal => goal.id === id) || null;
};

const validateGoalUpdate = (update: Partial<SmartGoal>): string[] => {
  const errors: string[] = [];

  // Validate title
  if (update.title !== undefined && (!update.title || update.title.trim().length === 0)) {
    errors.push('Title cannot be empty');
  }

  // Validate description
  if (update.description !== undefined && (!update.description || update.description.trim().length === 0)) {
    errors.push('Description cannot be empty');
  }

  // Validate progress
  if (update.progress !== undefined && (update.progress < 0 || update.progress > 100)) {
    errors.push('Progress must be between 0 and 100');
  }

  // Validate dates
  if (update.timebound?.startDate && update.timebound?.targetDate) {
    if (new Date(update.timebound.startDate) >= new Date(update.timebound.targetDate)) {
      errors.push('Start date must be before target date');
    }
  }

  // Validate SMART criteria
  if (update.measurable) {
    if (update.measurable.targetValue <= 0) {
      errors.push('Target value must be greater than 0');
    }
    if (update.measurable.currentValue < 0) {
      errors.push('Current value cannot be negative');
    }
  }

  return errors;
};

// =============================================================================
// GET /api/goals/[id] - Get a specific goal
// =============================================================================

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const goal = findGoalById(params.id);

    if (!goal) {
      const errorResponse: ErrorResponse = {
        error: 'Not Found',
        message: `Goal with id "${params.id}" not found`,
        code: 'GOAL_NOT_FOUND',
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Check if goal is soft deleted
    if (goal.isDeleted) {
      const errorResponse: ErrorResponse = {
        error: 'Gone',
        message: 'Goal has been deleted',
        code: 'GOAL_DELETED',
      };
      return NextResponse.json(errorResponse, { status: 410 });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);

    const errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: 'Failed to fetch goal',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// =============================================================================
// PUT /api/goals/[id] - Update a specific goal (full replacement)
// =============================================================================

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const existingGoal = findGoalById(params.id);

    if (!existingGoal) {
      const errorResponse: ErrorResponse = {
        error: 'Not Found',
        message: `Goal with id "${params.id}" not found`,
        code: 'GOAL_NOT_FOUND',
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    if (existingGoal.isDeleted) {
      const errorResponse: ErrorResponse = {
        error: 'Gone',
        message: 'Cannot update a deleted goal',
        code: 'GOAL_DELETED',
      };
      return NextResponse.json(errorResponse, { status: 410 });
    }

    const body = await request.json();

    // Validate the update
    const validationErrors = validateGoalUpdate(body);
    if (validationErrors.length > 0) {
      const errorResponse: ErrorResponse = {
        error: 'Validation Error',
        message: validationErrors.join('; '),
        code: 'VALIDATION_FAILED',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create updated goal (preserve read-only fields)
    const updatedGoal: SmartGoal = {
      ...body,
      id: existingGoal.id, // Preserve ID
      createdAt: existingGoal.createdAt, // Preserve creation timestamp
      createdBy: existingGoal.createdBy, // Preserve creator
      updatedAt: new Date(), // Update timestamp
      updatedBy: 'current-user', // In production, get from authentication
      isDeleted: existingGoal.isDeleted, // Preserve deletion status
      deletedAt: existingGoal.deletedAt,
      deletedBy: existingGoal.deletedBy,
    };

    // In a real implementation, you would save to a database here
    // For now, we'll just return the updated goal

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);

    const errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: 'Failed to update goal',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// =============================================================================
// PATCH /api/goals/[id] - Partial update of a specific goal
// =============================================================================

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const existingGoal = findGoalById(params.id);

    if (!existingGoal) {
      const errorResponse: ErrorResponse = {
        error: 'Not Found',
        message: `Goal with id "${params.id}" not found`,
        code: 'GOAL_NOT_FOUND',
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    if (existingGoal.isDeleted) {
      const errorResponse: ErrorResponse = {
        error: 'Gone',
        message: 'Cannot update a deleted goal',
        code: 'GOAL_DELETED',
      };
      return NextResponse.json(errorResponse, { status: 410 });
    }

    const updates = await request.json();

    // Validate the partial update
    const validationErrors = validateGoalUpdate(updates);
    if (validationErrors.length > 0) {
      const errorResponse: ErrorResponse = {
        error: 'Validation Error',
        message: validationErrors.join('; '),
        code: 'VALIDATION_FAILED',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create updated goal by merging changes
    const updatedGoal: SmartGoal = {
      ...existingGoal,
      ...updates,
      // Preserve read-only fields
      id: existingGoal.id,
      createdAt: existingGoal.createdAt,
      createdBy: existingGoal.createdBy,
      updatedAt: new Date(),
      updatedBy: 'current-user', // In production, get from authentication
      isDeleted: existingGoal.isDeleted,
      deletedAt: existingGoal.deletedAt,
      deletedBy: existingGoal.deletedBy,
    };

    // In a real implementation, you would save to a database here
    // For now, we'll just return the updated goal

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Error partially updating goal:', error);

    const errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: 'Failed to update goal',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// =============================================================================
// DELETE /api/goals/[id] - Delete a specific goal (soft delete)
// =============================================================================

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const existingGoal = findGoalById(params.id);

    if (!existingGoal) {
      const errorResponse: ErrorResponse = {
        error: 'Not Found',
        message: `Goal with id "${params.id}" not found`,
        code: 'GOAL_NOT_FOUND',
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    if (existingGoal.isDeleted) {
      const errorResponse: ErrorResponse = {
        error: 'Gone',
        message: 'Goal is already deleted',
        code: 'GOAL_ALREADY_DELETED',
      };
      return NextResponse.json(errorResponse, { status: 410 });
    }

    // Check for query parameter to determine delete type
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      // Hard delete - in a real implementation, you would remove from database
      return NextResponse.json(
        { message: 'Goal permanently deleted', id: params.id },
        { status: 200 }
      );
    } else {
      // Soft delete - mark as deleted
      const deletedGoal: SmartGoal = {
        ...existingGoal,
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: 'current-user', // In production, get from authentication
        updatedAt: new Date(),
        updatedBy: 'current-user',
      };

      // In a real implementation, you would save to a database here
      return NextResponse.json(
        { message: 'Goal soft deleted', id: params.id, goal: deletedGoal },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error deleting goal:', error);

    const errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: 'Failed to delete goal',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// =============================================================================
// Method Not Allowed handlers
// =============================================================================

export async function POST() {
  return NextResponse.json(
    { error: 'Method Not Allowed', message: 'POST method not allowed on individual goal endpoint' },
    { status: 405 }
  );
}