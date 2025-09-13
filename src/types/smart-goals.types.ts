/**
 * SMART Goals System Type Definitions
 *
 * This file contains comprehensive type definitions for the SMART Goals system,
 * following the SMART criteria: Specific, Measurable, Achievable, Relevant, Time-bound.
 *
 * @fileoverview Type definitions for SMART goals system
 * @version 1.0.0
 */

// =============================================================================
// Core Enums and Constants
// =============================================================================

/** Goal priority levels */
export enum GoalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/** Goal status states */
export enum GoalStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue',
}

/** Task and subtask status states */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
}

/** Metric types for measurable goals */
export enum MetricType {
  NUMBER = 'number',
  PERCENTAGE = 'percentage',
  CURRENCY = 'currency',
  DURATION = 'duration',
  BOOLEAN = 'boolean',
  RATING = 'rating',
}

/** Frequency for recurring goals and checkpoints */
export enum Frequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

/** Goal categories for organization */
export enum GoalCategory {
  PERSONAL = 'personal',
  PROFESSIONAL = 'professional',
  HEALTH = 'health',
  EDUCATION = 'education',
  FINANCIAL = 'financial',
  RELATIONSHIP = 'relationship',
  CREATIVE = 'creative',
  OTHER = 'other',
}

// =============================================================================
// Supporting Interfaces
// =============================================================================

/** Base interface for all entities with common properties */
export interface BaseEntity {
  /** Unique identifier */
  id: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** User who created this entity */
  createdBy: string;
  /** User who last updated this entity */
  updatedBy: string;
}

/** Interface for entities that can be soft deleted */
export interface SoftDeletable {
  /** Soft deletion flag */
  isDeleted: boolean;
  /** Deletion timestamp */
  deletedAt?: Date;
  /** User who deleted this entity */
  deletedBy?: string;
}

/** Interface for entities with notes and comments */
export interface Commentable {
  /** Optional notes or comments */
  notes?: string;
  /** Additional comments or observations */
  comments?: Comment[];
}

/** Comment interface for detailed feedback */
export interface Comment extends BaseEntity {
  /** Comment content */
  content: string;
  /** Optional parent comment ID for threading */
  parentId?: string;
  /** Comment author */
  author: string;
  /** Whether comment is edited */
  isEdited: boolean;
  /** Edit timestamp */
  editedAt?: Date;
}

// =============================================================================
// Measurable (M) - Metric and Measurement Interfaces
// =============================================================================

/** Specification for measurable goals */
export interface MeasurableSpec {
  /** Type of metric being measured */
  metricType: MetricType;
  /** Target value to achieve */
  targetValue: number;
  /** Current value */
  currentValue: number;
  /** Unit of measurement (e.g., 'kg', '%', '$', 'hours') */
  unit: string;
  /** Minimum acceptable value */
  minimumValue?: number;
  /** Maximum possible value */
  maximumValue?: number;
  /** Whether higher values are better */
  higherIsBetter: boolean;
  /** Formula or method for calculation */
  calculationMethod?: string;
  /** Data source for metrics */
  dataSource?: string;
  /** Frequency of measurement updates */
  measurementFrequency: Frequency;
}

/** Checkpoint for tracking progress over time */
export interface MetricCheckpoint extends BaseEntity {
  /** Reference to the goal this checkpoint belongs to */
  goalId: string;
  /** Value recorded at this checkpoint */
  value: number;
  /** Date when this value was recorded */
  recordedDate: Date;
  /** Optional note about this measurement */
  note?: string;
  /** Whether this is an automated or manual entry */
  isAutomatic: boolean;
  /** Data source for this checkpoint */
  source?: string;
  /** Confidence level in this measurement (0-1) */
  confidence?: number;
}

// =============================================================================
// Achievable (A) - Resource and Constraint Interfaces
// =============================================================================

/** Resource required for goal achievement */
export interface Resource {
  /** Resource identifier */
  id: string;
  /** Resource name */
  name: string;
  /** Type of resource (time, money, skill, tool, etc.) */
  type: string;
  /** Amount needed */
  quantity: number;
  /** Unit of measurement */
  unit: string;
  /** Whether this resource is currently available */
  isAvailable: boolean;
  /** Cost or effort required to obtain */
  acquisitionCost?: number;
  /** Time needed to acquire this resource */
  acquisitionTime?: number;
  /** Optional description */
  description?: string;
}

/** Skill or competency required */
export interface RequiredSkill {
  /** Skill identifier */
  id: string;
  /** Skill name */
  name: string;
  /** Required proficiency level (1-10) */
  requiredLevel: number;
  /** Current proficiency level (1-10) */
  currentLevel: number;
  /** Whether this skill is critical for success */
  isCritical: boolean;
  /** How to develop this skill */
  developmentPlan?: string;
  /** Estimated time to reach required level */
  timeToAcquire?: number;
}

