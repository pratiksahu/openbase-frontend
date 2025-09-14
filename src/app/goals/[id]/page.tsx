/**
 * Goal Overview Page
 *
 * Main overview page for individual goals showing summary information,
 * SMART criteria details, progress overview, and key metrics.
 */

import React from 'react';
import { notFound } from 'next/navigation';
import {
  Target,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Activity,
  Flag,
  Star,
  BarChart3,
  GitBranch,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { SmartScoreBadge } from '@/components/SmartScoreBadge/SmartScoreBadge';
import { BreakdownTree } from '@/components/BreakdownTree/BreakdownTree';

import type { SmartGoal, Task, Milestone } from '@/types/smart-goals.types';
import { mockGoals } from '@/lib/mock-data/smart-goals';

// =============================================================================
// Types and Interfaces
// =============================================================================

interface OverviewPageProps {
  params: {
    id: string;
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

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

const getProgressColor = (progress: number): string => {
  if (progress >= 80) return 'text-green-600';
  if (progress >= 60) return 'text-blue-600';
  if (progress >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

// =============================================================================
// Data Fetching
// =============================================================================

async function getGoal(id: string): Promise<SmartGoal | null> {
  // TODO: Replace with actual API call
  return mockGoals.find(goal => goal.id === id) || null;
}

// =============================================================================
// Components
// =============================================================================

interface SmartCriteriaCardProps {
  goal: SmartGoal;
}

const SmartCriteriaCard: React.FC<SmartCriteriaCardProps> = ({ goal }) => {
  const criteria = [
    {
      letter: 'S',
      title: 'Specific',
      description: goal.specificObjective,
      icon: Target,
      score: 9, // Mock score
    },
    {
      letter: 'M',
      title: 'Measurable',
      description: `Target: ${goal.measurable.targetValue} ${goal.measurable.unit}`,
      icon: BarChart3,
      score: 8, // Mock score
    },
    {
      letter: 'A',
      title: 'Achievable',
      description: `${goal.achievability.successProbability * 100}% success probability`,
      icon: CheckCircle,
      score: 7, // Mock score
    },
    {
      letter: 'R',
      title: 'Relevant',
      description: `${goal.relevance.strategyAlignments.length} strategic alignments`,
      icon: Star,
      score: 8, // Mock score
    },
    {
      letter: 'T',
      title: 'Time-bound',
      description: `Due ${formatDate(goal.timebound.targetDate)}`,
      icon: Clock,
      score: 9, // Mock score
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>SMART Criteria</span>
          <SmartScoreBadge goal={goal} size="sm" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {criteria.map((criterion) => (
          <div key={criterion.letter} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{criterion.letter}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{criterion.title}</h4>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < criterion.score
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{criterion.score}/10</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {criterion.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

interface ProgressOverviewProps {
  goal: SmartGoal;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ goal }) => {
  const daysRemaining = getDaysRemaining(goal.timebound.targetDate);
  const isOverdue = daysRemaining < 0;
  const completedTasks = goal.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = goal.tasks.length;
  const completedMilestones = goal.milestones.filter(milestone => milestone.isCompleted).length;
  const totalMilestones = goal.milestones.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Progress Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className={`text-sm font-bold ${getProgressColor(goal.progress)}`}>
              {goal.progress}%
            </span>
          </div>
          <Progress value={goal.progress} className="h-3" />
        </div>

        <Separator />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{completedTasks}/{totalTasks}</div>
            <div className="text-xs text-muted-foreground">Tasks Completed</div>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedMilestones}/{totalMilestones}</div>
            <div className="text-xs text-muted-foreground">Milestones Achieved</div>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className={`text-2xl font-bold ${isOverdue ? 'text-red-600' : 'text-orange-600'}`}>
              {Math.abs(daysRemaining)}
            </div>
            <div className="text-xs text-muted-foreground">
              Days {isOverdue ? 'Overdue' : 'Remaining'}
            </div>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{goal.collaborators.length + 1}</div>
            <div className="text-xs text-muted-foreground">Team Members</div>
          </div>
        </div>

        {/* Current Metric Value */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Metric</span>
            <span className="text-sm text-muted-foreground">
              Target: {goal.measurable.targetValue} {goal.measurable.unit}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              {goal.measurable.currentValue} {goal.measurable.unit}
            </div>
            <Badge variant="secondary">
              {Math.round((goal.measurable.currentValue / goal.measurable.targetValue) * 100)}% of target
            </Badge>
          </div>
          <Progress
            value={(goal.measurable.currentValue / goal.measurable.targetValue) * 100}
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface NextActionsProps {
  goal: SmartGoal;
}

const NextActions: React.FC<NextActionsProps> = ({ goal }) => {
  // Get upcoming tasks and milestones
  const upcomingTasks = goal.tasks
    .filter(task => task.status !== 'completed' && task.status !== 'cancelled')
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  const upcomingMilestones = goal.milestones
    .filter(milestone => !milestone.isCompleted)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Flag className="h-5 w-5" />
          <span>Next Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming Tasks */}
        <div>
          <h4 className="font-medium mb-2 text-sm text-muted-foreground">Upcoming Tasks</h4>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming tasks</p>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-2 p-2 bg-muted/30 rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-muted-foreground">
                        Due {formatDate(task.dueDate)}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Upcoming Milestones */}
        <div>
          <h4 className="font-medium mb-2 text-sm text-muted-foreground">Next Milestones</h4>
          {upcomingMilestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming milestones</p>
          ) : (
            <div className="space-y-2">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center space-x-2 p-2 bg-muted/30 rounded">
                  <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Target {formatDate(milestone.targetDate)}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {milestone.progress}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface RecentActivityProps {
  goal: SmartGoal;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ goal }) => {
  // Mock recent activity data
  const activities = [
    {
      id: '1',
      type: 'task_completed',
      title: 'Task "Research competitors" completed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      user: goal.ownerId,
    },
    {
      id: '2',
      type: 'milestone_progress',
      title: 'Milestone "Market Research" updated to 80%',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      user: goal.collaborators[0] || goal.ownerId,
    },
    {
      id: '3',
      type: 'metric_update',
      title: 'Current value updated to 150 units',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      user: goal.ownerId,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return CheckCircle;
      case 'milestone_progress':
        return Flag;
      case 'metric_update':
        return BarChart3;
      default:
        return Activity;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${activity.user}`} />
                      <AvatarFallback className="text-xs">
                        {activity.user.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// Main Overview Page Component
// =============================================================================

export default async function GoalOverviewPage({ params }: OverviewPageProps) {
  const goal = await getGoal(params.id);

  if (!goal) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* SMART Criteria */}
        <SmartCriteriaCard goal={goal} />

        {/* Breakdown Tree Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>Goal Breakdown</span>
              </div>
              <Button variant="outline" size="sm">
                View Full Tree
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownTree
              goal={goal}
              readOnly={true}
              showControls={false}
              maxDepth={2}
              className="max-h-96"
            />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity goal={goal} />
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Progress Overview */}
        <ProgressOverview goal={goal} />

        {/* Next Actions */}
        <NextActions goal={goal} />

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Quick Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Success Probability</span>
              <span className="font-medium">
                {Math.round(goal.achievability.successProbability * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Relevance Score</span>
              <span className="font-medium">
                {Math.round(goal.relevance.relevanceScore * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Value Score</span>
              <span className="font-medium">
                {Math.round(goal.relevance.valueScore * 100)}%
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="font-medium">{formatDate(goal.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="font-medium">{formatDate(goal.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}