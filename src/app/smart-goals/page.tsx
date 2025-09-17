/**
 * SMART Goals Main Page
 *
 * Enhanced listing page for SMART goals with advanced filtering,
 * SMART criteria visualization, and quick actions.
 */

'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Filter,
  Search,
  LayoutGrid,
  List,
  Target,
  TrendingUp,
  Clock,
  Users,
  ChevronDown,
  BarChart3,
  CheckCircle2,
  Lightbulb,
  Calendar,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SmartScoreBadge } from '@/components/SmartScoreBadge/SmartScoreBadge';
import { mockGoals } from '@/lib/mock-data/smart-goals';
import type { SmartGoal, GoalStatus, GoalPriority } from '@/types/smart-goals.types';

// =============================================================================
// Types
// =============================================================================

interface SmartFilters {
  minScore?: number;
  hasSpecific: boolean;
  hasMeasurable: boolean;
  hasAchievable: boolean;
  hasRelevant: boolean;
  hasTimebound: boolean;
}

interface Filters {
  search: string;
  status: GoalStatus[];
  priority: GoalPriority[];
  smart: SmartFilters;
}

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

const getDaysRemaining = (targetDate: Date): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateSmartScore = (goal: SmartGoal): number => {
  let score = 0;

  // Specific (20 points)
  if (goal.description && goal.description.length > 50) score += 20;

  // Measurable (20 points)
  if (goal.measurable && goal.measurable.targetValue > 0) score += 20;

  // Achievable (20 points)
  if (goal.achievability && goal.achievability.requiredResources && goal.achievability.requiredResources.length > 0) score += 20;

  // Relevant (20 points)
  if (goal.relevance && goal.relevance.rationale) score += 20;

  // Time-bound (20 points)
  if (goal.timebound && goal.timebound.targetDate) score += 20;

  return score;
};

// =============================================================================
// Component: SMART Goal Card
// =============================================================================

interface SmartGoalCardProps {
  goal: SmartGoal;
  view: 'grid' | 'list';
}

