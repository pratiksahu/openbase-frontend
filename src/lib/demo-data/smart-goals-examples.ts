/**
 * SMART Goals Demo Data and Examples
 *
 * Comprehensive demo scenarios showcasing different types of goals,
 * use cases, and complete workflow examples for testing and demonstration.
 */

import { createMockSmartGoal, createMockTask, createMockMilestone } from '@/lib/mock-data/smart-goals';
import {
  SmartGoal,
  Task,
  MetricCheckpoint,
  GoalStatus,
  GoalPriority,
  GoalCategory,
  TaskStatus,
  MetricType,
  Frequency,
} from '@/types/smart-goals.types';

// =============================================================================
// Demo Goal Templates
// =============================================================================

export const goalTemplates = [
  {
    id: 'template-fitness',
    name: 'Fitness & Health Goal',
    description: 'Track fitness improvements with measurable health metrics',
    category: GoalCategory.HEALTH,
    template: {
      title: 'Improve Physical Fitness',
      description: 'Enhance overall physical health and fitness through structured exercise and nutrition',
      specificObjective: 'Complete a comprehensive fitness program with measurable improvements',
      measurable: {
        metricType: MetricType.NUMBER,
        targetValue: 10,
        currentValue: 0,
        unit: 'kg lost',
        higherIsBetter: false,
        measurementFrequency: Frequency.WEEKLY,
      },
    },
  },
  {
    id: 'template-career',
    name: 'Career Development Goal',
    description: 'Professional growth and skill development template',
    category: GoalCategory.PROFESSIONAL,
    template: {
      title: 'Advance to Senior Developer Role',
      description: 'Develop technical and leadership skills to earn promotion',
      specificObjective: 'Meet all requirements for senior developer position',
      measurable: {
        metricType: MetricType.PERCENTAGE,
        targetValue: 100,
        currentValue: 0,
        unit: 'completion',
        higherIsBetter: true,
        measurementFrequency: Frequency.MONTHLY,
      },
    },
  },
  {
    id: 'template-financial',
    name: 'Financial Goal',
    description: 'Money management and savings objectives',
    category: GoalCategory.FINANCIAL,
    template: {
      title: 'Build Emergency Fund',
      description: 'Save money for unexpected expenses and financial security',
      specificObjective: 'Save specific amount in dedicated emergency fund account',
      measurable: {
        metricType: MetricType.CURRENCY,
        targetValue: 10000,
        currentValue: 0,
        unit: 'USD',
        higherIsBetter: true,
        measurementFrequency: Frequency.MONTHLY,
      },
    },
  },
];

// =============================================================================
// Complete Demo Goals
// =============================================================================

