/**
 * Mock Data Factory for SMART Goals System
 *
 * This file provides mock data factories and sample datasets for testing
 * and development of the SMART Goals system.
 *
 * @fileoverview Mock data generators for SMART Goals
 * @version 1.0.0
 */

import {
  SmartGoal,
  Task,
  Subtask,
  Milestone,
  Outcome,
  ChecklistItem,
  MetricCheckpoint,
  Resource,
  RequiredSkill,
  Constraint,
  Stakeholder,
  StrategyAlignment,
  Comment,
  GoalStatus,
  GoalPriority,
  GoalCategory,
  TaskStatus,
  MetricType,
  Frequency,
  MeasurableSpec,
  Achievability,
  Relevance,
  Timebound,
} from '@/types/smart-goals.types';

// =============================================================================
// Utility Functions
// =============================================================================

/** Generate a random ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Generate a random date within a range */
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

/** Generate a random number within a range */
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generate a random float within a range */
function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Pick random element from array */
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/** Pick multiple random elements from array */
function randomElements<T>(array: T[], count: number = 1): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

// =============================================================================
// Mock Data Constants
// =============================================================================

const SAMPLE_USERS = [
  'user-1',
  'user-2',
  'user-3',
  'user-4',
  'user-5',
  'john-doe',
  'jane-smith',
  'mike-johnson',
  'sarah-wilson',
  'alex-chen',
];

const SAMPLE_TAGS = [
  'health',
  'fitness',
  'career',
  'learning',
  'skills',
  'productivity',
  'finance',
  'relationships',
  'creativity',
  'leadership',
  'innovation',
  'sustainability',
  'growth',
  'performance',
  'efficiency',
];

const SAMPLE_GOAL_TITLES = [
  'Lose 20 pounds in 6 months',
  'Complete AWS certification',
  'Increase team productivity by 25%',
  'Launch new product feature',
  'Build emergency fund of $10,000',
  'Read 24 books this year',
  'Improve customer satisfaction score to 9.0',
  'Reduce operational costs by 15%',
  'Complete marathon training',
  'Learn Spanish to conversational level',
];

const SAMPLE_SUCCESS_CRITERIA = [
  'All metrics show consistent improvement',
  'Stakeholder approval achieved',
  'Budget requirements met',
  'Timeline objectives completed',
  'Quality standards exceeded',
  'User acceptance criteria satisfied',
  'Performance benchmarks reached',
  'Compliance requirements fulfilled',
];

const SAMPLE_BENEFITS = [
  'Improved health and energy levels',
  'Enhanced career opportunities',
  'Better work-life balance',
  'Increased team efficiency',
  'Higher customer satisfaction',
  'Reduced operational expenses',
  'Enhanced skill set',
  'Greater market competitiveness',
];

const SAMPLE_RISKS = [
  'Market conditions may change',
  'Resource availability uncertain',
  'Technical challenges may arise',
  'Stakeholder priorities could shift',
  'External dependencies',
  'Budget constraints',
  'Timeline pressures',
  'Skill gaps in team',
];

// =============================================================================
// Factory Functions for Supporting Types
// =============================================================================

/** Create a mock comment */
export function createMockComment(overrides: Partial<Comment> = {}): Comment {
  const now = new Date();
  return {
    id: generateId(),
    createdAt: randomDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      now
    ),
    updatedAt: now,
    createdBy: randomElement(SAMPLE_USERS),
    updatedBy: randomElement(SAMPLE_USERS),
    content: 'This is a sample comment with some feedback or observation.',
    author: randomElement(SAMPLE_USERS),
    isEdited: Math.random() > 0.7,
    editedAt: Math.random() > 0.7 ? now : undefined,
    ...overrides,
  };
}

/** Create a mock checklist item */
export function createMockChecklistItem(
  overrides: Partial<ChecklistItem> = {}
): ChecklistItem {
  const now = new Date();
  const isCompleted = Math.random() > 0.6;

  return {
    id: generateId(),
    createdAt: randomDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      now
    ),
    updatedAt: now,
    createdBy: randomElement(SAMPLE_USERS),
    updatedBy: randomElement(SAMPLE_USERS),
    title: `Checklist item ${randomNumber(1, 100)}`,
    description:
      Math.random() > 0.5
        ? 'Detailed description of the checklist item'
        : undefined,
    isCompleted,
    completedAt: isCompleted
      ? randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now)
      : undefined,
    completedBy: isCompleted ? randomElement(SAMPLE_USERS) : undefined,
    order: randomNumber(1, 10),
    isRequired: Math.random() > 0.3,
    ...overrides,
  };
}