/** Constraint or obstacle that might affect achievement */
export interface Constraint {
  /** Constraint identifier */
  id: string;
  /** Description of the constraint */
  description: string;
  /** Impact level (1-10) */
  impactLevel: number;
  /** Probability of occurrence (0-1) */
  probability: number;
  /** Type of constraint */
  type:
    | 'time'
    | 'resource'
    | 'skill'
    | 'external'
    | 'regulatory'
    | 'technical'
    | 'financial';
  /** Mitigation strategy */
  mitigationStrategy?: string;
  /** Contingency plan */
  contingencyPlan?: string;
  /** Current status */
  status: 'identified' | 'analyzing' | 'mitigating' | 'resolved' | 'accepted';
}

/** Assessment of goal achievability */
export interface Achievability {
  /** Overall achievability score (0-1) */
  score: number;
  /** Required resources */
  requiredResources: Resource[];
  /** Required skills */
  requiredSkills: RequiredSkill[];
  /** Identified constraints */
  constraints: Constraint[];
  /** Risk assessment summary */
  riskAssessment: string;
  /** Success probability estimate (0-1) */
  successProbability: number;
  /** Confidence in assessment (0-1) */
  assessmentConfidence: number;
  /** Date of last assessment */
  lastAssessedAt: Date;
  /** Who performed the assessment */
  assessedBy: string;
}

// =============================================================================
// Relevant (R) - Alignment and Value Interfaces
// =============================================================================

/** Strategic alignment information */
export interface StrategyAlignment {
  /** Organization or personal strategic goal ID */
  strategicGoalId: string;
  /** Description of how this goal aligns */
  alignmentDescription: string;
  /** Strength of alignment (0-1) */
  alignmentStrength: number;
  /** Expected contribution to strategic goal */
  expectedContribution: string;
}

/** Stakeholder affected by or interested in the goal */
export interface Stakeholder {
  /** Stakeholder identifier */
  id: string;
  /** Stakeholder name */
  name: string;
  /** Role or relationship */
  role: string;
  /** Level of influence (0-1) */
  influence: number;
  /** Level of interest (0-1) */
  interest: number;
  /** Expected impact on stakeholder */
  expectedImpact: string;
  /** Stakeholder's stance (supportive, neutral, resistant) */
  stance: 'supportive' | 'neutral' | 'resistant' | 'unknown';
  /** Contact information */
  contact?: string;
}

/** Assessment of goal relevance */
export interface Relevance {
  /** Why this goal matters */
  rationale: string;
  /** Strategic alignments */
  strategyAlignments: StrategyAlignment[];
  /** Affected stakeholders */
  stakeholders: Stakeholder[];
  /** Expected benefits */
  expectedBenefits: string[];
  /** Potential risks of not achieving */
  risksOfNotAchieving: string[];
  /** Overall relevance score (0-1) */
  relevanceScore: number;
  /** Business or personal value (0-1) */
  valueScore: number;
  /** Date of last relevance review */
  lastReviewedAt: Date;
  /** Who reviewed the relevance */
  reviewedBy: string;
}

// =============================================================================
// Time-bound (T) - Timeline and Schedule Interfaces
// =============================================================================

/** Time-based constraints and deadlines */
export interface Timebound {
  /** Goal start date */
  startDate: Date;
  /** Target completion date */
  targetDate: Date;
  /** Hard deadline (if different from target) */
  deadline?: Date;
  /** Estimated duration in days */
  estimatedDuration: number;
  /** Buffer time in days */
  bufferDays?: number;
  /** Whether this goal is recurring */
  isRecurring: boolean;
  /** Recurrence pattern if applicable */
  recurrencePattern?: Frequency;
  /** End date for recurring goals */
  recurrenceEndDate?: Date;
  /** Critical path considerations */
  criticalPath?: string[];
  /** Dependencies on other goals */
  dependencies?: string[];
  /** Time zone for scheduling */
  timeZone?: string;
}

// =============================================================================
// Task Management Interfaces
// =============================================================================

/** Individual checklist item */
export interface ChecklistItem extends BaseEntity {
  /** Item title */
  title: string;
  /** Detailed description */
  description?: string;
  /** Whether item is completed */
  isCompleted: boolean;
  /** Completion date */
  completedAt?: Date;
  /** Who completed this item */
  completedBy?: string;
  /** Display order */
  order: number;
  /** Whether this item is required */
  isRequired: boolean;
}

