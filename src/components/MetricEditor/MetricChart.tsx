/**
 * MetricChart Component
 *
 * Component for visualizing metric progress over time using recharts with
 * multiple chart types, target lines, and interactive features.
 */

'use client';

import { format } from 'date-fns';
import {
  BarChart3,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  TrendingUp,
  Download,
  Maximize2,
  Settings,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import {
  ChartType,
  MetricChartProps,
  ExtendedMetricType,
} from './MetricEditor.types';
import {
  formatMetricValue,
  calculateCheckpointStatistics,
} from './MetricEditor.utils';

// Chart theme colors
const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  target: 'hsl(var(--destructive))',
  baseline: 'hsl(var(--muted-foreground))',
  trend: 'hsl(var(--secondary))',
  area: 'hsl(var(--primary) / 0.2)',
};

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border-border rounded-lg border p-3 shadow-lg">
        <p className="text-sm font-medium">
          {format(new Date(label as string), 'MMM dd, yyyy')}
        </p>
        <div className="mt-2 space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
          {data.note && (
            <p className="text-muted-foreground mt-2 text-xs italic">
              {data.note}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
}

/**
 * MetricChart Component
 *
 * Renders interactive charts for metric visualization
 */
export function MetricChart({
  checkpoints,
  metric,
  chartType,
  onChartTypeChange,
  height = 400,
  showTarget = true,
  showBaseline = true,
  className,
}: MetricChartProps): React.JSX.Element {
  const [showTrendLine, setShowTrendLine] = useState(true);
  // const [_showConfidenceInterval, _setShowConfidenceInterval] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (checkpoints.length === 0) return [];

    const sortedCheckpoints = [...checkpoints].sort(
      (a, b) => a.recordedDate.getTime() - b.recordedDate.getTime()
    );

    return sortedCheckpoints.map((checkpoint, index) => ({
      date: checkpoint.recordedDate.toISOString(),
      dateLabel: format(checkpoint.recordedDate, 'MMM dd'),
      value: checkpoint.value,
      formattedValue: formatMetricValue(
        checkpoint.value,
        metric.metricType as unknown as ExtendedMetricType,
        metric.unit
      ),
      confidence: checkpoint.confidence || 0.5,
      note: checkpoint.note,
      isAutomatic: checkpoint.isAutomatic,
      index: index + 1,
    }));
  }, [checkpoints, metric]);

  // Calculate statistics
  const statistics = useMemo(() => {
    return calculateCheckpointStatistics(checkpoints);
  }, [checkpoints]);

  // Calculate trend line data
  const trendLineData = useMemo(() => {
    if (chartData.length < 2) return [];

    const xValues = chartData.map((_, index) => index);
    const yValues = chartData.map(d => d.value);
    const n = chartData.length;

    // Simple linear regression
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
    const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return chartData.map((d, index) => ({
      ...d,
      trend: slope * index + intercept,
    }));
  }, [chartData]);

  // Format value for display
  const formatValue = (value: number) => {
    return formatMetricValue(
      value,
      metric.metricType as unknown as ExtendedMetricType,
      metric.unit
    );
  };

  // Handle export
  const handleExport = () => {
    // In a real implementation, this would export the chart as an image
    // For now, we'll just copy the data to clipboard
    const exportData = {
      metric: metric,
      checkpoints: checkpoints,
      statistics: statistics,
      exportedAt: new Date().toISOString(),
    };

    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    // Chart data exported to clipboard
  };

  // Chart components based on type
  const renderChart = () => {
    const data = showTrendLine ? trendLineData : chartData;
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case ChartType.LINE:
        return (
          <LineChart width={800} height={height} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 12 }}
              tickLine={{ opacity: 0.5 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ opacity: 0.5 }}
              tickFormatter={value => formatValue(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {showTarget && (
              <ReferenceLine
                y={metric.targetValue}
                stroke={CHART_COLORS.target}
                strokeDasharray="5 5"
                label={{ value: 'Target', position: 'insideTopRight' }}
              />
            )}

            {showBaseline && metric.minimumValue && (
              <ReferenceLine
                y={metric.minimumValue}
                stroke={CHART_COLORS.baseline}
                strokeDasharray="3 3"
                label={{ value: 'Baseline', position: 'insideTopRight' }}
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: CHART_COLORS.primary, strokeWidth: 2 }}
              name="Actual"
            />

            {showTrendLine && (
              <Line
                type="monotone"
                dataKey="trend"
                stroke={CHART_COLORS.trend}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Trend"
              />
            )}
          </LineChart>
        );

      case ChartType.AREA:
        return (
          <AreaChart width={800} height={height} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 12 }}
              tickLine={{ opacity: 0.5 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ opacity: 0.5 }}
              tickFormatter={value => formatValue(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {showTarget && (
              <ReferenceLine
                y={metric.targetValue}
                stroke={CHART_COLORS.target}
                strokeDasharray="5 5"
                label={{ value: 'Target', position: 'insideTopRight' }}
              />
            )}

            <Area
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              fill={CHART_COLORS.area}
              dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
              name="Actual"
            />
          </AreaChart>
        );

      case ChartType.BAR:
        return (
          <BarChart width={800} height={height} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 12 }}
              tickLine={{ opacity: 0.5 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ opacity: 0.5 }}
              tickFormatter={value => formatValue(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {showTarget && (
              <ReferenceLine
                y={metric.targetValue}
                stroke={CHART_COLORS.target}
                strokeDasharray="5 5"
                label={{ value: 'Target', position: 'insideTopRight' }}
              />
            )}

            <Bar
              dataKey="value"
              fill={CHART_COLORS.primary}
              name="Actual"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      default:
        return null;
    }
  };

  const chartContent = (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-2">
            <Label className="text-sm">Chart:</Label>
            <Select value={chartType} onValueChange={onChartTypeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ChartType.LINE}>
                  <div className="flex items-center gap-2">
                    <LineChartIcon className="h-4 w-4" />
                    Line
                  </div>
                </SelectItem>
                <SelectItem value={ChartType.AREA}>
                  <div className="flex items-center gap-2">
                    <AreaChartIcon className="h-4 w-4" />
                    Area
                  </div>
                </SelectItem>
                <SelectItem value={ChartType.BAR}>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Bar
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Trend:</span>
              <Badge variant="outline">
                {statistics.trendSlope > 0
                  ? '↗'
                  : statistics.trendSlope < 0
                    ? '↘'
                    : '→'}
                {statistics.trendSlope.toFixed(2)}/period
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Avg:</span>
              <span className="font-medium">
                {formatValue(statistics.average)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-4">
                <h4 className="font-medium">Chart Options</h4>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-target" className="text-sm">
                    Show Target Line
                  </Label>
                  <Switch
                    id="show-target"
                    checked={showTarget}
                    onCheckedChange={() => {}}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-baseline" className="text-sm">
                    Show Baseline
                  </Label>
                  <Switch
                    id="show-baseline"
                    checked={showBaseline}
                    onCheckedChange={() => {}}
                    disabled
                  />
                </div>

                {chartType === ChartType.LINE && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-trend" className="text-sm">
                      Show Trend Line
                    </Label>
                    <Switch
                      id="show-trend"
                      checked={showTrendLine}
                      onCheckedChange={setShowTrendLine}
                    />
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Export Button */}
          <Button variant="ghost" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>

          {/* Fullscreen Toggle */}
          <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-6xl">
              <DialogHeader>
                <DialogTitle>Metric Progress Chart</DialogTitle>
              </DialogHeader>
              <div className="h-[70vh] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart() || <div>Chart not available</div>}
                </ResponsiveContainer>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart() || <div>Chart not available</div>}
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (checkpoints.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="space-y-2 text-center">
            <BarChart3 className="text-muted-foreground mx-auto h-12 w-12" />
            <h3 className="text-lg font-medium">No Data to Display</h3>
            <p className="text-muted-foreground max-w-sm">
              Add some checkpoints to see your progress visualized in charts
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Visualization
            </CardTitle>
            <CardDescription>
              Track your metric progress over time with interactive charts
            </CardDescription>
          </div>
          <Badge variant="outline">{checkpoints.length} checkpoints</Badge>
        </div>
      </CardHeader>
      <CardContent>{chartContent}</CardContent>
    </Card>
  );
}

export default MetricChart;
