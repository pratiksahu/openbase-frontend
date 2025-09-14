/**
 * Goal Board View Page
 *
 * Kanban board view for goal tasks with drag-and-drop functionality,
 * filtering, swimlanes, and task management capabilities.
 */

'use client';

import {
  Plus,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import React, { useState, useCallback } from 'react';

import { TaskEditor } from '@/components/TaskEditor/TaskEditor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { mockGoals } from '@/lib/mock-data/smart-goals';
import type { SmartGoal, Task, TaskStatus, GoalPriority } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

interface BoardPageProps {
  params: {
    id: string;
  };
}

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BoardFilters {
  assignee?: string;
  milestone?: string;
  priority?: GoalPriority;
  dueDate?: 'overdue' | 'today' | 'this_week' | 'next_week';
}

type SwimlaneMode = 'none' | 'assignee' | 'milestone' | 'priority';

// =============================================================================
// Constants
// =============================================================================

const COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-gray-100 dark:bg-gray-800',
    icon: Circle,
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    color: 'bg-blue-100 dark:bg-blue-800',
    icon: Clock,
  },
  {
    id: 'completed',
    title: 'Completed',
    color: 'bg-green-100 dark:bg-green-800',
    icon: CheckCircle,
  },
  {
    id: 'blocked',
    title: 'Blocked',
    color: 'bg-red-100 dark:bg-red-800',
    icon: AlertTriangle,
  },
  {
    id: 'cancelled',
    title: 'Cancelled',
    color: 'bg-gray-200 dark:bg-gray-700',
    icon: Circle,
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

async function getGoal(id: string): Promise<SmartGoal | null> {
  // TODO: Replace with actual API call
  return mockGoals.find(goal => goal.id === id) || null;
}

const getPriorityColor = (priority: GoalPriority): string => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300';
  }
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const isOverdue = (date?: Date): boolean => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const getDaysUntilDue = (date?: Date): number => {
  if (!date) return Infinity;
  const today = new Date();
  const due = new Date(date);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// =============================================================================
// Components
// =============================================================================

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onView?: (task: Task) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onView,
  onStatusChange: _onStatusChange
}) => {
  const daysUntil = getDaysUntilDue(task.dueDate);
  const overdue = isOverdue(task.dueDate);

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {task.description}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(task)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(task)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Priority & Tags */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.tags && task.tags.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                +{task.tags.length} tags
              </Badge>
            )}
          </div>

          {/* Progress */}
          {task.progress > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-1.5" />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${
                  overdue ? 'text-red-600' :
                  daysUntil <= 1 ? 'text-orange-600' :
                  'text-muted-foreground'
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>
                    {overdue ? 'Overdue' : formatDate(task.dueDate)}
                  </span>
                </div>
              )}

              {task.estimatedHours && (
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
            </div>

            {task.assignedTo && (
              <Avatar className="h-5 w-5">
                <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${task.assignedTo}`} />
                <AvatarFallback className="text-xs">
                  {task.assignedTo.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (task: Task) => void;
  onTaskView?: (task: Task) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask?: (status: TaskStatus) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onTaskEdit,
  onTaskDelete,
  onTaskView,
  onStatusChange,
  onAddTask
}) => {
  const Icon = column.icon;

  return (
    <div className="flex-1 min-w-[300px]">
      <div className={`rounded-lg ${column.color} p-4 h-full`}>
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddTask?.(column.id)}
            className="opacity-60 hover:opacity-100"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Tasks */}
        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              onView={onTaskView}
              onStatusChange={onStatusChange}
            />
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddTask?.(column.id)}
                className="mt-2"
              >
                Add Task
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface BoardToolbarProps {
  filters: BoardFilters;
  onFiltersChange: (filters: BoardFilters) => void;
  swimlaneMode: SwimlaneMode;
  onSwimlaneModeChange: (mode: SwimlaneMode) => void;
  goal: SmartGoal;
}

const BoardToolbar: React.FC<BoardToolbarProps> = ({
  filters,
  onFiltersChange,
  swimlaneMode,
  onSwimlaneModeChange,
  goal
}) => {
  const uniqueAssignees = Array.from(new Set(
    goal.tasks.map(task => task.assignedTo).filter(Boolean)
  ));

  return (
    <div className="flex items-center justify-between bg-background border rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Task Board</h2>
        <Separator orientation="vertical" className="h-6" />

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />

          <Select
            value={filters.assignee || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                assignee: value === 'all' ? undefined : value
              })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {uniqueAssignees.map(assignee => (
                <SelectItem key={assignee} value={assignee!}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priority || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                priority: value === 'all' ? undefined : value as GoalPriority
              })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.dueDate || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                dueDate: value === 'all' ? undefined : value as any
              })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Due Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Due Dates</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Due Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="next_week">Next Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Swimlanes */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Group by:</span>
          <Select value={swimlaneMode} onValueChange={(value) => onSwimlaneModeChange(value as SwimlaneMode)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="assignee">Assignee</SelectItem>
              <SelectItem value="milestone">Milestone</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
};

// =============================================================================
// Main Board Page Component
// =============================================================================

export default function GoalBoardPage({ params }: BoardPageProps) {
  const [goal, setGoal] = React.useState<SmartGoal | null>(null);
  const [filters, setFilters] = useState<BoardFilters>({});
  const [swimlaneMode, setSwimlaneMode] = useState<SwimlaneMode>('none');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load goal data
  React.useEffect(() => {
    const loadGoal = async () => {
      const goalData = await getGoal(params.id);
      if (goalData) {
        setGoal(goalData);
      }
    };

    loadGoal();
  }, [params.id]);

  // Filter tasks based on current filters
  const filterTasks = useCallback((tasks: Task[]): Task[] => {
    return tasks.filter(task => {
      if (filters.assignee && task.assignedTo !== filters.assignee) return false;
      if (filters.priority && task.priority !== filters.priority) return false;

      if (filters.dueDate && task.dueDate) {
        const daysUntil = getDaysUntilDue(task.dueDate);
        switch (filters.dueDate) {
          case 'overdue':
            if (daysUntil >= 0) return false;
            break;
          case 'today':
            if (daysUntil !== 0) return false;
            break;
          case 'this_week':
            if (daysUntil > 7 || daysUntil < 0) return false;
            break;
          case 'next_week':
            if (daysUntil > 14 || daysUntil <= 7) return false;
            break;
        }
      }

      return true;
    });
  }, [filters]);

  const handleTaskEdit = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleTaskDelete = useCallback((task: Task) => {
    // TODO: Implement task deletion
    console.log('Delete task:', task.id);
  }, []);

  const handleTaskView = useCallback((task: Task) => {
    // TODO: Open task detail modal
    console.log('View task:', task.id);
  }, []);

  const handleStatusChange = useCallback((taskId: string, newStatus: TaskStatus) => {
    // TODO: Update task status
    console.log('Change task status:', taskId, newStatus);
  }, []);

  const handleAddTask = useCallback((status: TaskStatus) => {
    // TODO: Add new task with status
    console.log('Add task with status:', status);
  }, []);

  if (!goal) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Loading board...</div>
          <div className="text-sm text-muted-foreground">
            Setting up your task board
          </div>
        </div>
      </div>
    );
  }

  const filteredTasks = filterTasks(goal.tasks);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <BoardToolbar
        filters={filters}
        onFiltersChange={setFilters}
        swimlaneMode={swimlaneMode}
        onSwimlaneModeChange={setSwimlaneMode}
        goal={goal}
      />

      {/* Kanban Board */}
      <div className="flex space-x-4 overflow-x-auto min-h-[600px]">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={filteredTasks.filter(task => task.status === column.id)}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onTaskView={handleTaskView}
            onStatusChange={handleStatusChange}
            onAddTask={handleAddTask}
          />
        ))}
      </div>

      {/* Task Editor Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TaskEditor
              goalId={goal.id}
              task={editingTask}
              onSave={(updatedTask) => {
                // TODO: Update task
                console.log('Save task:', updatedTask);
                setEditingTask(null);
              }}
              onCancel={() => setEditingTask(null)}
              mode="edit"
            />
          </div>
        </div>
      )}
    </div>
  );
}