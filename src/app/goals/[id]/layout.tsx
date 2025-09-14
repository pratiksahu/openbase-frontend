/**
 * Goal Detail Layout Component
 *
 * Layout for individual goal pages with header, navigation tabs,
 * and action menu. Provides consistent structure for all goal views.
 */

import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  MoreHorizontal,
  Edit,
  Copy,
  Archive,
  Trash2,
  Share,
  Eye,
  Kanban,
  BarChart3,
  CheckCircle,
  GitBranch,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { SmartScoreBadge } from '@/components/SmartScoreBadge/SmartScoreBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockGoals } from '@/lib/mock-data/smart-goals';
import type { SmartGoal, GoalStatus } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

interface GoalLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
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
// Goal Data Fetching (Mock)
// =============================================================================

async function getGoal(id: string): Promise<SmartGoal | null> {
  // TODO: Replace with actual API call
  return mockGoals.find((goal: SmartGoal) => goal.id === id) || null;
}

// =============================================================================
// Breadcrumb Component
// =============================================================================

interface BreadcrumbProps {
  goal: SmartGoal;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ goal }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/goals" className="hover:text-foreground">
        Goals
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium line-clamp-1">
        {goal.title}
      </span>
    </nav>
  );
};

// =============================================================================
// Goal Header Component
// =============================================================================

interface GoalHeaderProps {
  goal: SmartGoal;
}

const GoalHeader: React.FC<GoalHeaderProps> = ({ goal }) => {
  const daysRemaining = getDaysRemaining(goal.timebound.targetDate);
  const isOverdue = daysRemaining < 0;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb goal={goal} />

      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/goals" className="flex items-center">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Goals
        </Link>
      </Button>

      {/* Header Content */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold tracking-tight">{goal.title}</h1>
            <SmartScoreBadge goal={goal} size="lg" showTooltip />
          </div>

          <p className="text-lg text-muted-foreground line-clamp-2">
            {goal.description}
          </p>

          {/* Status and Meta Info */}
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(goal.status)}>
              {goal.status.replace('_', ' ')}
            </Badge>

            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Due {formatDate(goal.timebound.targetDate)}
              </span>
              <span className={`ml-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                ({isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`})
              </span>
            </div>

            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated {formatDate(goal.updatedAt)}</span>
            </div>

            {goal.collaborators.length > 0 && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{goal.collaborators.length + 1} members</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="max-w-md space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>
        </div>

        {/* Action Menu */}
        <div className="flex items-center space-x-2">
          {/* Team Members */}
          <div className="flex items-center -space-x-2">
            <Avatar className="h-8 w-8 ring-2 ring-background">
              <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${goal.ownerId}`} />
              <AvatarFallback className="text-xs">
                {goal.ownerId.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {goal.collaborators.slice(0, 3).map((collaboratorId) => (
              <Avatar key={collaboratorId} className="h-8 w-8 ring-2 ring-background">
                <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${collaboratorId}`} />
                <AvatarFallback className="text-xs">
                  {collaboratorId.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {goal.collaborators.length > 3 && (
              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                +{goal.collaborators.length - 3}
              </div>
            )}
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Goal
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Goal
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share Goal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive Goal
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />
    </div>
  );
};

// =============================================================================
// Navigation Tabs Component
// =============================================================================

interface NavigationTabsProps {
  goalId: string;
  currentPath: string;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ goalId, currentPath }) => {
  const tabs = [
    {
      value: 'overview',
      label: 'Overview',
      href: `/goals/${goalId}`,
      icon: Eye,
    },
    {
      value: 'canvas',
      label: 'Canvas',
      href: `/goals/${goalId}/canvas`,
      icon: GitBranch,
    },
    {
      value: 'board',
      label: 'Board',
      href: `/goals/${goalId}/board`,
      icon: Kanban,
    },
    {
      value: 'metrics',
      label: 'Metrics',
      href: `/goals/${goalId}/metrics`,
      icon: BarChart3,
    },
    {
      value: 'review',
      label: 'Review',
      href: `/goals/${goalId}/review`,
      icon: CheckCircle,
    },
  ];

  const getCurrentTab = () => {
    if (currentPath === `/goals/${goalId}`) return 'overview';
    if (currentPath.includes('/canvas')) return 'canvas';
    if (currentPath.includes('/board')) return 'board';
    if (currentPath.includes('/metrics')) return 'metrics';
    if (currentPath.includes('/review')) return 'review';
    return 'overview';
  };

  return (
    <Tabs value={getCurrentTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            asChild
            className="flex items-center space-x-2"
          >
            <Link href={tab.href}>
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

// =============================================================================
// Metadata Generation
// =============================================================================

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const goal = await getGoal(id);

  if (!goal) {
    return {
      title: 'Goal Not Found',
      description: 'The requested goal could not be found.',
    };
  }

  return {
    title: `${goal.title} | Goal Details`,
    description: goal.description,
    openGraph: {
      title: goal.title,
      description: goal.description,
      type: 'website',
    },
  };
}

// =============================================================================
// Main Layout Component
// =============================================================================

export default async function GoalLayout({ children, params }: GoalLayoutProps) {
  const { id } = await params;
  const goal = await getGoal(id);

  if (!goal) {
    notFound();
  }

  // Mock current path - in real app this would come from usePathname
  const currentPath = `/goals/${id}`;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Goal Header */}
        <GoalHeader goal={goal} />

        {/* Navigation Tabs */}
        <NavigationTabs goalId={goal.id} currentPath={currentPath} />

        {/* Main Content */}
        <main className="mt-6">
          {children}
        </main>
      </div>
    </div>
  );
}