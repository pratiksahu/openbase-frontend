/**
 * Enhanced SMART Goal Detail Page
 *
 * Comprehensive display of a single SMART goal with all criteria visualized,
 * progress tracking, task management, and collaboration features.
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Target,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Users,
  Edit,
  Trash2,
  ArrowLeft,
  Download,
  Share2,
  BarChart3,
  ListChecks,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Trophy,
  Flag,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SmartScoreBadge } from '@/components/SmartScoreBadge/SmartScoreBadge';
import { mockGoals } from '@/lib/mock-data/smart-goals';
import type { SmartGoal, GoalStatus, TaskStatus } from '@/types/smart-goals.types';

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

const getTaskStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600';
    case 'in_progress':
      return 'text-blue-600';
    case 'blocked':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

const getDaysRemaining = (targetDate: Date): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateSmartCompleteness = (goal: SmartGoal): number => {
  let score = 0;
  const maxScore = 100;

  // Specific (20%)
  if (goal.description && goal.description.length > 50) score += 20;

  // Measurable (20%)
  if (goal.measurable && goal.measurable.metrics && goal.measurable.metrics.length > 0) {
    score += 20;
  }

  // Achievable (20%)
  if (goal.achievable && goal.achievable.resources && goal.achievable.resources.length > 0) {
    score += 20;
  }

  // Relevant (20%)
  if (goal.relevant && goal.relevant.rationale) {
    score += 20;
  }

  // Time-bound (20%)
  if (goal.timebound && goal.timebound.targetDate) {
    score += 20;
  }

  return Math.min(score, maxScore);
};

// =============================================================================
// Component: SMART Criteria Card
// =============================================================================

interface SmartCriteriaCardProps {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
  score?: number;
}

const SmartCriteriaCard: React.FC<SmartCriteriaCardProps> = ({
  title,
  icon: Icon,
  color,
  children,
  score,
}) => {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {score !== undefined && (
            <Badge variant="secondary">{score}%</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

// =============================================================================
// Main Component: SMART Goal Detail Page
// =============================================================================

export default function SmartGoalDetailPage() {
  const params = useParams();
  const [goal, setGoal] = useState<SmartGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate fetching goal data
    const loadGoal = async () => {
      setLoading(true);
      try {
        // Find goal from mock data
        const foundGoal = mockGoals.find(g => g.id === params.id);
        if (foundGoal) {
          setGoal(foundGoal);
        }
      } finally {
        setLoading(false);
      }
    };

    loadGoal();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading goal details...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Goal Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The goal you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/goals">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Goals
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(goal.timebound.targetDate);
  const isOverdue = daysRemaining < 0;
  const smartCompleteness = calculateSmartCompleteness(goal);
  const completedTasks = goal.tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = goal.tasks?.length || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/goals">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Goals
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Goal</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export Goal</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Goal Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-2xl">{goal.title}</CardTitle>
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status.replace('_', ' ')}
                </Badge>
                <SmartScoreBadge goal={goal} size="md" />
              </div>
              <CardDescription className="text-base">
                {goal.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Progress</p>
              <div className="flex items-center space-x-2">
                <Progress value={goal.progress} className="flex-1" />
                <span className="text-sm font-medium">{goal.progress}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                {formatDate(goal.timebound.targetDate)}
                {isOverdue && ` (${Math.abs(daysRemaining)} days overdue)`}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Priority</p>
              <div className="flex items-center space-x-1">
                <Flag className="h-4 w-4" />
                <span className="text-sm font-medium capitalize">{goal.priority}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Owner</p>
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avatars/svg?seed=${goal.ownerId}`}
                  />
                  <AvatarFallback className="text-xs">
                    {goal.ownerId.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{goal.ownerId}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{smartCompleteness}%</p>
                <p className="text-xs text-muted-foreground">SMART Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ListChecks className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
                <p className="text-xs text-muted-foreground">Tasks Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.abs(daysRemaining)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Days {isOverdue ? 'Overdue' : 'Remaining'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {(goal.collaborators?.length || 0) + 1}
                </p>
                <p className="text-xs text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SMART Criteria Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">SMART Criteria Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Specific */}
          <SmartCriteriaCard
            title="Specific"
            icon={Target}
            color="bg-blue-500"
            score={goal.description ? 100 : 0}
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Clear Objective</p>
              <p className="text-sm">{goal.description || 'Not defined'}</p>
            </div>
          </SmartCriteriaCard>

          {/* Measurable */}
          <SmartCriteriaCard
            title="Measurable"
            icon={BarChart3}
            color="bg-green-500"
            score={goal.measurable?.metrics ? 100 : 0}
          >
            <div className="space-y-2">
              {goal.measurable?.metrics?.map((metric, index) => (
                <div key={index}>
                  <p className="text-sm font-medium">{metric.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {metric.currentValue}/{metric.targetValue} {metric.unit}
                  </p>
                </div>
              ))}
              {!goal.measurable?.metrics && (
                <p className="text-sm text-muted-foreground">No metrics defined</p>
              )}
            </div>
          </SmartCriteriaCard>

          {/* Achievable */}
          <SmartCriteriaCard
            title="Achievable"
            icon={CheckCircle2}
            color="bg-yellow-500"
            score={goal.achievable?.resources ? 100 : 0}
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Resources</p>
              {goal.achievable?.resources?.map((resource, index) => (
                <p key={index} className="text-xs">• {resource}</p>
              ))}
              {!goal.achievable?.resources && (
                <p className="text-sm text-muted-foreground">Not assessed</p>
              )}
            </div>
          </SmartCriteriaCard>

          {/* Relevant */}
          <SmartCriteriaCard
            title="Relevant"
            icon={Lightbulb}
            color="bg-purple-500"
            score={goal.relevant?.rationale ? 100 : 0}
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Alignment</p>
              <p className="text-sm">
                {goal.relevant?.rationale || 'Not specified'}
              </p>
            </div>
          </SmartCriteriaCard>

          {/* Time-bound */}
          <SmartCriteriaCard
            title="Time-bound"
            icon={Calendar}
            color="bg-orange-500"
            score={goal.timebound?.targetDate ? 100 : 0}
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Timeline</p>
              <p className="text-sm">
                {formatDate(goal.timebound.startDate)} - {formatDate(goal.timebound.targetDate)}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.abs(daysRemaining)} days {isOverdue ? 'overdue' : 'left'}
              </p>
            </div>
          </SmartCriteriaCard>
        </div>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goal.timebound?.milestones?.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trophy className={`h-5 w-5 ${milestone.completed ? 'text-green-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-medium">{milestone.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {formatDate(milestone.date)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={milestone.completed ? 'default' : 'secondary'}>
                      {milestone.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
                {!goal.timebound?.milestones?.length && (
                  <p className="text-muted-foreground">No milestones defined</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isOverdue && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Goal Overdue</AlertTitle>
                    <AlertDescription>
                      This goal is {Math.abs(daysRemaining)} days overdue. Consider revising the timeline or breaking it into smaller milestones.
                    </AlertDescription>
                  </Alert>
                )}
                {goal.progress < 30 && daysRemaining < 30 && !isOverdue && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>At Risk</AlertTitle>
                    <AlertDescription>
                      With only {daysRemaining} days remaining and {goal.progress}% progress, this goal may need additional attention.
                    </AlertDescription>
                  </Alert>
                )}
                {smartCompleteness < 80 && (
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Improve SMART Criteria</AlertTitle>
                    <AlertDescription>
                      Your goal is {smartCompleteness}% SMART complete. Consider adding more specific metrics or milestones.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tasks & Subtasks</CardTitle>
                <Button size="sm">
                  <ListChecks className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goal.tasks?.map((task) => (
                  <div key={task.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2
                          className={`h-5 w-5 mt-0.5 ${getTaskStatusColor(task.status)}`}
                        />
                        <div className="space-y-1">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {task.status.replace('_', ' ')}
                            </Badge>
                            {task.dueDate && (
                              <span className="text-xs text-muted-foreground">
                                Due: {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!goal.tasks?.length && (
                  <p className="text-muted-foreground text-center py-4">
                    No tasks added yet. Break down your goal into actionable tasks.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goal.measurable?.metrics?.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{metric.name}</h4>
                      <Badge variant="outline">
                        {Math.round((metric.currentValue / metric.targetValue) * 100)}%
                      </Badge>
                    </div>
                    <Progress
                      value={(metric.currentValue / metric.targetValue) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Current: {metric.currentValue} {metric.unit}</span>
                      <span>Target: {metric.targetValue} {metric.unit}</span>
                    </div>
                  </div>
                ))}
                {!goal.measurable?.metrics?.length && (
                  <p className="text-muted-foreground text-center py-4">
                    No metrics defined. Add measurable indicators to track progress.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team & Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Owner</h4>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avatars/svg?seed=${goal.ownerId}`}
                      />
                      <AvatarFallback>
                        {goal.ownerId.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{goal.ownerId}</p>
                      <p className="text-sm text-muted-foreground">Goal Owner</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Collaborators</h4>
                  {goal.collaborators?.map((collaborator, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avatars/svg?seed=${collaborator.userId}`}
                        />
                        <AvatarFallback>
                          {collaborator.userId.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{collaborator.userId}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {collaborator.role.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {!goal.collaborators?.length && (
                    <p className="text-muted-foreground">
                      No collaborators added yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}