/** Create a mock metric checkpoint */
export function createMockMetricCheckpoint(
  goalId: string,
  overrides: Partial<MetricCheckpoint> = {}
): MetricCheckpoint {
  const now = new Date();

  return {
    id: generateId(),
    createdAt: randomDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      now
    ),
    updatedAt: now,
    createdBy: randomElement(SAMPLE_USERS),
    updatedBy: randomElement(SAMPLE_USERS),
    goalId,
    value: randomFloat(0, 100),
    recordedDate: randomDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      now
    ),
    note: Math.random() > 0.5 ? 'Progress note for this checkpoint' : undefined,
    isAutomatic: Math.random() > 0.5,
    source: Math.random() > 0.5 ? 'automated-tracker' : 'manual-entry',
    confidence: randomFloat(0.7, 1.0),
    ...overrides,
  };
}

/** Create a mock resource */
export function createMockResource(
  overrides: Partial<Resource> = {}
): Resource {
  const resourceTypes = [
    'time',
    'money',
    'skill',
    'tool',
    'equipment',
    'software',
    'training',
  ];
  const resourceType = randomElement(resourceTypes);

  return {
    id: generateId(),
    name: `${resourceType} resource`,
    type: resourceType,
    quantity: randomNumber(1, 100),
    unit:
      resourceType === 'time'
        ? 'hours'
        : resourceType === 'money'
          ? 'USD'
          : 'units',
    isAvailable: Math.random() > 0.3,
    acquisitionCost: Math.random() > 0.5 ? randomNumber(100, 5000) : undefined,
    acquisitionTime: Math.random() > 0.5 ? randomNumber(1, 30) : undefined,
    description: `Description for ${resourceType} resource`,
    ...overrides,
  };
}

/** Create a mock required skill */
export function createMockRequiredSkill(
  overrides: Partial<RequiredSkill> = {}
): RequiredSkill {
  const skills = [
    'JavaScript',
    'Project Management',
    'Data Analysis',
    'Communication',
    'Leadership',
    'Design',
  ];

  return {
    id: generateId(),
    name: randomElement(skills),
    requiredLevel: randomNumber(6, 10),
    currentLevel: randomNumber(3, 7),
    isCritical: Math.random() > 0.5,
    developmentPlan: 'Take online courses and practice projects',
    timeToAcquire: randomNumber(30, 180),
    ...overrides,
  };
}

/** Create a mock constraint */
export function createMockConstraint(
  overrides: Partial<Constraint> = {}
): Constraint {
  const constraintTypes: (
    | 'time'
    | 'resource'
    | 'skill'
    | 'external'
    | 'regulatory'
    | 'technical'
    | 'financial'
  )[] = [
    'time',
    'resource',
    'skill',
    'external',
    'regulatory',
    'technical',
    'financial',
  ];

  return {
    id: generateId(),
    description:
      'This is a potential constraint that might affect goal achievement',
    impactLevel: randomNumber(3, 8),
    probability: randomFloat(0.1, 0.8),
    type: randomElement(constraintTypes),
    mitigationStrategy: 'Strategy to mitigate this constraint',
    contingencyPlan: 'Backup plan if constraint occurs',
    status: randomElement([
      'identified',
      'analyzing',
      'mitigating',
      'resolved',
      'accepted',
    ] as const),
    ...overrides,
  };
}

/** Create a mock stakeholder */
export function createMockStakeholder(
  overrides: Partial<Stakeholder> = {}
): Stakeholder {
  const roles = [
    'Manager',
    'Team Lead',
    'Developer',
    'Designer',
    'Customer',
    'Executive',
  ];

  return {
    id: generateId(),
    name: `${randomElement(['John', 'Jane', 'Mike', 'Sarah', 'Alex'])} ${randomElement(['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'])}`,
    role: randomElement(roles),
    influence: randomFloat(0.3, 1.0),
    interest: randomFloat(0.4, 1.0),
    expectedImpact: 'Expected positive impact on stakeholder',
    stance: randomElement([
      'supportive',
      'neutral',
      'resistant',
      'unknown',
    ] as const),
    contact: Math.random() > 0.5 ? 'email@example.com' : undefined,
    ...overrides,
  };
}