export const demoGoals: SmartGoal[] = [
  // Professional Development Goal
  createMockSmartGoal({
    title: 'Master React and TypeScript Development',
    description: 'Become proficient in modern React development with TypeScript, including advanced patterns, testing, and performance optimization',
    specificObjective: 'Complete comprehensive React/TypeScript course, build 3 production projects, and pass certification exam with 90%+ score',
    category: GoalCategory.PROFESSIONAL,
    priority: GoalPriority.HIGH,
    status: GoalStatus.ACTIVE,
    progress: 45,
    tags: ['react', 'typescript', 'frontend', 'certification'],
    measurable: {
      metricType: MetricType.PERCENTAGE,
      targetValue: 100,
      currentValue: 45,
      unit: 'completion',
      higherIsBetter: true,
      measurementFrequency: Frequency.WEEKLY,
    },
    timebound: {
      startDate: new Date('2024-01-15'),
      targetDate: new Date('2024-06-15'),
      estimatedDuration: 151,
      isRecurring: false,
    },
    tasks: [
      createMockTask('goal-1', {
        title: 'Complete React Fundamentals Course',
        description: 'Master React basics: components, hooks, state management',
        status: TaskStatus.COMPLETED,
        progress: 100,
        estimatedHours: 40,
        actualHours: 35,
        priority: GoalPriority.HIGH,
      }),
      createMockTask('goal-1', {
        title: 'Learn Advanced TypeScript Patterns',
        description: 'Study generics, utility types, and advanced type patterns',
        status: TaskStatus.IN_PROGRESS,
        progress: 60,
        estimatedHours: 30,
        actualHours: 18,
        priority: GoalPriority.HIGH,
      }),
      createMockTask('goal-1', {
        title: 'Build E-commerce Project',
        description: 'Create full-featured e-commerce site with React/TS',
        status: TaskStatus.TODO,
        progress: 0,
        estimatedHours: 80,
        priority: GoalPriority.MEDIUM,
      }),
    ],
    milestones: [
      createMockMilestone('goal-1', {
        title: 'Complete Foundation Courses',
        description: 'Finish all basic React and TypeScript courses',
        targetDate: new Date('2024-03-01'),
        isCompleted: true,
        completedAt: new Date('2024-02-28'),
        progress: 100,
      }),
      createMockMilestone('goal-1', {
        title: 'Build First Production Project',
        description: 'Deploy first React/TS project to production',
        targetDate: new Date('2024-04-15'),
        isCompleted: false,
        progress: 70,
      }),
    ],
  }),

  // Health and Fitness Goal
  createMockSmartGoal({
    title: 'Complete Marathon Training Program',
    description: 'Train for and successfully complete a full marathon (26.2 miles) within target time',
    specificObjective: 'Complete marathon in under 4 hours with consistent training schedule',
    category: GoalCategory.HEALTH,
    priority: GoalPriority.HIGH,
    status: GoalStatus.ACTIVE,
    progress: 32,
    tags: ['fitness', 'marathon', 'running', 'endurance'],
    measurable: {
      metricType: MetricType.DURATION,
      targetValue: 240, // 4 hours in minutes
      currentValue: 0,
      unit: 'minutes',
      higherIsBetter: false,
      measurementFrequency: Frequency.WEEKLY,
    },
    timebound: {
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-10-15'), // Marathon date
      estimatedDuration: 288,
      isRecurring: false,
    },
  }),

  // Financial Goal
  createMockSmartGoal({
    title: 'Save for House Down Payment',
    description: 'Save $50,000 for down payment on first home purchase',
    specificObjective: 'Accumulate $50,000 in dedicated savings account through systematic saving and investment',
    category: GoalCategory.FINANCIAL,
    priority: GoalPriority.CRITICAL,
    status: GoalStatus.ACTIVE,
    progress: 28,
    tags: ['savings', 'house', 'investment', 'finance'],
    measurable: {
      metricType: MetricType.CURRENCY,
      targetValue: 50000,
      currentValue: 14000,
      unit: 'USD',
      higherIsBetter: true,
      measurementFrequency: Frequency.MONTHLY,
    },
    timebound: {
      startDate: new Date('2023-06-01'),
      targetDate: new Date('2025-06-01'),
      estimatedDuration: 730,
      isRecurring: false,
    },
  }),

  // Team/Business Goal
  createMockSmartGoal({
    title: 'Launch Mobile App MVP',
    description: 'Design, develop, and launch minimum viable product for mobile application',
    specificObjective: 'Release fully functional mobile app to app stores with core features and achieve 1000+ downloads in first month',
    category: GoalCategory.PROFESSIONAL,
    priority: GoalPriority.CRITICAL,
    status: GoalStatus.ACTIVE,
    progress: 65,
    tags: ['mobile', 'app', 'mvp', 'launch', 'startup'],
    measurable: {
      metricType: MetricType.NUMBER,
      targetValue: 1000,
      currentValue: 0,
      unit: 'downloads',
      higherIsBetter: true,
      measurementFrequency: Frequency.DAILY,
    },
    timebound: {
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-05-01'),
      estimatedDuration: 120,
      isRecurring: false,
    },
  }),

  // Learning/Education Goal
  createMockSmartGoal({
    title: 'Learn Spanish to Conversational Level',
    description: 'Achieve conversational fluency in Spanish language through structured learning',
    specificObjective: 'Pass DELE B2 (Upper Intermediate) Spanish proficiency exam',
    category: GoalCategory.EDUCATION,
    priority: GoalPriority.MEDIUM,
    status: GoalStatus.ACTIVE,
    progress: 22,
    tags: ['spanish', 'language', 'learning', 'certification'],
    measurable: {
      metricType: MetricType.RATING,
      targetValue: 8, // B2 level equivalent
      currentValue: 3,
      unit: 'CEFR level',
      higherIsBetter: true,
      measurementFrequency: Frequency.MONTHLY,
    },
    timebound: {
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-12-31'),
      estimatedDuration: 365,
      isRecurring: false,
    },
  }),

  // Completed Goal Example
  createMockSmartGoal({
    title: 'Complete DevOps Certification',
    description: 'Earn AWS DevOps Engineer Professional certification',
    specificObjective: 'Pass AWS DevOps Engineer exam with score of 850+ out of 1000',
    category: GoalCategory.PROFESSIONAL,
    priority: GoalPriority.HIGH,
    status: GoalStatus.COMPLETED,
    progress: 100,
    tags: ['aws', 'devops', 'certification', 'cloud'],
    measurable: {
      metricType: MetricType.NUMBER,
      targetValue: 850,
      currentValue: 892,
      unit: 'exam score',
      higherIsBetter: true,
      measurementFrequency: Frequency.ONCE,
    },
    timebound: {
      startDate: new Date('2023-09-01'),
      targetDate: new Date('2023-12-15'),
      estimatedDuration: 105,
      isRecurring: false,
    },
    actualCompletionDate: new Date('2023-12-10'),
  }),
];

