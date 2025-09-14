/**
 * Goal Metrics View Page
 *
 * Comprehensive metrics dashboard for goals showing progress charts,
 * metric tracking, trend analysis, and performance indicators.
 */

'use client';

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { MetricEditor } from '@/components/MetricEditor/MetricEditor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { SmartGoal, MetricType } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

interface MetricsPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface MetricTrendData {
  date: Date;
  value: number;
  target?: number;
  label?: string;
}

interface MetricSummary {
  current: number;
  target: number;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  lastUpdated: Date;
}

// =============================================================================
// Helper Functions
// =============================================================================

async function getGoal(id: string): Promise<SmartGoal | null> {
  // TODO: Replace with actual API call
  return mockGoals.find(goal => goal.id === id) || null;
}

const generateMockTrendData = (goal: SmartGoal): MetricTrendData[] => {
  const data: MetricTrendData[] = [];
  const startDate = new Date(goal.timebound.startDate);
  const endDate = new Date(goal.timebound.targetDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Generate weekly data points
  for (let week = 0; week <= Math.min(Math.ceil(daysElapsed / 7), 20); week++) {
    const date = new Date(startDate.getTime() + (week * 7 * 24 * 60 * 60 * 1000));
    const progressRatio = Math.min(week / (totalDays / 7), 1);

    // Add some variance to make it realistic
    const variance = 0.1 + Math.random() * 0.2;
    const value = Math.round(goal.measurable.targetValue * progressRatio * variance);

    data.push({
      date,
      value: Math.min(value, goal.measurable.targetValue),
      target: Math.round(goal.measurable.targetValue * progressRatio),
      label: `Week ${week + 1}`,
    });
  }

  return data;
};

const calculateMetricSummary = (goal: SmartGoal, trendData: MetricTrendData[]): MetricSummary => {
  const current = goal.measurable.currentValue;
  const target = goal.measurable.targetValue;
  const progress = Math.min((current / target) * 100, 100);

  // Calculate trend from last two data points
  let trend: 'up' | 'down' | 'stable' = 'stable';
  let changePercent = 0;

  if (trendData.length >= 2) {
    const lastValue = trendData[trendData.length - 1].value;
    const previousValue = trendData[trendData.length - 2].value;
    const change = lastValue - previousValue;

    if (change > 0) trend = 'up';
    else if (change < 0) trend = 'down';

    changePercent = previousValue > 0 ? Math.abs((change / previousValue) * 100) : 0;
  }

  return {
    current,
    target,
    progress,
    trend,
    changePercent,
    lastUpdated: new Date(goal.updatedAt),
  };
};

const formatMetricValue = (value: number, unit: string, type: MetricType): string => {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: unit || 'USD',
      }).format(value);
    case 'percentage':
      return `${value}%`;
    case 'duration':
      if (unit === 'hours') return `${value}h`;
      if (unit === 'days') return `${value}d`;
      return `${value} ${unit}`;
    default:
      return `${value} ${unit}`;
  }
};