/** Subtask within a task */
export interface Subtask extends BaseEntity, SoftDeletable, Commentable {
  /** Subtask title */
  title: string;
  /** Detailed description */
  description?: string;
  /** Current status */
  status: TaskStatus;
  /** Priority level */
  priority: GoalPriority;
  /** Assigned to (user ID) */
  assignedTo?: string;
  /** Estimated effort in hours */
  estimatedHours?: number;
  /** Actual effort spent in hours */
  actualHours?: number;
  /** Due date */
  dueDate?: Date;
  /** Completion date */
  completedAt?: Date;
  /** Completion percentage (0-100) */
  progress: number;
  /** Tags for categorization */
  tags?: string[];
  /** Checklist items */
  checklist: ChecklistItem[];
  /** Dependencies on other subtasks */
  dependencies?: string[];
  /** Parent task ID */
  taskId: string;
}

/** Main task within a goal */
export interface Task extends BaseEntity, SoftDeletable, Commentable {
  /** Task title */
  title: string;
  /** Detailed description */
  description?: string;
  /** Current status */
  status: TaskStatus;
  /** Priority level */
  priority: GoalPriority;
  /** Assigned to (user ID) */
  assignedTo?: string;
  /** Estimated effort in hours */
  estimatedHours?: number;
  /** Actual effort spent in hours */
  actualHours?: number;
  /** Due date */
  dueDate?: Date;
  /** Start date */
  startDate?: Date;
  /** Completion date */
  completedAt?: Date;
  /** Completion percentage (0-100) */
  progress: number;
  /** Tags for categorization */
  tags?: string[];
  /** Subtasks */
  subtasks: Subtask[];
  /** Checklist items */
  checklist: ChecklistItem[];
  /** Dependencies on other tasks */
  dependencies?: string[];
  /** Parent goal ID */
  goalId: string;
  /** Order within the goal */
  order: number;
}

// =============================================================================
// Milestone and Outcome Interfaces
// =============================================================================

/** Milestone within a goal */
export interface Milestone extends BaseEntity, SoftDeletable, Commentable {
  /** Milestone title */
  title: string;
  /** Detailed description */
  description?: string;
  /** Target date */
  targetDate: Date;
  /** Actual completion date */
  completedAt?: Date;
  /** Whether this milestone is completed */
  isCompleted: boolean;
  /** Success criteria */
  successCriteria: string[];
  /** Completion percentage (0-100) */
  progress: number;
  /** Priority level */
  priority: GoalPriority;
  /** Associated tasks */
  taskIds: string[];
  /** Deliverables for this milestone */
  deliverables?: string[];
  /** Dependencies on other milestones */
  dependencies?: string[];
  /** Parent goal ID */
  goalId: string;
  /** Order within the goal */
  order: number;
  /** Whether this is a critical milestone */
  isCritical: boolean;
}

/** Expected outcome of a goal */
export interface Outcome extends BaseEntity {
  /** Outcome description */
  description: string;
  /** Type of outcome */
  type: 'primary' | 'secondary' | 'side_effect' | 'risk';
  /** Expected impact level (1-10) */
  impactLevel: number;
  /** Probability of occurrence (0-1) */
  probability: number;
  /** Measurement criteria */
  measurementCriteria?: string;
  /** Target value or result */
  targetValue?: string;
  /** Actual result achieved */
  actualResult?: string;
  /** Whether this outcome was achieved */
  isAchieved?: boolean;
  /** Date outcome was evaluated */
  evaluatedAt?: Date;
  /** Who evaluated this outcome */
  evaluatedBy?: string;
  /** Parent goal ID */
  goalId: string;
}

// =============================================================================
// Main SMART Goal Interface
// =============================================================================

/**
 * Main SMART Goal interface combining all SMART criteria
 * S - Specific: Clear title, description, and success criteria
 * M - Measurable: Quantifiable metrics and progress tracking
 * A - Achievable: Resource assessment and feasibility analysis
 * R - Relevant: Strategic alignment and stakeholder value
 * T - Time-bound: Clear deadlines and timeline
 */
export interface SmartGoal extends BaseEntity, SoftDeletable, Commentable {
  // =============================================================================
  // Specific (S) - Clear Definition
  // =============================================================================

  /** Goal title - clear and concise */
  title: string;

  /** Detailed goal description */
  description: string;

  /** What exactly will be accomplished */
  specificObjective: string;

  /** Clear success criteria */
  successCriteria: string[];

  /** Goal category */
  category: GoalCategory;

  /** Tags for organization and search */
  tags: string[];

  // =============================================================================
  // Measurable (M) - Quantifiable Progress
  // =============================================================================

  /** Measurable specifications */
  measurable: MeasurableSpec;

  /** Progress checkpoints */
  checkpoints: MetricCheckpoint[];

  /** Current progress percentage (0-100) */
  progress: number;

  // =============================================================================
  // Achievable (A) - Realistic and Feasible
  // =============================================================================

  /** Achievability assessment */
  achievability: Achievability;