// =============================================================================
// Sample Metric Checkpoints
// =============================================================================

export const sampleCheckpoints: MetricCheckpoint[] = [
  {
    id: 'checkpoint-1',
    goalId: demoGoals[0].id,
    value: 15,
    recordedDate: new Date('2024-02-01'),
    note: 'Completed React fundamentals - strong foundation established',
    isAutomatic: false,
    source: 'manual',
    confidence: 0.9,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'user-123',
    updatedBy: 'user-123',
  },
  {
    id: 'checkpoint-2',
    goalId: demoGoals[0].id,
    value: 30,
    recordedDate: new Date('2024-03-01'),
    note: 'Halfway through TypeScript advanced concepts',
    isAutomatic: false,
    source: 'manual',
    confidence: 0.85,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    createdBy: 'user-123',
    updatedBy: 'user-123',
  },
  {
    id: 'checkpoint-3',
    goalId: demoGoals[0].id,
    value: 45,
    recordedDate: new Date('2024-04-01'),
    note: 'Started building first production project - applying learned concepts',
    isAutomatic: false,
    source: 'manual',
    confidence: 0.88,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
    createdBy: 'user-123',
    updatedBy: 'user-123',
  },
];

// =============================================================================
// Demo Scenarios
// =============================================================================

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  goals: SmartGoal[];
  narrative: string;
  keyFeatures: string[];
  testingFocus: string[];
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'scenario-individual-learner',
    name: 'Individual Learner Journey',
    description: 'Solo professional developing new skills',
    goals: [demoGoals[0], demoGoals[4]], // React and Spanish learning
    narrative: `
      Meet Sarah, a frontend developer who wants to advance her career and learn a new language.
      She creates two learning goals: mastering React/TypeScript and learning Spanish.
      Follow her journey as she tracks progress, manages tasks, and achieves her objectives.
    `,
    keyFeatures: [
      'Goal creation wizard',
      'Progress tracking',
      'Task management',
      'Personal metrics',
      'Self-assessment',
    ],
    testingFocus: [
      'Individual workflow',
      'Progress visualization',
      'Task completion',
      'Metric tracking',
      'Goal achievement',
    ],
  },
  {
    id: 'scenario-team-collaboration',
    name: 'Team Product Launch',
    description: 'Team working together on app launch',
    goals: [demoGoals[3]], // Mobile app MVP
    narrative: `
      A startup team of 5 people working together to launch their mobile app.
      The goal involves multiple team members, complex task hierarchies,
      collaborative reviews, and shared metrics tracking.
    `,
    keyFeatures: [
      'Team collaboration',
      'Task assignment',
      'Review workflows',
      'Shared metrics',
      'Real-time updates',
    ],
    testingFocus: [
      'Multi-user collaboration',
      'Permission handling',
      'Real-time sync',
      'Review processes',
      'Team metrics',
    ],
  },
  {
    id: 'scenario-long-term-planning',
    name: 'Long-term Financial Planning',
    description: 'Multi-year financial goal with milestones',
    goals: [demoGoals[2]], // House down payment
    narrative: `
      John is saving for his first house over 2 years.
      This scenario shows long-term planning, milestone tracking,
      regular check-ins, and adjusting strategies over time.
    `,
    keyFeatures: [
      'Long-term tracking',
      'Milestone management',
      'Progress adjustments',
      'Financial metrics',
      'Timeline management',
    ],
    testingFocus: [
      'Long-term data handling',
      'Milestone tracking',
      'Progress adjustments',
      'Data persistence',
      'Timeline views',
    ],
  },
  {
    id: 'scenario-health-fitness',
    name: 'Health & Fitness Journey',
    description: 'Physical fitness goal with regular tracking',
    goals: [demoGoals[1]], // Marathon training
    narrative: `
      Alex is training for their first marathon over 10 months.
      This scenario demonstrates health metric tracking, workout scheduling,
      progress monitoring, and goal adjustment based on performance.
    `,
    keyFeatures: [
      'Health metrics',
      'Regular tracking',
      'Performance analysis',
      'Schedule management',
      'Goal adjustments',
    ],
    testingFocus: [
      'Frequent updates',
      'Metric visualization',
      'Performance tracking',
      'Schedule integration',
      'Health data handling',
    ],
  },
];