/** Create a mock strategy alignment */
export function createMockStrategyAlignment(
  overrides: Partial<StrategyAlignment> = {}
): StrategyAlignment {
  return {
    strategicGoalId: generateId(),
    alignmentDescription: 'This goal directly supports our strategic objective',
    alignmentStrength: randomFloat(0.6, 1.0),
    expectedContribution: 'Will contribute significantly to strategic success',
    ...overrides,
  };
}

// =============================================================================
// Factory Functions for Main Types
// =============================================================================

/** Create a mock measurable specification */
export function createMockMeasurableSpec(
  overrides: Partial<MeasurableSpec> = {}
): MeasurableSpec {
  const metricTypes = Object.values(MetricType);
  const metricType = randomElement(metricTypes);

  const getUnitForType = (type: MetricType): string => {
    switch (type) {
      case MetricType.PERCENTAGE:
        return '%';
      case MetricType.CURRENCY:
        return 'USD';
      case MetricType.DURATION:
        return 'hours';
      case MetricType.RATING:
        return 'points';
      default:
        return 'units';
    }
  };

  return {
    metricType,
    targetValue: randomFloat(50, 200),
    currentValue: randomFloat(0, 100),
    unit: getUnitForType(metricType),
    minimumValue: Math.random() > 0.5 ? randomFloat(0, 50) : undefined,
    maximumValue: Math.random() > 0.5 ? randomFloat(200, 500) : undefined,
    higherIsBetter: Math.random() > 0.3,
    calculationMethod: 'Standard calculation method for this metric',
    dataSource: 'Primary data collection system',
    measurementFrequency: randomElement(Object.values(Frequency)),
    ...overrides,
  };
}

/** Create a mock achievability assessment */
export function createMockAchievability(
  overrides: Partial<Achievability> = {}
): Achievability {
  const now = new Date();

  return {
    score: randomFloat(0.6, 0.95),
    requiredResources: Array.from({ length: randomNumber(2, 5) }, () =>
      createMockResource()
    ),
    requiredSkills: Array.from({ length: randomNumber(1, 4) }, () =>
      createMockRequiredSkill()
    ),
    constraints: Array.from({ length: randomNumber(1, 3) }, () =>
      createMockConstraint()
    ),
    riskAssessment:
      'Overall risk is manageable with proper planning and resource allocation',
    successProbability: randomFloat(0.7, 0.9),
    assessmentConfidence: randomFloat(0.8, 1.0),
    lastAssessedAt: randomDate(
      new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      now
    ),
    assessedBy: randomElement(SAMPLE_USERS),
    ...overrides,
  };
}

/** Create a mock relevance assessment */
export function createMockRelevance(
  overrides: Partial<Relevance> = {}
): Relevance {
  const now = new Date();

  return {
    rationale:
      'This goal is highly relevant to our current objectives and strategic direction',
    strategyAlignments: Array.from({ length: randomNumber(1, 3) }, () =>
      createMockStrategyAlignment()
    ),
    stakeholders: Array.from({ length: randomNumber(2, 5) }, () =>
      createMockStakeholder()
    ),
    expectedBenefits: randomElements(SAMPLE_BENEFITS, randomNumber(2, 4)),
    risksOfNotAchieving: randomElements(SAMPLE_RISKS, randomNumber(1, 3)),
    relevanceScore: randomFloat(0.7, 1.0),
    valueScore: randomFloat(0.6, 0.95),
    lastReviewedAt: randomDate(
      new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      now
    ),
    reviewedBy: randomElement(SAMPLE_USERS),
    ...overrides,
  };
}

