/**
 * MetricEditor Storybook Stories
 *
 * Comprehensive stories showcasing all MetricEditor components and their variations
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { addDays, subDays } from 'date-fns';

// Action utilities not available in Storybook 9
const action =
  (name: string) =>
  (...args: any[]) => {
    // Action handler for Storybook events
    // In a production environment, these would be replaced with actual action handlers
  };

import { TooltipProvider } from '@/components/ui/tooltip';
import {
  MeasurableSpec,
  MetricCheckpoint,
  MetricType,
  Frequency,
} from '@/types/smart-goals.types';

import { CheckpointTracker } from './CheckpointTracker';
import { MetricChart } from './MetricChart';
import { MetricEditor } from './MetricEditor';
import { ExtendedMetricType, ChartType } from './MetricEditor.types';
import {
  MetricTypeSelector,
  MetricTypeGrid,
  MetricTypeCompact,
} from './MetricTypeSelector';

// Sample data for stories
const sampleMetric: MeasurableSpec = {
  metricType: MetricType.PERCENTAGE,
  targetValue: 85,
  currentValue: 72,
  unit: '%',
  minimumValue: 0,
  maximumValue: 100,
  higherIsBetter: true,
  measurementFrequency: Frequency.WEEKLY,
  calculationMethod: 'Customer satisfaction survey average',
  dataSource: 'Monthly customer surveys',
};

const generateSampleCheckpoints = (count: number = 8): MetricCheckpoint[] => {
  const checkpoints: MetricCheckpoint[] = [];
  const baseDate = subDays(new Date(), count * 7); // Start from 8 weeks ago

  for (let i = 0; i < count; i++) {
    const value = 45 + i * 4 + Math.random() * 5; // Trending upward with some variance

    checkpoints.push({
      id: `checkpoint-${i}`,
      goalId: 'sample-goal-id',
      value,
      recordedDate: addDays(baseDate, i * 7),
      note:
        i % 3 === 0 ? `Week ${i + 1} - Quarterly review completed` : undefined,
      isAutomatic: i % 4 === 0,
      source: i % 2 === 0 ? 'Analytics Dashboard' : 'Manual Entry',
      confidence: 0.7 + Math.random() * 0.3, // High confidence
      createdAt: addDays(baseDate, i * 7),
      updatedAt: addDays(baseDate, i * 7),
      createdBy: 'john.doe@example.com',
      updatedBy: 'john.doe@example.com',
    });
  }

  return checkpoints;
};

const sampleCheckpoints = generateSampleCheckpoints();

// Meta configuration
const meta: Meta<typeof MetricEditor> = {
  title: 'Components/MetricEditor',
  component: MetricEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive metric editor for creating and managing measurable specifications with progress tracking.',
      },
    },
  },
  decorators: [
    Story => (
      <TooltipProvider>
        <div className="bg-background min-h-screen">
          <div className="container mx-auto py-8">
            <div className="mx-auto max-w-6xl">
              <Story />
            </div>
          </div>
        </div>
      </TooltipProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricEditor>;

// Main MetricEditor Stories
export const Default: Story = {
  args: {
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};

export const WithInitialData: Story = {
  args: {
    initialMetric: sampleMetric,
    initialCheckpoints: sampleCheckpoints.slice(0, 3),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};

export const ReadOnlyMode: Story = {
  args: {
    initialMetric: sampleMetric,
    initialCheckpoints: sampleCheckpoints,
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    readOnly: true,
  },
};

export const WithFullProgress: Story = {
  args: {
    initialMetric: {
      ...sampleMetric,
      currentValue: 92,
    },
    initialCheckpoints: sampleCheckpoints,
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};

// MetricTypeSelector Stories
export const TypeSelector: StoryObj<typeof MetricTypeSelector> = {
  render: args => <MetricTypeSelector {...args} />,
  args: {
    value: ExtendedMetricType.PERCENTAGE,
    onChange: action('type-changed'),
  },
};

export const TypeSelectorGrid: StoryObj<typeof MetricTypeGrid> = {
  render: args => <MetricTypeGrid {...args} />,
  args: {
    value: ExtendedMetricType.CURRENCY,
    onChange: action('type-changed'),
  },
};

export const TypeSelectorCompact: StoryObj<typeof MetricTypeCompact> = {
  render: args => <MetricTypeCompact {...args} />,
  args: {
    value: ExtendedMetricType.RATING,
    onChange: action('type-changed'),
  },
};

export const TypeSelectorDisabled: StoryObj<typeof MetricTypeSelector> = {
  render: args => <MetricTypeSelector {...args} />,
  args: {
    value: ExtendedMetricType.DURATION,
    onChange: action('type-changed'),
    disabled: true,
  },
};

// CheckpointTracker Stories
export const CheckpointTrackerEmpty: StoryObj<typeof CheckpointTracker> = {
  render: args => <CheckpointTracker {...args} />,
  args: {
    checkpoints: [],
    metric: sampleMetric,
    onChange: action('checkpoints-changed'),
  },
};

export const CheckpointTrackerWithData: StoryObj<typeof CheckpointTracker> = {
  render: args => <CheckpointTracker {...args} />,
  args: {
    checkpoints: sampleCheckpoints,
    metric: sampleMetric,
    onChange: action('checkpoints-changed'),
  },
};

export const CheckpointTrackerReadOnly: StoryObj<typeof CheckpointTracker> = {
  render: args => <CheckpointTracker {...args} />,
  args: {
    checkpoints: sampleCheckpoints,
    metric: sampleMetric,
    onChange: action('checkpoints-changed'),
    readOnly: true,
  },
};

// MetricChart Stories
export const ChartLineChart: StoryObj<typeof MetricChart> = {
  render: args => <MetricChart {...args} />,
  args: {
    checkpoints: sampleCheckpoints,
    metric: sampleMetric,
    chartType: ChartType.LINE,
    onChartTypeChange: action('chart-type-changed'),
    showTarget: true,
    showBaseline: true,
  },
};

export const ChartAreaChart: StoryObj<typeof MetricChart> = {
  render: args => <MetricChart {...args} />,
  args: {
    checkpoints: sampleCheckpoints,
    metric: sampleMetric,
    chartType: ChartType.AREA,
    onChartTypeChange: action('chart-type-changed'),
    showTarget: true,
    showBaseline: false,
  },
};

export const ChartBarChart: StoryObj<typeof MetricChart> = {
  render: args => <MetricChart {...args} />,
  args: {
    checkpoints: sampleCheckpoints,
    metric: sampleMetric,
    chartType: ChartType.BAR,
    onChartTypeChange: action('chart-type-changed'),
    showTarget: true,
  },
};

export const ChartNoData: StoryObj<typeof MetricChart> = {
  render: args => <MetricChart {...args} />,
  args: {
    checkpoints: [],
    metric: sampleMetric,
    chartType: ChartType.LINE,
    onChartTypeChange: action('chart-type-changed'),
  },
};

export const ChartLargeDataset: StoryObj<typeof MetricChart> = {
  render: args => <MetricChart {...args} />,
  args: {
    checkpoints: generateSampleCheckpoints(20),
    metric: sampleMetric,
    chartType: ChartType.LINE,
    onChartTypeChange: action('chart-type-changed'),
    showTarget: true,
    showBaseline: true,
  },
};

// Different Metric Types Stories
export const CurrencyMetric: Story = {
  args: {
    initialMetric: {
      metricType: MetricType.CURRENCY as any,
      targetValue: 50000,
      currentValue: 32500,
      unit: '$',
      minimumValue: 0,
      higherIsBetter: true,
      measurementFrequency: Frequency.MONTHLY,
      calculationMethod: 'Monthly recurring revenue',
      dataSource: 'Billing system',
    } as MeasurableSpec,
    initialCheckpoints: generateSampleCheckpoints(6).map(cp => ({
      ...cp,
      value: 25000 + cp.value * 300, // Scale to currency values
    })),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};

export const DurationMetric: Story = {
  args: {
    initialMetric: {
      metricType: MetricType.DURATION as any,
      targetValue: 2,
      currentValue: 3.5,
      unit: 'seconds',
      minimumValue: 0,
      higherIsBetter: false, // Lower is better for response time
      measurementFrequency: Frequency.DAILY,
      calculationMethod: 'Average API response time',
      dataSource: 'Application monitoring',
    } as MeasurableSpec,
    initialCheckpoints: generateSampleCheckpoints(10).map(cp => ({
      ...cp,
      value: 5 - cp.value / 20, // Decreasing trend
    })),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};

export const BooleanMetric: Story = {
  args: {
    initialMetric: {
      metricType: MetricType.BOOLEAN as any,
      targetValue: 1,
      currentValue: 1,
      unit: '',
      minimumValue: 0,
      maximumValue: 1,
      higherIsBetter: true,
      measurementFrequency: Frequency.DAILY,
      calculationMethod: 'System uptime check',
      dataSource: 'Monitoring dashboard',
    } as MeasurableSpec,
    initialCheckpoints: generateSampleCheckpoints(14).map((cp, _index) => ({
      ...cp,
      value: Math.random() > 0.1 ? 1 : 0, // 90% uptime
    })),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};

// Complex Scenarios
export const MetricWithManyCheckpoints: Story = {
  args: {
    initialMetric: sampleMetric,
    initialCheckpoints: generateSampleCheckpoints(25),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};

export const MetricWithVariedConfidence: Story = {
  args: {
    initialMetric: sampleMetric,
    initialCheckpoints: sampleCheckpoints.map((cp, index) => ({
      ...cp,
      confidence: [0.3, 0.6, 0.8, 0.95][index % 4], // Vary confidence levels
      note:
        index % 3 === 0
          ? `Checkpoint ${index + 1} with detailed notes about the measurement context and any relevant observations.`
          : undefined,
    })),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};

export const MetricOffTrack: Story = {
  args: {
    initialMetric: {
      ...sampleMetric,
      currentValue: 45, // Well below target
    },
    initialCheckpoints: sampleCheckpoints.map(cp => ({
      ...cp,
      value: cp.value * 0.6, // Scale down to show off-track progress
    })),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};

export const MetricCompleted: Story = {
  args: {
    initialMetric: {
      ...sampleMetric,
      currentValue: 88, // Above target
    },
    initialCheckpoints: [
      ...sampleCheckpoints,
      {
        id: 'final-checkpoint',
        goalId: 'sample-goal-id',
        value: 88,
        recordedDate: new Date(),
        note: 'Target achieved! 🎉',
        isAutomatic: false,
        source: 'Final Review',
        confidence: 0.95,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'john.doe@example.com',
        updatedBy: 'john.doe@example.com',
      },
    ],
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  },
};
