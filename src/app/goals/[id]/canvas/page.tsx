/**
 * Goal Canvas View Page
 *
 * Visual canvas view for goals showing nodes, connections, and relationships
 * in a drag-and-drop interface. This is a placeholder implementation that
 * will be enhanced with a proper canvas library later.
 */

'use client';

import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Share,
  Plus,
  Square,
  Circle,
  Triangle,
  Grid,
} from 'lucide-react';
import React, { useState, useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
// import { Toggle } from '@/components/ui/toggle'; // TODO: Add toggle component
import { mockGoals } from '@/lib/mock-data/smart-goals';
import type { SmartGoal } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

interface CanvasPageProps {
  params: {
    id: string;
  };
}

interface CanvasNode {
  id: string;
  type: 'goal' | 'outcome' | 'milestone' | 'task' | 'metric';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  status?: string;
  progress?: number;
}

interface CanvasConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: 'dependency' | 'contributes' | 'measures' | 'achieves';
  color: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

async function getGoal(id: string): Promise<SmartGoal | null> {
  // TODO: Replace with actual API call
  return mockGoals.find(goal => goal.id === id) || null;
}

const generateNodesFromGoal = (goal: SmartGoal): CanvasNode[] => {
  const nodes: CanvasNode[] = [];

  // Goal node (center)
  nodes.push({
    id: goal.id,
    type: 'goal',
    title: goal.title,
    x: 400,
    y: 300,
    width: 200,
    height: 100,
    color: '#3b82f6',
    status: goal.status,
    progress: goal.progress,
  });

  // Outcomes (top)
  goal.outcomes.forEach((outcome, index) => {
    nodes.push({
      id: outcome.id,
      type: 'outcome',
      title: outcome.description,
      x: 200 + (index * 250),
      y: 100,
      width: 180,
      height: 80,
      color: '#10b981',
    });
  });

  // Milestones (left and right)
  goal.milestones.forEach((milestone, index) => {
    const side = index % 2;
    nodes.push({
      id: milestone.id,
      type: 'milestone',
      title: milestone.title,
      x: side === 0 ? 100 : 700,
      y: 200 + (Math.floor(index / 2) * 120),
      width: 160,
      height: 70,
      color: '#f59e0b',
      status: milestone.isCompleted ? 'completed' : 'active',
      progress: milestone.progress,
    });
  });

  // Tasks (bottom)
  goal.tasks.slice(0, 5).forEach((task, index) => {
    nodes.push({
      id: task.id,
      type: 'task',
      title: task.title,
      x: 150 + (index * 150),
      y: 500,
      width: 140,
      height: 60,
      color: '#8b5cf6',
      status: task.status,
      progress: task.progress,
    });
  });

  // Metric node (top right)
  nodes.push({
    id: `${goal.id}-metric`,
    type: 'metric',
    title: `${goal.measurable.currentValue}/${goal.measurable.targetValue} ${goal.measurable.unit}`,
    x: 650,
    y: 100,
    width: 150,
    height: 60,
    color: '#ef4444',
  });

  return nodes;
};

const generateConnections = (goal: SmartGoal, _nodes: CanvasNode[]): CanvasConnection[] => {
  const connections: CanvasConnection[] = [];
  let connectionId = 1;

  // Connect outcomes to goal
  goal.outcomes.forEach(outcome => {
    connections.push({
      id: `conn-${connectionId++}`,
      fromNodeId: outcome.id,
      toNodeId: goal.id,
      type: 'achieves',
      color: '#10b981',
    });
  });

  // Connect milestones to goal
  goal.milestones.forEach(milestone => {
    connections.push({
      id: `conn-${connectionId++}`,
      fromNodeId: milestone.id,
      toNodeId: goal.id,
      type: 'contributes',
      color: '#f59e0b',
    });
  });

  // Connect tasks to milestones (first task to first milestone, etc.)
  goal.tasks.slice(0, 5).forEach((task, index) => {
    const milestoneIndex = index % goal.milestones.length;
    if (milestoneIndex < goal.milestones.length) {
      connections.push({
        id: `conn-${connectionId++}`,
        fromNodeId: task.id,
        toNodeId: goal.milestones[milestoneIndex].id,
        type: 'contributes',
        color: '#8b5cf6',
      });
    }
  });

  // Connect metric to goal
  connections.push({
    id: `conn-${connectionId++}`,
    fromNodeId: `${goal.id}-metric`,
    toNodeId: goal.id,
    type: 'measures',
    color: '#ef4444',
  });

  return connections;
};

// =============================================================================
// Canvas Components
// =============================================================================

interface CanvasNodeComponentProps {
  node: CanvasNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onMove: (nodeId: string, x: number, y: number) => void;
}

const CanvasNodeComponent: React.FC<CanvasNodeComponentProps> = ({
  node,
  isSelected,
  onSelect,
  onMove: _onMove
}) => {
  const getNodeIcon = () => {
    switch (node.type) {
      case 'goal':
        return '🎯';
      case 'outcome':
        return '🏆';
      case 'milestone':
        return '🚩';
      case 'task':
        return '📋';
      case 'metric':
        return '📊';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-500';
      case 'active':
      case 'in_progress':
        return 'bg-blue-100 border-blue-500';
      case 'blocked':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  return (
    <div
      className={`absolute cursor-move select-none transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
      }}
      onClick={() => onSelect(node.id)}
    >
      <Card className={`h-full ${getStatusColor(node.status)} shadow-md hover:shadow-lg`}>
        <CardContent className="p-3 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg">{getNodeIcon()}</span>
            <Badge variant="secondary" className="text-xs capitalize">
              {node.type}
            </Badge>
          </div>
          <div className="flex-1 min-h-0">
            <h4 className="font-semibold text-sm line-clamp-2">{node.title}</h4>
            {node.progress !== undefined && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium">{node.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${node.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface CanvasToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onExport: () => void;
  onShare: () => void;
  onAddNode: () => void;
  zoom: number;
  showGrid: boolean;
  onToggleGrid: (show: boolean) => void;
  viewMode: 'normal' | 'focus' | 'overview';
  onViewModeChange: (mode: 'normal' | 'focus' | 'overview') => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onExport,
  onShare,
  onAddNode,
  zoom,
  showGrid,
  onToggleGrid,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center justify-between bg-background/95 backdrop-blur-sm border rounded-lg p-2 shadow-sm z-10">
      <div className="flex items-center space-x-2">
        {/* View Mode */}
        <Select value={viewMode} onValueChange={(value: any) => onViewModeChange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="focus">Focus</SelectItem>
            <SelectItem value="overview">Overview</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Controls */}
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Tools */}
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={() => onToggleGrid(!showGrid)}>
          <Grid className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {/* Add Node */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onAddNode}>
              <Circle className="h-4 w-4 mr-2" />
              Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddNode}>
              <Square className="h-4 w-4 mr-2" />
              Milestone
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddNode}>
              <Triangle className="h-4 w-4 mr-2" />
              Outcome
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Export/Share */}
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// =============================================================================
// Main Canvas Page Component
// =============================================================================

export default function GoalCanvasPage({ params }: CanvasPageProps) {
  const [goal, setGoal] = React.useState<SmartGoal | null>(null);
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<CanvasConnection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [viewMode, setViewMode] = useState<'normal' | 'focus' | 'overview'>('normal');

  // Load goal and generate initial canvas
  React.useEffect(() => {
    const loadGoal = async () => {
      const goalData = await getGoal(params.id);
      if (goalData) {
        setGoal(goalData);
        const initialNodes = generateNodesFromGoal(goalData);
        const initialConnections = generateConnections(goalData, initialNodes);
        setNodes(initialNodes);
        setConnections(initialConnections);
      }
    };

    loadGoal();
  }, [params.id]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    if (goal) {
      const resetNodes = generateNodesFromGoal(goal);
      setNodes(resetNodes);
    }
  }, [goal]);

  const handleNodeMove = useCallback((nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, x, y } : node
    ));
  }, []);

  const handleExport = useCallback(() => {
    // TODO: Implement canvas export
    console.log('Export canvas');
  }, []);

  const handleShare = useCallback(() => {
    // TODO: Implement canvas sharing
    console.log('Share canvas');
  }, []);

  const handleAddNode = useCallback(() => {
    // TODO: Implement node addition
    console.log('Add node');
  }, []);

  if (!goal) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Loading canvas...</div>
          <div className="text-sm text-muted-foreground">
            Setting up your goal visualization
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-12rem)] w-full bg-muted/10 rounded-lg overflow-hidden border">
      {/* Canvas Toolbar */}
      <CanvasToolbar
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onExport={handleExport}
        onShare={handleShare}
        onAddNode={handleAddNode}
        zoom={zoom}
        showGrid={showGrid}
        onToggleGrid={setShowGrid}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Canvas Area */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          backgroundImage: showGrid
            ? 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)'
            : 'none',
          backgroundSize: showGrid ? '20px 20px' : 'none',
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map(connection => {
            const fromNode = nodes.find(n => n.id === connection.fromNodeId);
            const toNode = nodes.find(n => n.id === connection.toNodeId);

            if (!fromNode || !toNode) return null;

            const fromX = fromNode.x + fromNode.width / 2;
            const fromY = fromNode.y + fromNode.height / 2;
            const toX = toNode.x + toNode.width / 2;
            const toY = toNode.y + toNode.height / 2;

            return (
              <line
                key={connection.id}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={connection.color}
                strokeWidth="2"
                strokeDasharray={connection.type === 'dependency' ? '5,5' : 'none'}
                opacity="0.7"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <CanvasNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={setSelectedNodeId}
            onMove={handleNodeMove}
          />
        ))}
      </div>

      {/* Property Panel */}
      {selectedNodeId && (
        <div className="absolute top-20 right-4 w-64 bg-background border rounded-lg shadow-lg p-4 z-20">
          <h3 className="font-semibold mb-3">Node Properties</h3>
          {(() => {
            const selectedNode = nodes.find(n => n.id === selectedNodeId);
            if (!selectedNode) return null;

            return (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedNode.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <p className="text-sm text-muted-foreground">{selectedNode.title}</p>
                </div>
                {selectedNode.status && (
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Badge variant="outline" className="capitalize">
                      {selectedNode.status.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
                {selectedNode.progress !== undefined && (
                  <div>
                    <label className="text-sm font-medium">Progress</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${selectedNode.progress}%` }}
                        />
                      </div>
                      <span className="text-sm">{selectedNode.progress}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm border rounded-lg p-2 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>{nodes.length} nodes</span>
          <span>{connections.length} connections</span>
          {selectedNodeId && <span>Selected: {nodes.find(n => n.id === selectedNodeId)?.title}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <span>Canvas View</span>
          <Badge variant="secondary">{viewMode}</Badge>
        </div>
      </div>
    </div>
  );
}