/** Create a mock timebound specification */
export function createMockTimebound(
  overrides: Partial<Timebound> = {}
): Timebound {
  const now = new Date();
  const startDate = randomDate(
    now,
    new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  );
  const duration = randomNumber(30, 180);
  const targetDate = new Date(
    startDate.getTime() + duration * 24 * 60 * 60 * 1000
  );

  return {
    startDate,
    targetDate,
    deadline:
      Math.random() > 0.7
        ? new Date(targetDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        : undefined,
    estimatedDuration: duration,
    bufferDays: Math.random() > 0.5 ? randomNumber(5, 15) : undefined,
    isRecurring: Math.random() > 0.8,
    recurrencePattern:
      Math.random() > 0.8 ? randomElement(Object.values(Frequency)) : undefined,
    recurrenceEndDate:
      Math.random() > 0.8
        ? new Date(targetDate.getTime() + 365 * 24 * 60 * 60 * 1000)
        : undefined,
    criticalPath:
      Math.random() > 0.5 ? ['task-1', 'task-2', 'milestone-1'] : undefined,
    dependencies:
      Math.random() > 0.5 ? [generateId(), generateId()] : undefined,
    timeZone: 'UTC',
    ...overrides,
  };
}

/** Create a mock subtask */
export function createMockSubtask(
  taskId: string,
  overrides: Partial<Subtask> = {}
): Subtask {
  const now = new Date();
  const status = randomElement(Object.values(TaskStatus));
  const isCompleted = status === TaskStatus.COMPLETED;

  return {
    id: generateId(),
    createdAt: randomDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      now
    ),
    updatedAt: now,
    createdBy: randomElement(SAMPLE_USERS),
    updatedBy: randomElement(SAMPLE_USERS),
    isDeleted: false,
    title: `Subtask ${randomNumber(1, 100)}`,
    description: 'Detailed description of the subtask',
    status,
    priority: randomElement(Object.values(GoalPriority)),
    assignedTo: randomElement(SAMPLE_USERS),
    estimatedHours: randomNumber(2, 16),
    actualHours: Math.random() > 0.3 ? randomNumber(1, 20) : undefined,
    dueDate: randomDate(
      now,
      new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    ),
    completedAt: isCompleted
      ? randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now)
      : undefined,
    progress: isCompleted ? 100 : randomNumber(0, 80),
    tags: randomElements(SAMPLE_TAGS, randomNumber(1, 3)),
    checklist: Array.from({ length: randomNumber(1, 4) }, () =>
      createMockChecklistItem()
    ),
    dependencies: Math.random() > 0.7 ? [generateId()] : undefined,
    taskId,
    notes: 'Additional notes for this subtask',
    comments: Math.random() > 0.5 ? [createMockComment()] : [],
    ...overrides,
  };
}

/** Create a mock task */
export function createMockTask(
  goalId: string,
  overrides: Partial<Task> = {}
): Task {
  const now = new Date();
  const status = randomElement(Object.values(TaskStatus));
  const isCompleted = status === TaskStatus.COMPLETED;
  const taskId = generateId();

  return {
    id: taskId,
    createdAt: randomDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      now
    ),
    updatedAt: now,
    createdBy: randomElement(SAMPLE_USERS),
    updatedBy: randomElement(SAMPLE_USERS),
    isDeleted: false,
    title: `Task ${randomNumber(1, 50)}`,
    description:
      'Detailed description of what needs to be accomplished in this task',
    status,
    priority: randomElement(Object.values(GoalPriority)),
    assignedTo: randomElement(SAMPLE_USERS),
    estimatedHours: randomNumber(8, 40),
    actualHours: Math.random() > 0.3 ? randomNumber(5, 50) : undefined,
    dueDate: randomDate(
      now,
      new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000)
    ),
    startDate:
      Math.random() > 0.5
        ? randomDate(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), now)
        : undefined,
    completedAt: isCompleted
      ? randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now)
      : undefined,
    progress: isCompleted ? 100 : randomNumber(0, 85),
    tags: randomElements(SAMPLE_TAGS, randomNumber(1, 4)),
    subtasks: Array.from({ length: randomNumber(2, 6) }, () =>
      createMockSubtask(taskId)
    ),
    checklist: Array.from({ length: randomNumber(2, 5) }, () =>
      createMockChecklistItem()
    ),
    dependencies: Math.random() > 0.6 ? [generateId()] : undefined,
    goalId,
    order: randomNumber(1, 10),
    notes: 'Task notes and additional information',
    comments:
      Math.random() > 0.4
        ? Array.from({ length: randomNumber(1, 3) }, () => createMockComment())
        : [],
    ...overrides,
  };
}

/** Create a mock milestone */
export function createMockMilestone(
  goalId: string,
  overrides: Partial<Milestone> = {}
): Milestone {
  const now = new Date();
  const isCompleted = Math.random() > 0.5;

  return {
    id: generateId(),
    createdAt: randomDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      now
    ),
    updatedAt: now,
    createdBy: randomElement(SAMPLE_USERS),
    updatedBy: randomElement(SAMPLE_USERS),
    isDeleted: false,
    title: `Milestone ${randomNumber(1, 20)}`,
    description:
      'Important milestone marking significant progress toward the goal',
    targetDate: randomDate(
      now,
      new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
    ),
    completedAt: isCompleted
      ? randomDate(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), now)
      : undefined,
    isCompleted,
    successCriteria: randomElements(
      SAMPLE_SUCCESS_CRITERIA,
      randomNumber(2, 4)
    ),
    progress: isCompleted ? 100 : randomNumber(30, 95),
    priority: randomElement(Object.values(GoalPriority)),
    taskIds: Array.from({ length: randomNumber(1, 3) }, () => generateId()),
    deliverables:
      Math.random() > 0.5
        ? [`Deliverable ${randomNumber(1, 5)}`, `Output ${randomNumber(1, 5)}`]
        : undefined,
    dependencies: Math.random() > 0.6 ? [generateId()] : undefined,
    goalId,
    order: randomNumber(1, 5),
    isCritical: Math.random() > 0.6,
    notes: 'Milestone notes and observations',
    comments:
      Math.random() > 0.3
        ? Array.from({ length: randomNumber(1, 2) }, () => createMockComment())
        : [],
    ...overrides,
  };
}