const SmartGoalCard: React.FC<SmartGoalCardProps> = ({ goal, view }) => {
  const daysRemaining = getDaysRemaining(goal.timebound.targetDate);
  const isOverdue = daysRemaining < 0;
  const smartScore = calculateSmartScore(goal);
  const completedTasks = goal.tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = goal.tasks?.length || 0;

  if (view === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Link
                  href={`/smart-goals/${goal.id}`}
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  {goal.title}
                </Link>
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status.replace('_', ' ')}
                </Badge>
                <SmartScoreBadge goal={goal} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {goal.description}
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">SMART: {smartScore}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{completedTasks}/{totalTasks} tasks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                    {isOverdue ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{goal.progress}%</p>
                <Progress value={goal.progress} className="w-20 h-2" />
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/smart-goals/${goal.id}`}>View</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">
            <Link
              href={`/smart-goals/${goal.id}`}
              className="hover:text-primary transition-colors"
            >
              {goal.title}
            </Link>
          </CardTitle>
          <SmartScoreBadge goal={goal} size="sm" />
        </div>
        <CardDescription className="line-clamp-2">
          {goal.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          {/* SMART Criteria Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  goal.description ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}
                title="Specific"
              >
                S
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  goal.measurable && goal.measurable.targetValue > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}
                title="Measurable"
              >
                M
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  goal.achievability && goal.achievability.requiredResources?.length > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                }`}
                title="Achievable"
              >
                A
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  goal.relevance && goal.relevance.rationale ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                }`}
                title="Relevant"
              >
                R
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  goal.timebound?.targetDate ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                }`}
                title="Time-bound"
              >
                T
              </div>
            </div>
            <Badge className={getStatusColor(goal.status)}>
              {goal.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                {isOverdue ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}
              </span>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/smart-goals/${goal.id}`}>View →</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// Main Component: SMART Goals Page
// =============================================================================

export default function SmartGoalsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: [],
    priority: [],
    smart: {
      hasSpecific: false,
      hasMeasurable: false,
      hasAchievable: false,
      hasRelevant: false,
      hasTimebound: false,
    },
  });

  // Filter goals based on criteria
  const filteredGoals = useMemo(() => {
    return mockGoals.filter(goal => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!goal.title.toLowerCase().includes(searchLower) &&
            !goal.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(goal.status)) {
        return false;
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(goal.priority)) {
        return false;
      }

      // SMART filters
      if (filters.smart.hasSpecific && (!goal.description || goal.description.length < 50)) {
        return false;
      }
      if (filters.smart.hasMeasurable && (!goal.measurable || goal.measurable.targetValue <= 0)) {
        return false;
      }
      if (filters.smart.hasAchievable && (!goal.achievability || !goal.achievability.requiredResources || goal.achievability.requiredResources.length === 0)) {
        return false;
      }
      if (filters.smart.hasRelevant && !goal.relevance?.rationale) {
        return false;
      }
      if (filters.smart.hasTimebound && !goal.timebound?.targetDate) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredGoals.length;
    const active = filteredGoals.filter(g => g.status === 'active').length;
    const completed = filteredGoals.filter(g => g.status === 'completed').length;
    const avgProgress = total > 0
      ? Math.round(filteredGoals.reduce((acc, g) => acc + g.progress, 0) / total)
      : 0;
    const avgSmartScore = total > 0
      ? Math.round(filteredGoals.reduce((acc, g) => acc + calculateSmartScore(g), 0) / total)
      : 0;

    return { total, active, completed, avgProgress, avgSmartScore };
  }, [filteredGoals]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SMART Goals</h1>
          <p className="text-muted-foreground mt-1">
            Manage your goals with Specific, Measurable, Achievable, Relevant, and Time-bound criteria
          </p>
        </div>
        <Button asChild>
          <Link href="/goals/new">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.avgProgress}%</p>
                <p className="text-xs text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.avgSmartScore}%</p>
                <p className="text-xs text-muted-foreground">Avg SMART</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search goals..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status
                {filters.status.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.status.length}
                  </Badge>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['draft', 'active', 'on_hold', 'completed', 'cancelled', 'overdue'].map(status => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={filters.status.includes(status as GoalStatus)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters({
                        ...filters,
                        status: [...filters.status, status as GoalStatus],
                      });
                    } else {
                      setFilters({
                        ...filters,
                        status: filters.status.filter(s => s !== status),
                      });
                    }
                  }}
                >
                  {status.replace('_', ' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* SMART Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                SMART
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>SMART Criteria</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.smart.hasSpecific}
                onCheckedChange={(checked) =>
                  setFilters({
                    ...filters,
                    smart: { ...filters.smart, hasSpecific: checked },
                  })
                }
              >
                Has Specific Objective
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.smart.hasMeasurable}
                onCheckedChange={(checked) =>
                  setFilters({
                    ...filters,
                    smart: { ...filters.smart, hasMeasurable: checked },
                  })
                }
              >
                Has Measurable Metrics
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.smart.hasAchievable}
                onCheckedChange={(checked) =>
                  setFilters({
                    ...filters,
                    smart: { ...filters.smart, hasAchievable: checked },
                  })
                }
              >
                Has Achievable Plan
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.smart.hasRelevant}
                onCheckedChange={(checked) =>
                  setFilters({
                    ...filters,
                    smart: { ...filters.smart, hasRelevant: checked },
                  })
                }
              >
                Has Relevant Context
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.smart.hasTimebound}
                onCheckedChange={(checked) =>
                  setFilters({
                    ...filters,
                    smart: { ...filters.smart, hasTimebound: checked },
                  })
                }
              >
                Has Timeline
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Goals Display */}
      {filteredGoals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No goals found</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.status.length > 0 || Object.values(filters.smart).some(v => v)
                ? 'Try adjusting your filters'
                : 'Create your first SMART goal to get started'}
            </p>
            <Button asChild>
              <Link href="/goals/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {filteredGoals.map(goal => (
            <SmartGoalCard key={goal.id} goal={goal} view={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}