// =============================================================================
// Components
// =============================================================================

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'text-primary',
  onClick
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon()}
              <span className={trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}>
                {trendValue}
              </span>
              <span className="text-muted-foreground">from last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface SimpleChartProps {
  data: MetricTrendData[];
  height?: number;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.target || 0)));
  const minValue = Math.min(...data.map(d => Math.min(d.value, d.target || 0)));
  const range = maxValue - minValue || 1;

  const getY = (value: number) => {
    return height - ((value - minValue) / range) * height;
  };

  const getX = (index: number) => {
    return (index / (data.length - 1)) * 300;
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg width="400" height={height + 40} className="w-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - (ratio * height);
          return (
            <g key={ratio}>
              <line
                x1={0}
                y1={y}
                x2={300}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray={ratio === 0 ? "none" : "2,2"}
              />
            </g>
          );
        })}

        {/* Target line */}
        {data[0]?.target && (
          <line
            x1={0}
            y1={getY(data[0].target)}
            x2={300}
            y2={getY(data[data.length - 1]?.target || data[0].target)}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}

        {/* Actual values line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ')}
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d.value)}
            r="4"
            fill="#3b82f6"
            className="hover:r-6 transition-all cursor-pointer"
          >
            <title>{`${d.label}: ${d.value}`}</title>
          </circle>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={height + 20}
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
};

interface MetricsToolbarProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  onEditMetric: () => void;
}

const MetricsToolbar: React.FC<MetricsToolbarProps> = ({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  onExport,
  onEditMetric
}) => {
  return (
    <div className="flex items-center justify-between bg-background border rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Metrics Dashboard</h2>
        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onEditMetric}>
          Edit Metric
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

// =============================================================================
// Main Metrics Page Component
// =============================================================================

export default function GoalMetricsPage({ params }: MetricsPageProps) {
  const [id, setId] = React.useState<string>('');

  React.useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);
  const [goal, setGoal] = React.useState<SmartGoal | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [editingMetric, setEditingMetric] = useState(false);

  // Load goal data
  React.useEffect(() => {
    if (!id) return;
    const loadGoal = async () => {
      const goalData = await getGoal(id);
      if (goalData) {
        setGoal(goalData);
      }
    };

    loadGoal();
  }, [id]);

  const trendData = useMemo(() => {
    if (!goal) return [];
    return generateMockTrendData(goal);
  }, [goal, timeRange]);

  const metricSummary = useMemo(() => {
    if (!goal) return null;
    return calculateMetricSummary(goal, trendData);
  }, [goal, trendData]);

  const handleRefresh = () => {
    // TODO: Refresh metrics data
    console.log('Refresh metrics');
  };

  const handleExport = () => {
    // TODO: Export metrics data
    console.log('Export metrics');
  };

  const handleEditMetric = () => {
    setEditingMetric(true);
  };

  if (!goal) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Loading metrics...</div>
          <div className="text-sm text-muted-foreground">
            Analyzing your goal performance
          </div>
        </div>
      </div>
    );
  }

  if (!metricSummary) return null;

  const formattedCurrent = formatMetricValue(
    metricSummary.current,
    goal.measurable.unit,
    goal.measurable.metricType
  );

  const formattedTarget = formatMetricValue(
    metricSummary.target,
    goal.measurable.unit,
    goal.measurable.metricType
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <MetricsToolbar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onEditMetric={handleEditMetric}
      />

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Value"
          value={formattedCurrent}
          subtitle={`Target: ${formattedTarget}`}
          icon={Target}
          color="text-blue-600"
        />

        <MetricCard
          title="Progress"
          value={`${Math.round(metricSummary.progress)}%`}
          subtitle="of target achieved"
          icon={TrendingUp}
          trend={metricSummary.trend}
          trendValue={`${metricSummary.changePercent.toFixed(1)}%`}
          color="text-green-600"
        />

        <MetricCard
          title="Time Remaining"
          value={`${Math.max(0, Math.ceil((new Date(goal.timebound.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}`}
          subtitle="days left"
          icon={Clock}
          color="text-orange-600"
        />

        <MetricCard
          title="Last Updated"
          value={metricSummary.lastUpdated.toLocaleDateString()}
          subtitle={metricSummary.lastUpdated.toLocaleTimeString()}
          icon={RefreshCw}
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Progress Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Actual Progress</span>
                  <span>Target Progress</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">Actual</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border-2 border-orange-400 border-dashed rounded"></div>
                    <span className="text-sm">Target</span>
                  </div>
                </div>
              </div>
              <SimpleChart data={trendData} height={250} />
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Progress Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Progress Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Progress</span>
                  <span className="font-medium">{Math.round(metricSummary.progress)}%</span>
                </div>
                <Progress value={metricSummary.progress} className="h-2" />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasks Completed</span>
                  <span className="font-medium">
                    {goal.tasks.filter(t => t.status === 'completed').length}/{goal.tasks.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Milestones Achieved</span>
                  <span className="font-medium">
                    {goal.milestones.filter(m => m.isCompleted).length}/{goal.milestones.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Success Probability</span>
                  <span className="font-medium">
                    {Math.round(goal.achievability.successProbability * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goal.checkpoints.slice(0, 5).map((checkpoint, index) => (
                  <div key={checkpoint.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        Updated to {formatMetricValue(
                          checkpoint.value,
                          goal.measurable.unit,
                          goal.measurable.metricType
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {checkpoint.recordedDate.toLocaleDateString()}
                      </p>
                      {checkpoint.note && (
                        <p className="text-xs text-muted-foreground italic">
                          "{checkpoint.note}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {goal.checkpoints.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent metric updates
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {metricSummary.progress >= 80 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : metricSummary.progress >= 60 ? (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">Progress Status</span>
                </div>
                <Badge variant={
                  metricSummary.progress >= 80 ? 'default' :
                  metricSummary.progress >= 60 ? 'secondary' : 'destructive'
                }>
                  {metricSummary.progress >= 80 ? 'On Track' :
                   metricSummary.progress >= 60 ? 'At Risk' : 'Behind'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {metricSummary.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : metricSummary.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <div className="h-4 w-4 bg-gray-400 rounded-full" />
                  )}
                  <span className="text-sm">Trend Direction</span>
                </div>
                <Badge variant="outline">
                  {metricSummary.trend === 'up' ? 'Improving' :
                   metricSummary.trend === 'down' ? 'Declining' : 'Stable'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Update Frequency</span>
                </div>
                <Badge variant="outline">
                  {goal.measurable.measurementFrequency}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Metric Editor Modal */}
      {editingMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <MetricEditor
              goalId={goal.id}
              initialData={goal.measurable}
              onSave={(updatedMetric) => {
                // TODO: Update metric
                console.log('Save metric:', updatedMetric);
                setEditingMetric(false);
              }}
              onCancel={() => setEditingMetric(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}