/** Create a mock outcome */
export function createMockOutcome(
  goalId: string,
  overrides: Partial<Outcome> = {}
): Outcome {
  const now = new Date();
  const types: ('primary' | 'secondary' | 'side_effect' | 'risk')[] = [
    'primary',
    'secondary',
    'side_effect',
    'risk',
  ];

  return {
    id: generateId(),
    createdAt: randomDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      now
    ),
    updatedAt: now,
    createdBy: randomElement(SAMPLE_USERS),
    updatedBy: randomElement(SAMPLE_USERS),
    description: 'Expected outcome from achieving this goal',
    type: randomElement(types),
    impactLevel: randomNumber(5, 10),
    probability: randomFloat(0.6, 0.95),
    measurementCriteria: 'Specific criteria for measuring this outcome',
    targetValue: `Target: ${randomNumber(80, 120)}%`,
    actualResult:
      Math.random() > 0.5 ? `Achieved: ${randomNumber(70, 130)}%` : undefined,
    isAchieved: Math.random() > 0.5,
    evaluatedAt:
      Math.random() > 0.5
        ? randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now)
        : undefined,
    evaluatedBy: Math.random() > 0.5 ? randomElement(SAMPLE_USERS) : undefined,
    goalId,
    ...overrides,
  };
}

/** Create a mock SMART goal */
export function createMockSmartGoal(
  overrides: Partial<SmartGoal> = {}
): SmartGoal {
  const now = new Date();
  const goalId = generateId();
  const status = randomElement(Object.values(GoalStatus));
  const isCompleted = status === GoalStatus.COMPLETED;

  return {
    id: goalId,
    createdAt: randomDate(
      new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      now
    ),
    updatedAt: now,
    createdBy: randomElement(SAMPLE_USERS),
    updatedBy: randomElement(SAMPLE_USERS),
    isDeleted: false,

    // Specific (S)
    title: randomElement(SAMPLE_GOAL_TITLES),
    description:
      'This is a comprehensive goal description that outlines what we aim to achieve and why it matters.',
    specificObjective:
      'Clear, specific objective that leaves no ambiguity about what success looks like',
    successCriteria: randomElements(
      SAMPLE_SUCCESS_CRITERIA,
      randomNumber(3, 5)
    ),
    category: randomElement(Object.values(GoalCategory)),
    tags: randomElements(SAMPLE_TAGS, randomNumber(2, 5)),

    // Measurable (M)
    measurable: createMockMeasurableSpec(),
    checkpoints: Array.from({ length: randomNumber(3, 8) }, () =>
      createMockMetricCheckpoint(goalId)
    ),
    progress: isCompleted ? 100 : randomNumber(15, 85),

    // Achievable (A)
    achievability: createMockAchievability(),

    // Relevant (R)
    relevance: createMockRelevance(),

    // Time-bound (T)
    timebound: createMockTimebound(),

    // Goal Management
    status,
    priority: randomElement(Object.values(GoalPriority)),
    ownerId: randomElement(SAMPLE_USERS),
    collaborators: randomElements(SAMPLE_USERS, randomNumber(1, 3)),
    parentGoalId: Math.random() > 0.8 ? generateId() : undefined,
    childGoalIds:
      Math.random() > 0.7
        ? Array.from({ length: randomNumber(1, 2) }, () => generateId())
        : [],

    // Execution and Tracking
    tasks: Array.from({ length: randomNumber(3, 7) }, () =>
      createMockTask(goalId)
    ),
    milestones: Array.from({ length: randomNumber(2, 5) }, () =>
      createMockMilestone(goalId)
    ),
    outcomes: Array.from({ length: randomNumber(2, 4) }, () =>
      createMockOutcome(goalId)
    ),
    actualStartDate:
      Math.random() > 0.3
        ? randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now)
        : undefined,
    actualCompletionDate: isCompleted
      ? randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now)
      : undefined,
    lastProgressUpdate: randomDate(
      new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      now
    ),
    nextReviewDate: randomDate(
      now,
      new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    ),

    // Metadata and Analytics
    source:
      Math.random() > 0.5
        ? 'strategic-planning-session'
        : 'personal-development',
    templateId: Math.random() > 0.7 ? generateId() : undefined,
    lessonsLearned:
      Math.random() > 0.4
        ? [
            'Important lesson learned during execution',
            'Key insight discovered',
          ]
        : [],
    successFactors:
      Math.random() > 0.4
        ? [
            'Clear communication',
            'Strong team collaboration',
            'Regular progress reviews',
          ]
        : [],
    challenges:
      Math.random() > 0.4 ? ['Resource constraints', 'Timeline pressures'] : [],
    visibility: randomElement([
      'private',
      'team',
      'organization',
      'public',
    ] as const),
    isArchived: Math.random() > 0.9,
    archivedAt:
      Math.random() > 0.9
        ? randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now)
        : undefined,
    archiveReason:
      Math.random() > 0.9
        ? 'Goal completed and archived for reference'
        : undefined,

    notes: 'Additional notes and observations about this goal',
    comments:
      Math.random() > 0.3
        ? Array.from({ length: randomNumber(1, 4) }, () => createMockComment())
        : [],

    ...overrides,
  };
}