  // =============================================================================
  // Relevant (R) - Aligned with Bigger Picture
  // =============================================================================

  /** Relevance assessment */
  relevance: Relevance;

  // =============================================================================
  // Time-bound (T) - Clear Timeline
  // =============================================================================

  /** Time-based specifications */
  timebound: Timebound;

  // =============================================================================
  // Goal Management
  // =============================================================================

  /** Current goal status */
  status: GoalStatus;

  /** Priority level */
  priority: GoalPriority;

  /** Goal owner/assignee */
  ownerId: string;

  /** Team members or collaborators */
  collaborators: string[];

  /** Parent goal ID (for sub-goals) */
  parentGoalId?: string;

  /** Child goal IDs */
  childGoalIds: string[];

  // =============================================================================
  // Execution and Tracking
  // =============================================================================

  /** Associated tasks */
  tasks: Task[];

  /** Key milestones */
  milestones: Milestone[];

  /** Expected outcomes */
  outcomes: Outcome[];

  /** Actual start date */
  actualStartDate?: Date;

  /** Actual completion date */
  actualCompletionDate?: Date;

  /** Last progress update */
  lastProgressUpdate?: Date;

  /** Next review date */
  nextReviewDate?: Date;

  // =============================================================================
  // Metadata and Analytics
  // =============================================================================

  /** Source or inspiration for this goal */
  source?: string;

  /** Template ID if created from template */
  templateId?: string;

  /** Lessons learned */
  lessonsLearned?: string[];

  /** Success factors identified */
  successFactors?: string[];

  /** Challenges encountered */
  challenges?: string[];

  /** Visibility level */
  visibility: 'private' | 'team' | 'organization' | 'public';

  /** Whether goal is archived */
  isArchived: boolean;

  /** Archive date */
  archivedAt?: Date;

  /** Archive reason */
  archiveReason?: string;
}

// =============================================================================
// Type Utilities and Helpers
// =============================================================================

/** Type guard for checking if an object is a SmartGoal */
export function isSmartGoal(obj: unknown): obj is SmartGoal {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const goal = obj as Record<string, unknown>;

  return (
    typeof goal.id === 'string' &&
    typeof goal.title === 'string' &&
    typeof goal.description === 'string' &&
    typeof goal.specificObjective === 'string' &&
    Array.isArray(goal.successCriteria) &&
    Object.values(GoalCategory).includes(goal.category as GoalCategory) &&
    Object.values(GoalStatus).includes(goal.status as GoalStatus) &&
    Object.values(GoalPriority).includes(goal.priority as GoalPriority) &&
    typeof goal.measurable === 'object' &&
    typeof goal.achievability === 'object' &&
    typeof goal.relevance === 'object' &&
    typeof goal.timebound === 'object'
  );
}

/** Type guard for checking if an object is a Task */
export function isTask(obj: unknown): obj is Task {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const task = obj as Record<string, unknown>;

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    Object.values(TaskStatus).includes(task.status as TaskStatus) &&
    typeof task.goalId === 'string'
  );
}

/** Type guard for checking if an object is a Milestone */
export function isMilestone(obj: unknown): obj is Milestone {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const milestone = obj as Record<string, unknown>;

  return (
    typeof milestone.id === 'string' &&
    typeof milestone.title === 'string' &&
    milestone.targetDate instanceof Date &&
    typeof milestone.goalId === 'string'
  );
}

/** Utility type for creating partial goal updates */
export type SmartGoalUpdate = Partial<
  Omit<SmartGoal, 'id' | 'createdAt' | 'createdBy'>
> & {
  updatedAt: Date;
  updatedBy: string;
};

/** Utility type for goal summary information */
export type SmartGoalSummary = Pick<
  SmartGoal,
  | 'id'
  | 'title'
  | 'description'
  | 'status'
  | 'priority'
  | 'progress'
  | 'category'
  | 'ownerId'
  | 'timebound'
  | 'createdAt'
  | 'updatedAt'
>;

/** Utility type for goal creation (excludes auto-generated fields) */
export type SmartGoalCreate = Omit<
  SmartGoal,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'checkpoints'
  | 'tasks'
  | 'milestones'
  | 'outcomes'
  | 'childGoalIds'
  | 'actualStartDate'
  | 'actualCompletionDate'
  | 'lastProgressUpdate'
  | 'nextReviewDate'
>;

/** Utility type for filtering goals */
export interface GoalFilters {
  status?: GoalStatus[];
  priority?: GoalPriority[];
  category?: GoalCategory[];
  ownerId?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

/** Utility type for sorting goals */
export interface GoalSort {
  field: keyof SmartGoal;
  direction: 'asc' | 'desc';
}

// =============================================================================
// All interfaces and types are already exported above
// =============================================================================
