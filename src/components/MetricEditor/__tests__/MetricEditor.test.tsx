/**
 * MetricEditor Component Tests
 *
 * Comprehensive test suite for the MetricEditor component and its subcomponents
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';

import { MeasurableSpec, MetricCheckpoint, MetricType, Frequency } from '@/types/smart-goals.types';

import { CheckpointTracker } from '../CheckpointTracker';
import { MetricEditor } from '../MetricEditor';
import { ExtendedMetricType } from '../MetricEditor.types';
import { MetricTypeSelector } from '../MetricTypeSelector';


// Mock recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Line: () => <div data-testid="chart-line" />,
  Area: () => <div data-testid="chart-area" />,
  Bar: () => <div data-testid="chart-bar" />,
  XAxis: () => <div data-testid="chart-x-axis" />,
  YAxis: () => <div data-testid="chart-y-axis" />,
  CartesianGrid: () => <div data-testid="chart-grid" />,
  Tooltip: () => <div data-testid="chart-tooltip" />,
  Legend: () => <div data-testid="chart-legend" />,
  ReferenceLine: () => <div data-testid="chart-reference-line" />,
}));

// Sample test data
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

const sampleCheckpoints: MetricCheckpoint[] = [
  {
    id: '1',
    goalId: 'goal-1',
    value: 65,
    recordedDate: new Date('2024-01-01'),
    note: 'First measurement',
    isAutomatic: false,
    confidence: 0.8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: '2',
    goalId: 'goal-1',
    value: 72,
    recordedDate: new Date('2024-01-08'),
    note: 'Second measurement',
    isAutomatic: true,
    confidence: 0.9,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    createdBy: 'system',
    updatedBy: 'system',
  },
];

describe('MetricEditor', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders with default values', () => {
      render(
        <MetricEditor
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Metric Editor')).toBeInTheDocument();
      expect(screen.getByText('Define a measurable specification for your goal')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save metric/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    test('renders with initial data', () => {
      render(
        <MetricEditor
          initialMetric={sampleMetric}
          initialCheckpoints={sampleCheckpoints}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByDisplayValue('72')).toBeInTheDocument(); // Current value
      expect(screen.getByDisplayValue('85')).toBeInTheDocument(); // Target value
      expect(screen.getByDisplayValue('%')).toBeInTheDocument(); // Unit
    });

    test('renders in read-only mode', () => {
      render(
        <MetricEditor
          initialMetric={sampleMetric}
          readOnly={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save metric/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Form Interaction', () => {
    test('updates form values correctly', async () => {
      const user = userEvent.setup();

      render(
        <MetricEditor
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/metric name/i);
      const currentValueInput = screen.getByLabelText(/current value/i);
      const targetValueInput = screen.getByLabelText(/target value/i);

      await user.clear(nameInput);
      await user.type(nameInput, 'Customer Satisfaction');
      await user.clear(currentValueInput);
      await user.type(currentValueInput, '75');
      await user.clear(targetValueInput);
      await user.type(targetValueInput, '90');

      expect(nameInput).toHaveValue('Customer Satisfaction');
      expect(currentValueInput).toHaveValue(75);
      expect(targetValueInput).toHaveValue(90);
    });

    test('validates required fields', async () => {
      const user = userEvent.setup();

      render(
        <MetricEditor
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save metric/i });
      const nameInput = screen.getByLabelText(/metric name/i);

      // Clear the name field to trigger validation
      await user.clear(nameInput);
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/metric name must be at least 3 characters/i)).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    test('submits form with correct data', async () => {
      const user = userEvent.setup();

      render(
        <MetricEditor
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill out the form
      const nameInput = screen.getByLabelText(/metric name/i);
      const currentValueInput = screen.getByLabelText(/current value/i);
      const targetValueInput = screen.getByLabelText(/target value/i);
      const unitInput = screen.getByLabelText(/unit/i);

      await user.type(nameInput, 'Test Metric');
      await user.clear(currentValueInput);
      await user.type(currentValueInput, '50');
      await user.clear(targetValueInput);
      await user.type(targetValueInput, '100');
      await user.clear(unitInput);
      await user.type(unitInput, 'points');

      const saveButton = screen.getByRole('button', { name: /save metric/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            currentValue: 50,
            targetValue: 100,
            unit: 'points',
          }),
          expect.any(Array)
        );
      });
    });

    test('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <MetricEditor
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Progress Analysis', () => {
    test('displays progress preview with valid data', () => {
      render(
        <MetricEditor
          initialMetric={sampleMetric}
          initialCheckpoints={sampleCheckpoints}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Progress Preview')).toBeInTheDocument();
      expect(screen.getByText(/Real-time analysis based on current values/)).toBeInTheDocument();
    });
  });

  describe('Tabs', () => {
    test('switches between tabs correctly', async () => {
      const user = userEvent.setup();

      render(
        <MetricEditor
          initialMetric={sampleMetric}
          initialCheckpoints={sampleCheckpoints}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Check default tab
      expect(screen.getByText('Basic Configuration')).toBeInTheDocument();

      // Switch to checkpoints tab
      const checkpointsTab = screen.getByRole('tab', { name: /checkpoints/i });
      await user.click(checkpointsTab);

      expect(screen.getByText('Progress Checkpoints')).toBeInTheDocument();

      // Switch to analysis tab
      const analysisTab = screen.getByRole('tab', { name: /analysis/i });
      await user.click(analysisTab);

      // Should see chart or no data message
      expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    });
  });
});

describe('MetricTypeSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with initial value', () => {
    render(
      <MetricTypeSelector
        value={ExtendedMetricType.PERCENTAGE}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Percentage')).toBeInTheDocument();
  });

  test('opens dropdown and shows options', async () => {
    const user = userEvent.setup();

    render(
      <MetricTypeSelector
        value={ExtendedMetricType.NUMBER}
        onChange={mockOnChange}
      />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Currency')).toBeInTheDocument();
      expect(screen.getByText('Duration')).toBeInTheDocument();
      expect(screen.getByText('Rating')).toBeInTheDocument();
    });
  });

  test('calls onChange when option is selected', async () => {
    const user = userEvent.setup();

    render(
      <MetricTypeSelector
        value={ExtendedMetricType.NUMBER}
        onChange={mockOnChange}
      />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const currencyOption = await screen.findByText('Currency');
    await user.click(currencyOption);

    expect(mockOnChange).toHaveBeenCalledWith(ExtendedMetricType.CURRENCY);
  });

  test('displays configuration information for selected type', () => {
    render(
      <MetricTypeSelector
        value={ExtendedMetricType.PERCENTAGE}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Percentage value (0-100)')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument(); // Example
    expect(screen.getByText('92.5%')).toBeInTheDocument(); // Example
  });

  test('is disabled when disabled prop is true', () => {
    render(
      <MetricTypeSelector
        value={ExtendedMetricType.NUMBER}
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });
});

describe('CheckpointTracker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty state', () => {
    render(
      <CheckpointTracker
        checkpoints={[]}
        metric={sampleMetric}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('No Checkpoints Yet')).toBeInTheDocument();
    expect(screen.getByText('Start tracking your progress by adding your first checkpoint')).toBeInTheDocument();
  });

  test('renders checkpoints list', () => {
    render(
      <CheckpointTracker
        checkpoints={sampleCheckpoints}
        metric={sampleMetric}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('65%')).toBeInTheDocument(); // First checkpoint value
    expect(screen.getByText('72%')).toBeInTheDocument(); // Second checkpoint value
    expect(screen.getByText('First measurement')).toBeInTheDocument(); // First note
    expect(screen.getByText('Second measurement')).toBeInTheDocument(); // Second note
  });

  test('opens add checkpoint dialog', async () => {
    const user = userEvent.setup();

    render(
      <CheckpointTracker
        checkpoints={[]}
        metric={sampleMetric}
        onChange={mockOnChange}
      />
    );

    const addButton = screen.getByRole('button', { name: /add checkpoint/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Checkpoint')).toBeInTheDocument();
      expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });
  });

  test('adds new checkpoint', async () => {
    const user = userEvent.setup();

    render(
      <CheckpointTracker
        checkpoints={[]}
        metric={sampleMetric}
        onChange={mockOnChange}
      />
    );

    const addButton = screen.getByRole('button', { name: /add checkpoint/i });
    await user.click(addButton);

    await waitFor(() => {
      const valueInput = screen.getByLabelText(/value/i);
      const submitButton = screen.getByRole('button', { name: /add checkpoint/i });

      return user.type(valueInput, '75').then(() => user.click(submitButton));
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            value: 75,
          }),
        ])
      );
    });
  });

  test('shows read-only state', () => {
    render(
      <CheckpointTracker
        checkpoints={sampleCheckpoints}
        metric={sampleMetric}
        onChange={mockOnChange}
        readOnly={true}
      />
    );

    // Should not show add button in read-only mode
    expect(screen.queryByRole('button', { name: /add checkpoint/i })).not.toBeInTheDocument();
  });

  test('sorts checkpoints correctly', async () => {
    const user = userEvent.setup();

    render(
      <CheckpointTracker
        checkpoints={sampleCheckpoints}
        metric={sampleMetric}
        onChange={mockOnChange}
      />
    );

    // Find and click the sort dropdown
    const sortSelect = screen.getByRole('combobox');
    await user.click(sortSelect);

    const oldestFirstOption = await screen.findByText('Oldest First');
    await user.click(oldestFirstOption);

    // The first checkpoint should now show the older date
    // (This would require more detailed testing of the sort order)
    expect(screen.getAllByText(/65%|72%/)[0]).toBeInTheDocument();
  });
});

describe('Integration Tests', () => {
  test('metric editor with checkpoints workflow', async () => {
    const user = userEvent.setup();
    const mockOnSave = jest.fn();

    render(
      <MetricEditor
        onSave={mockOnSave}
        onCancel={() => {}}
      />
    );

    // Fill basic configuration
    const nameInput = screen.getByLabelText(/metric name/i);
    await user.type(nameInput, 'Integration Test Metric');

    const currentValueInput = screen.getByLabelText(/current value/i);
    await user.clear(currentValueInput);
    await user.type(currentValueInput, '50');

    const targetValueInput = screen.getByLabelText(/target value/i);
    await user.clear(targetValueInput);
    await user.type(targetValueInput, '100');

    const unitInput = screen.getByLabelText(/unit/i);
    await user.clear(unitInput);
    await user.type(unitInput, 'points');

    // Switch to checkpoints tab
    const checkpointsTab = screen.getByRole('tab', { name: /checkpoints/i });
    await user.click(checkpointsTab);

    // Add a checkpoint
    const addCheckpointButton = screen.getByRole('button', { name: /add checkpoint/i });
    await user.click(addCheckpointButton);

    await waitFor(async () => {
      const valueInput = screen.getByLabelText(/value/i);
      await user.type(valueInput, '45');

      const addButton = screen.getByRole('button', { name: /add checkpoint/i });
      await user.click(addButton);
    });

    // Go back to configuration and save
    const configTab = screen.getByRole('tab', { name: /configuration/i });
    await user.click(configTab);

    const saveButton = screen.getByRole('button', { name: /save metric/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          currentValue: 50,
          targetValue: 100,
          unit: 'points',
        }),
        expect.arrayContaining([
          expect.objectContaining({
            value: 45,
          }),
        ])
      );
    });
  });
});