// =============================================================================
// Sample Datasets
// =============================================================================

/** Create a dataset of sample SMART goals */
export function createSampleGoalsDataset(count: number = 5): SmartGoal[] {
  return Array.from({ length: count }, (_, index) => {
    // Create some variety in the sample goals
    const goalTemplates = [
      {
        title: 'Complete Professional Certification',
        category: GoalCategory.PROFESSIONAL,
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
      },
      {
        title: 'Improve Team Productivity',
        category: GoalCategory.PROFESSIONAL,
        priority: GoalPriority.MEDIUM,
        status: GoalStatus.ACTIVE,
      },
      {
        title: 'Build Emergency Fund',
        category: GoalCategory.FINANCIAL,
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
      },
      {
        title: 'Complete Fitness Challenge',
        category: GoalCategory.HEALTH,
        priority: GoalPriority.MEDIUM,
        status: GoalStatus.ACTIVE,
      },
      {
        title: 'Launch New Product Feature',
        category: GoalCategory.PROFESSIONAL,
        priority: GoalPriority.CRITICAL,
        status: GoalStatus.ACTIVE,
      },
    ];

    const template = goalTemplates[index % goalTemplates.length];
    return createMockSmartGoal(template);
  });
}

/** Create a comprehensive test dataset */
export function createTestDataset(): {
  goals: SmartGoal[];
  completedGoals: SmartGoal[];
  draftGoals: SmartGoal[];
  overdueGoals: SmartGoal[];
} {
  const goals = createSampleGoalsDataset(5);

  const completedGoals = Array.from({ length: 2 }, () =>
    createMockSmartGoal({
      status: GoalStatus.COMPLETED,
      progress: 100,
      actualCompletionDate: randomDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
      ),
    })
  );

  const draftGoals = Array.from({ length: 2 }, () =>
    createMockSmartGoal({
      status: GoalStatus.DRAFT,
      progress: 0,
      actualStartDate: undefined,
    })
  );

  const overdueGoals = Array.from({ length: 1 }, () => {
    const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return createMockSmartGoal({
      status: GoalStatus.OVERDUE,
      timebound: createMockTimebound({
        targetDate: pastDate,
        deadline: pastDate,
      }),
    });
  });

  return {
    goals,
    completedGoals,
    draftGoals,
    overdueGoals,
  };
}

// =============================================================================
// Export All Factory Functions
// =============================================================================

export {
  generateId,
  randomDate,
  randomNumber,
  randomFloat,
  randomElement,
  randomElements,
};

// Default export for convenience
const smartGoalsMockData = {
  createMockSmartGoal,
  createMockTask,
  createMockSubtask,
  createMockMilestone,
  createMockOutcome,
  createMockChecklistItem,
  createMockMetricCheckpoint,
  createMockMeasurableSpec,
  createMockAchievability,
  createMockRelevance,
  createMockTimebound,
  createSampleGoalsDataset,
  createTestDataset,
};

export default smartGoalsMockData;
