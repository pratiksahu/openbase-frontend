/**
 * Goals List Page
 *
 * Main page displaying all goals with filtering, sorting, search,
 * and grid/list view toggle functionality.
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Eye,
  MoreHorizontal,
  Plus,
  Target,
  TrendingUp,
  Users,
  Archive,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SmartScoreBadge } from '@/components/SmartScoreBadge/SmartScoreBadge';

import type { SmartGoal, GoalStatus, GoalPriority } from '@/types/smart-goals.types';
import { mockGoals } from '@/lib/mock-data/smart-goals';

// =============================================================================
// Types and Interfaces
// =============================================================================

interface GoalFilters {
  status?: GoalStatus[];
  priority?: GoalPriority[];
  owner?: string[];
  search?: string;
}

interface GoalSort {
  field: 'createdAt' | 'updatedAt' | 'progress' | 'title' | 'priority';
  direction: 'asc' | 'desc';
}

type ViewMode = 'grid' | 'list';

// =============================================================================
// Helper Functions
// =============================================================================

const getStatusColor = (status: GoalStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    case 'on_hold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'overdue':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getPriorityColor = (priority: GoalPriority): string => {
  switch (priority) {
    case 'critical':
      return 'text-red-600 dark:text-red-400';
    case 'high':
      return 'text-orange-600 dark:text-orange-400';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'low':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const getDaysRemaining = (targetDate: Date): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// =============================================================================
// Goal Card Components
// =============================================================================

interface GoalCardProps {
  goal: SmartGoal;
  viewMode: ViewMode;
  onEdit?: (goal: SmartGoal) => void;
  onClone?: (goal: SmartGoal) => void;
  onArchive?: (goal: SmartGoal) => void;
  onDelete?: (goal: SmartGoal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  viewMode,
  onEdit,
  onClone,
  onArchive,
  onDelete
}) => {
  const daysRemaining = getDaysRemaining(goal.timebound.targetDate);
  const isOverdue = daysRemaining < 0;

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between space-x-4">
            {/* Goal Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <Link
                    href={`/goals/${goal.id}`}
                    className="text-lg font-semibold hover:text-primary line-clamp-1"
                  >
                    {goal.title}
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {goal.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center space-x-4">
              {/* Progress */}
              <div className="min-w-[120px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>

              {/* SMART Score */}
              <SmartScoreBadge goal={goal} size="sm" />

              {/* Status */}
              <Badge className={getStatusColor(goal.status)}>
                {goal.status.replace('_', ' ')}
              </Badge>

              {/* Due Date */}
              <div className="text-right min-w-[80px]">
                <div className="text-xs text-muted-foreground">Due</div>
                <div className={`text-sm font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                  {isOverdue ? `${Math.abs(daysRemaining)}d ago` : `${daysRemaining}d`}
                </div>
              </div>

              {/* Owner */}
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${goal.ownerId}`} />
                <AvatarFallback>{goal.ownerId.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/goals/${goal.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(goal)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onClone?.(goal)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Clone
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onArchive?.(goal)}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(goal)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/goals/${goal.id}`}>
              <h3 className="font-semibold group-hover:text-primary line-clamp-2">
                {goal.title}
              </h3>
            </Link>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getStatusColor(goal.status)} variant="secondary">
                {goal.status.replace('_', ' ')}
              </Badge>
              <SmartScoreBadge goal={goal} size="sm" />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/goals/${goal.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(goal)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClone?.(goal)}>
                <Copy className="h-4 w-4 mr-2" />
                Clone
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onArchive?.(goal)}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(goal)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {goal.description}
        </p>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {goal.collaborators.length > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{goal.collaborators.length + 1}</span>
              </div>
            )}
            <Avatar className="h-5 w-5">
              <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${goal.ownerId}`} />
              <AvatarFallback className="text-xs">{goal.ownerId.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// Empty State Component
// =============================================================================

const EmptyState: React.FC<{ hasFilters: boolean }> = ({ hasFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {hasFilters ? 'No goals found' : 'No goals yet'}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {hasFilters
          ? 'Try adjusting your filters to see more goals.'
          : 'Create your first SMART goal to get started on your journey to success.'
        }
      </p>
      <Button asChild>
        <Link href="/goals/new">
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Goal
        </Link>
      </Button>
    </div>
  );
};

// =============================================================================
// Main Goals Page Component
// =============================================================================

export default function GoalsPage() {
  const [goals] = useState<SmartGoal[]>(mockGoals);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<GoalFilters>({});
  const [sort, setSort] = useState<GoalSort>({ field: 'updatedAt', direction: 'desc' });

  // Filter and sort goals
  const filteredGoals = useMemo(() => {
    let filtered = goals.filter(goal => {
      // Status filter
      if (filters.status?.length && !filters.status.includes(goal.status)) {
        return false;
      }

      // Priority filter
      if (filters.priority?.length && !filters.priority.includes(goal.priority)) {
        return false;
      }

      // Owner filter
      if (filters.owner?.length && !filters.owner.includes(goal.ownerId)) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          goal.title.toLowerCase().includes(searchTerm) ||
          goal.description.toLowerCase().includes(searchTerm) ||
          goal.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [goals, filters, sort]);

  const handleGoalEdit = (goal: SmartGoal) => {
    // TODO: Navigate to edit page
    console.log('Edit goal:', goal.id);
  };

  const handleGoalClone = (goal: SmartGoal) => {
    // TODO: Clone goal
    console.log('Clone goal:', goal.id);
  };

  const handleGoalArchive = (goal: SmartGoal) => {
    // TODO: Archive goal
    console.log('Archive goal:', goal.id);
  };

  const handleGoalDelete = (goal: SmartGoal) => {
    // TODO: Delete goal
    console.log('Delete goal:', goal.id);
  };

  const hasFilters = Object.values(filters).some(value =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{goals.length}</div>
                <div className="text-xs text-muted-foreground">Total Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {goals.filter(g => g.status === 'active').length}
                </div>
                <div className="text-xs text-muted-foreground">Active Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {goals.filter(g => getDaysRemaining(g.timebound.targetDate) < 0).length}
                </div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) || 0}%
                </div>
                <div className="text-xs text-muted-foreground">Avg Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center space-x-4">
        <Select onValueChange={(value) => setSort({ ...sort, field: value as any })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Last Updated</SelectItem>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSort({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
        >
          {sort.direction === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      {/* Goals Grid/List */}
      {filteredGoals.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              viewMode={viewMode}
              onEdit={handleGoalEdit}
              onClone={handleGoalClone}
              onArchive={handleGoalArchive}
              onDelete={handleGoalDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}