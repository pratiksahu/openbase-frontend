/**
 * AchievableStep Component
 *
 * This component provides the fourth step of the GoalWizard where users assess
 * the feasibility of their goal by identifying required resources, skills,
 * constraints, and conducting risk analysis.
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Clock,
  User,
  Wrench,
  BookOpen,
  Shield,
  TrendingDown,
  Target,
  HelpCircle,
  Calculator,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

import {
  AchievableStepProps,
  AchievableStepData,
} from '../GoalWizard.types';
import { Resource, RequiredSkill, Constraint } from '@/types/smart-goals.types';

// =============================================================================
// Resource Categories
// =============================================================================

const RESOURCE_CATEGORIES = {
  human: {
    name: 'Human Resources',
    icon: Users,
    color: 'text-blue-600',
    examples: ['Team members', 'Contractors', 'Consultants', 'Subject matter experts'],
  },
  financial: {
    name: 'Financial Resources',
    icon: DollarSign,
    color: 'text-green-600',
    examples: ['Budget allocation', 'Investment funds', 'Operating expenses', 'Emergency fund'],
  },
  technical: {
    name: 'Technical Resources',
    icon: Wrench,
    color: 'text-purple-600',
    examples: ['Software tools', 'Hardware equipment', 'Infrastructure', 'Technology stack'],
  },
  knowledge: {
    name: 'Knowledge & Information',
    icon: BookOpen,
    color: 'text-orange-600',
    examples: ['Training materials', 'Documentation', 'Research data', 'Best practices'],
  },
  time: {
    name: 'Time & Schedule',
    icon: Clock,
    color: 'text-red-600',
    examples: ['Project timeline', 'Resource availability', 'Scheduling windows', 'Deadlines'],
  },
};

// =============================================================================
// Constraint Types
// =============================================================================

const CONSTRAINT_TYPES = {
  time: { name: 'Time Constraints', icon: Clock, color: 'bg-red-50 text-red-700' },
  resource: { name: 'Resource Limitations', icon: DollarSign, color: 'bg-green-50 text-green-700' },
  skill: { name: 'Skill Gaps', icon: User, color: 'bg-blue-50 text-blue-700' },
  external: { name: 'External Dependencies', icon: Users, color: 'bg-purple-50 text-purple-700' },
  regulatory: { name: 'Regulatory/Compliance', icon: Shield, color: 'bg-yellow-50 text-yellow-700' },
  technical: { name: 'Technical Limitations', icon: Wrench, color: 'bg-gray-50 text-gray-700' },
  financial: { name: 'Budget Constraints', icon: Calculator, color: 'bg-orange-50 text-orange-700' },
};

// =============================================================================
// Resource Form Component
// =============================================================================

interface ResourceFormProps {
  onAdd: (resource: Resource) => void;
  onCancel: () => void;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ onAdd, onCancel }) => {
  const [resource, setResource] = useState<Partial<Resource>>({
    type: 'human',
    quantity: 1,
    unit: '',
    isAvailable: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resource.name?.trim() && resource.type && resource.quantity && resource.unit) {
      onAdd({
        id: `resource-${Date.now()}`,
        name: resource.name,
        type: resource.type,
        quantity: resource.quantity,
        unit: resource.unit,
        isAvailable: resource.isAvailable || false,
        acquisitionCost: resource.acquisitionCost,
        acquisitionTime: resource.acquisitionTime,
        description: resource.description,
      });
    }
  };

  const categoryInfo = RESOURCE_CATEGORIES[resource.type as keyof typeof RESOURCE_CATEGORIES];
  const IconComponent = categoryInfo?.icon || User;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Resource Name *</Label>
          <Input
            value={resource.name || ''}
            onChange={(e) => setResource({ ...resource, name: e.target.value })}
            placeholder="Enter resource name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={resource.type}
            onValueChange={(value) => setResource({ ...resource, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(RESOURCE_CATEGORIES).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      <Icon className={cn('h-4 w-4', category.color)} />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Quantity *</Label>
          <Input
            type="number"
            value={resource.quantity}
            onChange={(e) => setResource({ ...resource, quantity: Number(e.target.value) })}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Unit *</Label>
          <Input
            value={resource.unit || ''}
            onChange={(e) => setResource({ ...resource, unit: e.target.value })}
            placeholder="e.g., hours, people, licenses"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Acquisition Cost (optional)</Label>
          <Input
            type="number"
            value={resource.acquisitionCost || ''}
            onChange={(e) => setResource({ ...resource, acquisitionCost: Number(e.target.value) || undefined })}
            placeholder="Cost in $"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Time to Acquire (days, optional)</Label>
          <Input
            type="number"
            value={resource.acquisitionTime || ''}
            onChange={(e) => setResource({ ...resource, acquisitionTime: Number(e.target.value) || undefined })}
            placeholder="Days needed"
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={resource.description || ''}
          onChange={(e) => setResource({ ...resource, description: e.target.value })}
          placeholder="Additional details about this resource..."
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isAvailable"
          checked={resource.isAvailable}
          onChange={(e) => setResource({ ...resource, isAvailable: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isAvailable">Resource is currently available</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>
    </form>
  );
};

// =============================================================================
// Skill Form Component
// =============================================================================

interface SkillFormProps {
  onAdd: (skill: RequiredSkill) => void;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ onAdd, onCancel }) => {
  const [skill, setSkill] = useState<Partial<RequiredSkill>>({
    requiredLevel: 7,
    currentLevel: 5,
    isCritical: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skill.name?.trim() && skill.requiredLevel && skill.currentLevel !== undefined) {
      onAdd({
        id: `skill-${Date.now()}`,
        name: skill.name,
        requiredLevel: skill.requiredLevel,
        currentLevel: skill.currentLevel,
        isCritical: skill.isCritical || false,
        developmentPlan: skill.developmentPlan,
        timeToAcquire: skill.timeToAcquire,
      });
    }
  };

  const skillGap = (skill.requiredLevel || 0) - (skill.currentLevel || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Skill Name *</Label>
          <Input
            value={skill.name || ''}
            onChange={(e) => setSkill({ ...skill, name: e.target.value })}
            placeholder="e.g., Project Management, Python Programming"
            required
          />
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="isCritical"
            checked={skill.isCritical}
            onChange={(e) => setSkill({ ...skill, isCritical: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="isCritical">Critical for success</Label>
        </div>

        <div className="space-y-2">
          <Label>Required Level (1-10) *</Label>
          <Input
            type="number"
            value={skill.requiredLevel}
            onChange={(e) => setSkill({ ...skill, requiredLevel: Number(e.target.value) })}
            min="1"
            max="10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Current Level (1-10) *</Label>
          <Input
            type="number"
            value={skill.currentLevel}
            onChange={(e) => setSkill({ ...skill, currentLevel: Number(e.target.value) })}
            min="1"
            max="10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Time to Acquire (weeks, optional)</Label>
          <Input
            type="number"
            value={skill.timeToAcquire || ''}
            onChange={(e) => setSkill({ ...skill, timeToAcquire: Number(e.target.value) || undefined })}
            placeholder="Weeks needed to reach required level"
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Development Plan</Label>
        <Textarea
          value={skill.developmentPlan || ''}
          onChange={(e) => setSkill({ ...skill, developmentPlan: e.target.value })}
          placeholder="How will you develop this skill? (training, courses, mentoring, etc.)"
          rows={3}
        />
      </div>

      {skillGap > 0 && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Skill gap identified: {skillGap} point{skillGap > 1 ? 's' : ''} to reach required level
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>
    </form>
  );
};

// =============================================================================
// Constraint Form Component
// =============================================================================

interface ConstraintFormProps {
  onAdd: (constraint: Constraint) => void;
  onCancel: () => void;
}

const ConstraintForm: React.FC<ConstraintFormProps> = ({ onAdd, onCancel }) => {
  const [constraint, setConstraint] = useState<Partial<Constraint>>({
    impactLevel: 5,
    probability: 0.5,
    type: 'time',
    status: 'identified',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (constraint.description?.trim()) {
      onAdd({
        id: `constraint-${Date.now()}`,
        description: constraint.description,
        impactLevel: constraint.impactLevel || 5,
        probability: constraint.probability || 0.5,
        type: constraint.type as any,
        status: constraint.status as any,
        mitigationStrategy: constraint.mitigationStrategy,
        contingencyPlan: constraint.contingencyPlan,
      });
    }
  };

  const riskLevel = (constraint.impactLevel || 5) * (constraint.probability || 0.5);
  const getRiskColor = () => {
    if (riskLevel >= 7) return 'text-red-600';
    if (riskLevel >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Constraint Description *</Label>
        <Textarea
          value={constraint.description || ''}
          onChange={(e) => setConstraint({ ...constraint, description: e.target.value })}
          placeholder="Describe the constraint or obstacle..."
          rows={2}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Type *</Label>
          <Select
            value={constraint.type}
            onValueChange={(value: any) => setConstraint({ ...constraint, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CONSTRAINT_TYPES).map(([key, type]) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Impact Level (1-10) *</Label>
          <Input
            type="number"
            value={constraint.impactLevel}
            onChange={(e) => setConstraint({ ...constraint, impactLevel: Number(e.target.value) })}
            min="1"
            max="10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Probability (0-1) *</Label>
          <Input
            type="number"
            value={constraint.probability}
            onChange={(e) => setConstraint({ ...constraint, probability: Number(e.target.value) })}
            min="0"
            max="1"
            step="0.1"
            required
          />
        </div>
      </div>

      <div className="p-3 bg-secondary rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Risk Score</span>
          <span className={cn('text-sm font-bold', getRiskColor())}>
            {riskLevel.toFixed(1)}/10
          </span>
        </div>
        <div className="mt-2">
          <Progress value={riskLevel * 10} className="h-2" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mitigation Strategy</Label>
        <Textarea
          value={constraint.mitigationStrategy || ''}
          onChange={(e) => setConstraint({ ...constraint, mitigationStrategy: e.target.value })}
          placeholder="How will you mitigate this constraint?"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Contingency Plan</Label>
        <Textarea
          value={constraint.contingencyPlan || ''}
          onChange={(e) => setConstraint({ ...constraint, contingencyPlan: e.target.value })}
          placeholder="What's your backup plan if mitigation fails?"
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add Constraint
        </Button>
      </div>
    </form>
  );
};

// =============================================================================
// Main AchievableStep Component
// =============================================================================

export const AchievableStep: React.FC<AchievableStepProps> = ({
  data,
  onChange,
  errors,
  readOnly = false,
  className,
  warnings,
  suggestions,
}) => {
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showConstraintForm, setShowConstraintForm] = useState(false);

  const handleChange = (field: keyof AchievableStepData, value: any) => {
    onChange({ [field]: value });
  };

  // Calculate achievability score
  const achievabilityScore = useMemo(() => {
    let score = 0;
    let maxScore = 0;

    // Resources assessment (0-30 points)
    maxScore += 30;
    const availableResources = data.requiredResources.filter(r => r.isAvailable).length;
    const totalResources = data.requiredResources.length;
    if (totalResources > 0) {
      score += (availableResources / totalResources) * 30;
    } else {
      score += 15; // Partial score if no resources identified
    }

    // Skills assessment (0-30 points)
    maxScore += 30;
    const skillGaps = data.requiredSkills.map(s => Math.max(0, s.requiredLevel - s.currentLevel));
    const avgSkillGap = skillGaps.length > 0 ? skillGaps.reduce((a, b) => a + b, 0) / skillGaps.length : 0;
    if (skillGaps.length > 0) {
      score += Math.max(0, 30 - (avgSkillGap * 3));
    } else {
      score += 15; // Partial score if no skills identified
    }

    // Risk assessment (0-20 points)
    maxScore += 20;
    const riskScores = data.constraints.map(c => c.impactLevel * c.probability);
    const avgRisk = riskScores.length > 0 ? riskScores.reduce((a, b) => a + b, 0) / riskScores.length : 5;
    score += Math.max(0, 20 - (avgRisk * 2));

    // Risk mitigation (0-20 points)
    maxScore += 20;
    const mitigatedConstraints = data.constraints.filter(c => c.mitigationStrategy?.trim()).length;
    if (data.constraints.length > 0) {
      score += (mitigatedConstraints / data.constraints.length) * 20;
    } else {
      score += 10; // Partial score if no constraints identified
    }

    return Math.round((score / maxScore) * 100);
  }, [data.requiredResources, data.requiredSkills, data.constraints]);

  const getScoreColor = () => {
    if (achievabilityScore >= 80) return 'text-green-600';
    if (achievabilityScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = () => {
    if (achievabilityScore >= 80) return 'Highly Achievable';
    if (achievabilityScore >= 60) return 'Moderately Achievable';
    if (achievabilityScore >= 40) return 'Challenging but Possible';
    return 'High Risk / May Need Revision';
  };

  return (
    <TooltipProvider>
      <div className={cn('space-y-8', className)}>
        {/* Step Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Make it Achievable</h2>
          <p className="text-muted-foreground">
            Assess the feasibility of your goal by identifying resources, skills, and potential constraints.
          </p>
        </div>

        {/* Achievability Score */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Achievability Assessment
                </CardTitle>
                <CardDescription>
                  Based on your resources, skills, and risk analysis
                </CardDescription>
              </div>
              <Badge variant="outline" className={cn('text-lg px-3 py-1', getScoreColor())}>
                {achievabilityScore}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Achievability Score</span>
                <span className={cn('font-medium', getScoreColor())}>
                  {getScoreDescription()}
                </span>
              </div>
              <Progress value={achievabilityScore} className="h-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Resources:</span>
                  <div className="font-medium">
                    {data.requiredResources.filter(r => r.isAvailable).length}/{data.requiredResources.length} Available
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Skills:</span>
                  <div className="font-medium">
                    {data.requiredSkills.length} Identified
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Constraints:</span>
                  <div className="font-medium">
                    {data.constraints.length} Identified
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Mitigated:</span>
                  <div className="font-medium">
                    {data.constraints.filter(c => c.mitigationStrategy).length}/{data.constraints.length}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Resources */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Required Resources
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-0 ml-1">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Identify all resources (people, budget, tools, time) needed to achieve your goal.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <p className="text-sm text-muted-foreground">
                What resources do you need to achieve this goal?
              </p>
            </div>
            {!readOnly && (
              <Button onClick={() => setShowResourceForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            )}
          </div>

          {showResourceForm && !readOnly && (
            <Card>
              <CardHeader>
                <CardTitle>Add Resource</CardTitle>
              </CardHeader>
              <CardContent>
                <ResourceForm
                  onAdd={(resource) => {
                    handleChange('requiredResources', [...data.requiredResources, resource]);
                    setShowResourceForm(false);
                  }}
                  onCancel={() => setShowResourceForm(false)}
                />
              </CardContent>
            </Card>
          )}

          {data.requiredResources.length > 0 ? (
            <div className="space-y-3">
              {data.requiredResources.map((resource, index) => {
                const categoryInfo = RESOURCE_CATEGORIES[resource.type as keyof typeof RESOURCE_CATEGORIES];
                const IconComponent = categoryInfo?.icon || User;

                return (
                  <Card key={resource.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={cn('p-2 rounded-lg bg-secondary')}>
                            <IconComponent className={cn('h-4 w-4', categoryInfo?.color)} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{resource.name}</h4>
                              <Badge
                                variant={resource.isAvailable ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {resource.isAvailable ? 'Available' : 'Not Available'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {categoryInfo?.name || resource.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Quantity: {resource.quantity} {resource.unit}
                              {resource.acquisitionCost && ` • Cost: $${resource.acquisitionCost}`}
                              {resource.acquisitionTime && ` • Time: ${resource.acquisitionTime} days`}
                            </div>
                            {resource.description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {resource.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newResources = data.requiredResources.filter((_, i) => i !== index);
                              handleChange('requiredResources', newResources);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No resources identified yet</p>
              <p className="text-sm">Add resources needed to achieve your goal</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Required Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Required Skills</Label>
              <p className="text-sm text-muted-foreground">
                What skills or competencies are needed for success?
              </p>
            </div>
            {!readOnly && (
              <Button onClick={() => setShowSkillForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            )}
          </div>

          {showSkillForm && !readOnly && (
            <Card>
              <CardHeader>
                <CardTitle>Add Required Skill</CardTitle>
              </CardHeader>
              <CardContent>
                <SkillForm
                  onAdd={(skill) => {
                    handleChange('requiredSkills', [...data.requiredSkills, skill]);
                    setShowSkillForm(false);
                  }}
                  onCancel={() => setShowSkillForm(false)}
                />
              </CardContent>
            </Card>
          )}

          {data.requiredSkills.length > 0 ? (
            <div className="space-y-3">
              {data.requiredSkills.map((skill, index) => {
                const skillGap = skill.requiredLevel - skill.currentLevel;
                const progressPercentage = (skill.currentLevel / skill.requiredLevel) * 100;

                return (
                  <Card key={skill.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{skill.name}</h4>
                            {skill.isCritical && (
                              <Badge variant="destructive" className="text-xs">
                                Critical
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-muted-foreground">Required Level:</span>
                              <div className="font-medium">{skill.requiredLevel}/10</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Current Level:</span>
                              <div className="font-medium">{skill.currentLevel}/10</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Skill Progress</span>
                              <span>{Math.round(progressPercentage)}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>

                          {skillGap > 0 && (
                            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded text-xs text-yellow-700 dark:text-yellow-300">
                              Gap: {skillGap} point{skillGap > 1 ? 's' : ''}
                              {skill.timeToAcquire && ` • Est. ${skill.timeToAcquire} weeks to develop`}
                            </div>
                          )}

                          {skill.developmentPlan && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <strong>Development Plan:</strong> {skill.developmentPlan}
                            </div>
                          )}
                        </div>
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newSkills = data.requiredSkills.filter((_, i) => i !== index);
                              handleChange('requiredSkills', newSkills);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No skills identified yet</p>
              <p className="text-sm">Add skills needed for success</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Constraints and Risks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Constraints & Risks</Label>
              <p className="text-sm text-muted-foreground">
                What obstacles or limitations might prevent success?
              </p>
            </div>
            {!readOnly && (
              <Button onClick={() => setShowConstraintForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Constraint
              </Button>
            )}
          </div>

          {showConstraintForm && !readOnly && (
            <Card>
              <CardHeader>
                <CardTitle>Add Constraint</CardTitle>
              </CardHeader>
              <CardContent>
                <ConstraintForm
                  onAdd={(constraint) => {
                    handleChange('constraints', [...data.constraints, constraint]);
                    setShowConstraintForm(false);
                  }}
                  onCancel={() => setShowConstraintForm(false)}
                />
              </CardContent>
            </Card>
          )}

          {data.constraints.length > 0 ? (
            <div className="space-y-3">
              {data.constraints.map((constraint, index) => {
                const typeInfo = CONSTRAINT_TYPES[constraint.type as keyof typeof CONSTRAINT_TYPES];
                const IconComponent = typeInfo?.icon || AlertTriangle;
                const riskScore = constraint.impactLevel * constraint.probability;

                return (
                  <Card key={constraint.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline" className={typeInfo?.color}>
                              {typeInfo?.name}
                            </Badge>
                            <Badge
                              variant={riskScore >= 7 ? 'destructive' : riskScore >= 4 ? 'secondary' : 'default'}
                              className="text-xs"
                            >
                              Risk: {riskScore.toFixed(1)}/10
                            </Badge>
                          </div>

                          <p className="text-sm mb-2">{constraint.description}</p>

                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-2">
                            <div>Impact: {constraint.impactLevel}/10</div>
                            <div>Probability: {(constraint.probability * 100).toFixed(0)}%</div>
                          </div>

                          {constraint.mitigationStrategy && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/30 rounded text-xs">
                              <strong>Mitigation:</strong> {constraint.mitigationStrategy}
                            </div>
                          )}

                          {constraint.contingencyPlan && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded text-xs">
                              <strong>Contingency:</strong> {constraint.contingencyPlan}
                            </div>
                          )}
                        </div>
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newConstraints = data.constraints.filter((_, i) => i !== index);
                              handleChange('constraints', newConstraints);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No constraints identified yet</p>
              <p className="text-sm">Consider potential obstacles or limitations</p>
            </div>
          )}
        </div>

        {/* Risk Assessment */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Overall Risk Assessment *
          </Label>
          <p className="text-sm text-muted-foreground">
            Provide a summary of the overall risk and feasibility assessment.
          </p>

          <Textarea
            value={data.riskAssessment}
            onChange={(e) => handleChange('riskAssessment', e.target.value)}
            placeholder="Summarize the overall risk level, key challenges, and your confidence in achieving this goal..."
            rows={4}
            disabled={readOnly}
            className={cn(
              errors.riskAssessment && 'border-destructive focus:ring-destructive'
            )}
          />

          {errors.riskAssessment && (
            <div className="text-sm text-destructive">
              {errors.riskAssessment[0]}
            </div>
          )}
        </div>

        {/* Mitigation Strategies */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Mitigation Strategies</Label>
          <p className="text-sm text-muted-foreground">
            List general strategies to increase the likelihood of success.
          </p>

          {data.mitigationStrategies.map((strategy, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={strategy}
                onChange={(e) => {
                  const newStrategies = [...data.mitigationStrategies];
                  newStrategies[index] = e.target.value;
                  handleChange('mitigationStrategies', newStrategies);
                }}
                placeholder="Enter a mitigation strategy..."
                disabled={readOnly}
              />
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newStrategies = data.mitigationStrategies.filter((_, i) => i !== index);
                    handleChange('mitigationStrategies', newStrategies);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {!readOnly && (
            <Button
              variant="outline"
              onClick={() => {
                handleChange('mitigationStrategies', [...data.mitigationStrategies, '']);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Strategy
            </Button>
          )}
        </div>

        {/* Warnings and Suggestions */}
        {(warnings?.length || suggestions?.length) && (
          <div className="space-y-4">
            {warnings && warnings.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Suggestions for improvement:
                </div>
                {warnings.map((warning, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm text-amber-700 dark:text-amber-300">
                    <div className="w-1 h-1 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {suggestions && suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Additional suggestions:
                </div>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm text-blue-700 dark:text-blue-300">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AchievableStep;