// =============================================================================
// Test Data Generators
// =============================================================================

export function generateTestGoalData(count: number = 50): SmartGoal[] {
  const goals: SmartGoal[] = [];
  const categories = Object.values(GoalCategory);
  const priorities = Object.values(GoalPriority);
  const statuses = Object.values(GoalStatus);

  for (let i = 0; i < count; i++) {
    const goal = createMockSmartGoal({
      title: `Test Goal ${i + 1}`,
      description: `This is a test goal number ${i + 1} for performance and scale testing`,
      category: categories[i % categories.length],
      priority: priorities[i % priorities.length],
      status: statuses[i % statuses.length],
      progress: Math.floor(Math.random() * 100),
    });
    goals.push(goal);
  }

  return goals;
}

export function generateStressTestData(): SmartGoal[] {
  const stressGoal = createMockSmartGoal({
    title: 'Stress Test Goal with Many Tasks',
    description: 'This goal has a large number of tasks and subtasks for performance testing',
    category: GoalCategory.PROFESSIONAL,
    priority: GoalPriority.HIGH,
    status: GoalStatus.ACTIVE,
    progress: 25,
  });

  // Add many tasks
  const tasks: Task[] = [];
  for (let i = 0; i < 100; i++) {
    const task = createMockTask('stress-test-goal', {
      title: `Task ${i + 1}`,
      description: `This is task number ${i + 1} with detailed description and requirements`,
      status: i < 25 ? TaskStatus.COMPLETED : i < 50 ? TaskStatus.IN_PROGRESS : TaskStatus.TODO,
      progress: i < 25 ? 100 : i < 50 ? Math.floor(Math.random() * 100) : 0,
      estimatedHours: Math.floor(Math.random() * 20) + 1,
    });
    tasks.push(task);
  }

  stressGoal.tasks = tasks;
  return [stressGoal];
}

// =============================================================================
// Demo Data Export
// =============================================================================

export const demoData = {
  goals: demoGoals,
  templates: goalTemplates,
  checkpoints: sampleCheckpoints,
  scenarios: demoScenarios,
  generators: {
    generateTestGoalData,
    generateStressTestData,
  },
};

export default demoData;