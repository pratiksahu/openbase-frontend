/**
 * ContextStep Component
 *
 * This component provides the first step of the GoalWizard where users set the
 * background and foundation for their SMART goal including current situation,
 * problem statement, and goal category.
 */

'use client';

import React, { useState } from 'react';
import { Plus, X, TrendingUp, GraduationCap, Flag, Users2, Heart, DollarSign, Palette, HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import {
  ContextStepProps,
  ContextStepData,
  GoalTemplate,
} from '../GoalWizard.types';
import { GoalCategory } from '@/types/smart-goals.types';

// =============================================================================
// Template Cards Data
// =============================================================================

const TEMPLATE_CARDS = [
  {
    id: GoalTemplate.BUSINESS,
    title: 'Business Goal',
    description: 'Revenue targets, market expansion, or operational improvements',
    icon: TrendingUp,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/30 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    examples: ['Increase monthly revenue by 25%', 'Launch 3 new products', 'Expand to 2 new markets'],
  },
  {
    id: GoalTemplate.PERSONAL_DEVELOPMENT,
    title: 'Personal Development',
    description: 'Skills, learning, certifications, or career advancement',
    icon: GraduationCap,
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/30 dark:border-purple-800',
    iconColor: 'text-purple-600 dark:text-purple-400',
    examples: ['Complete AWS certification', 'Learn Spanish fluently', 'Improve public speaking'],
  },
  {
    id: GoalTemplate.PROJECT_MILESTONE,
    title: 'Project Milestone',
    description: 'Specific project deliverables, phases, or completion targets',
    icon: Flag,
    color: 'bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    examples: ['Complete Phase 1 by Q2', 'Deploy MVP version', 'Onboard 10 beta users'],
  },
  {
    id: GoalTemplate.TEAM_OBJECTIVE,
    title: 'Team Objective',
    description: 'Collaborative goals involving multiple team members',
    icon: Users2,
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/30 dark:border-orange-800',
    iconColor: 'text-orange-600 dark:text-orange-400',
    examples: ['Improve team productivity by 30%', 'Reduce sprint overruns', 'Enhance team collaboration'],
  },
  {
    id: GoalTemplate.HEALTH_FITNESS,
    title: 'Health & Fitness',
    description: 'Physical health, fitness, or wellness objectives',
    icon: Heart,
    color: 'bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    examples: ['Run a half marathon', 'Lose 20 pounds', 'Exercise 4x per week'],
  },
  {
    id: GoalTemplate.FINANCIAL,
    title: 'Financial Goal',
    description: 'Savings, investments, debt reduction, or income targets',
    icon: DollarSign,
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    examples: ['Save $10,000 for emergency fund', 'Pay off student loans', 'Increase income by 40%'],
  },
];

const CATEGORY_ICONS = {
  [GoalCategory.PERSONAL]: GraduationCap,
  [GoalCategory.PROFESSIONAL]: TrendingUp,
  [GoalCategory.HEALTH]: Heart,
  [GoalCategory.EDUCATION]: GraduationCap,
  [GoalCategory.FINANCIAL]: DollarSign,
  [GoalCategory.RELATIONSHIP]: Users2,
  [GoalCategory.CREATIVE]: Palette,
  [GoalCategory.OTHER]: HelpCircle,
};

// =============================================================================
// Template Card Component
// =============================================================================

interface TemplateCardProps {
  template: typeof TEMPLATE_CARDS[0];
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  const IconComponent = template.icon;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        template.color,
        isSelected && 'ring-2 ring-primary shadow-md'
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className={cn('p-2 rounded-lg bg-white/50 dark:bg-black/20', template.iconColor)}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">{template.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm mb-3">
          {template.description}
        </CardDescription>
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Examples:
          </div>
          {template.examples.slice(0, 2).map((example, index) => (
            <div key={index} className="text-xs text-muted-foreground">
              • {example}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// Stakeholder Input Component
// =============================================================================

interface StakeholderInputProps {
  stakeholders: string[];
  onChange: (stakeholders: string[]) => void;
  disabled?: boolean;
}

const StakeholderInput: React.FC<StakeholderInputProps> = ({
  stakeholders,
  onChange,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addStakeholder = () => {
    if (inputValue.trim() && !stakeholders.includes(inputValue.trim())) {
      onChange([...stakeholders, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeStakeholder = (index: number) => {
    onChange(stakeholders.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addStakeholder();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add stakeholder (e.g., Management, Team Lead, Customers)"
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={addStakeholder}
          disabled={!inputValue.trim() || disabled}
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {stakeholders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stakeholders.map((stakeholder, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {stakeholder}
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={() => removeStakeholder(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Main ContextStep Component
// =============================================================================

export const ContextStep: React.FC<ContextStepProps> = ({
  data,
  onChange,
  errors,
  readOnly = false,
  className,
  warnings,
  suggestions,
  templates,
  onTemplateSelect,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(
    data.selectedTemplate || null
  );

  const handleTemplateSelect = (template: GoalTemplate) => {
    setSelectedTemplate(template);
    onChange({ selectedTemplate: template });
    onTemplateSelect?.(template);
  };

  const handleChange = (field: keyof ContextStepData, value: any) => {
    onChange({ [field]: value });
  };

  const CategoryIcon = CATEGORY_ICONS[data.category || GoalCategory.PERSONAL];

  return (
    <TooltipProvider>
      <div className={cn('space-y-8', className)}>
        {/* Step Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Set the Context</h2>
          <p className="text-muted-foreground">
            Start by providing background information and selecting a template to guide your goal creation.
          </p>
        </div>

        {/* Template Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Choose a Template (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Select a template to get started faster with pre-filled suggestions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATE_CARDS.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={() => !readOnly && handleTemplateSelect(template.id)}
              />
            ))}
          </div>

          {selectedTemplate && (
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2 text-sm">
                <Badge variant="outline" className="text-primary border-primary">
                  Template Selected
                </Badge>
                <span className="font-medium">
                  {TEMPLATE_CARDS.find(t => t.id === selectedTemplate)?.title}
                </span>
              </div>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(null);
                    handleChange('selectedTemplate', undefined);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Current Situation */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentSituation" className="text-base font-semibold">
              Current Situation *
            </Label>
            <p className="text-sm text-muted-foreground">
              Describe the current state of affairs. What is the starting point?
            </p>
          </div>

          <Textarea
            id="currentSituation"
            value={data.currentSituation}
            onChange={(e) => handleChange('currentSituation', e.target.value)}
            placeholder="Describe your current situation... (e.g., 'Our team is currently handling 50 support tickets per day with an average response time of 8 hours...')"
            rows={4}
            disabled={readOnly}
            className={cn(
              errors.currentSituation && 'border-destructive focus:ring-destructive'
            )}
          />

          {errors.currentSituation && (
            <div className="text-sm text-destructive">
              {errors.currentSituation[0]}
            </div>
          )}
        </div>

        {/* Problem Statement */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="problemStatement" className="text-base font-semibold">
              Problem Statement *
            </Label>
            <p className="text-sm text-muted-foreground">
              What specific problem or opportunity are you addressing?
            </p>
          </div>

          <Textarea
            id="problemStatement"
            value={data.problemStatement}
            onChange={(e) => handleChange('problemStatement', e.target.value)}
            placeholder="What problem are you solving... (e.g., 'Customer satisfaction is declining due to slow response times, leading to increased churn...')"
            rows={4}
            disabled={readOnly}
            className={cn(
              errors.problemStatement && 'border-destructive focus:ring-destructive'
            )}
          />

          {errors.problemStatement && (
            <div className="text-sm text-destructive">
              {errors.problemStatement[0]}
            </div>
          )}
        </div>

        {/* Initial Goal Description */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initialGoalDescription" className="text-base font-semibold">
              Initial Goal Description
            </Label>
            <p className="text-sm text-muted-foreground">
              Provide a rough description of what you want to achieve. We'll refine this in later steps.
            </p>
          </div>

          <Textarea
            id="initialGoalDescription"
            value={data.initialGoalDescription}
            onChange={(e) => handleChange('initialGoalDescription', e.target.value)}
            placeholder="What do you want to achieve... (e.g., 'Improve our customer support response time and overall customer satisfaction...')"
            rows={3}
            disabled={readOnly}
          />
        </div>

        {/* Goal Category */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-semibold">
              Goal Category *
            </Label>
            <p className="text-sm text-muted-foreground">
              Categorize your goal to help with organization and tracking.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <CategoryIcon className="h-5 w-5 text-primary" />
            </div>
            <Select
              value={data.category}
              onValueChange={(value: GoalCategory) => handleChange('category', value)}
              disabled={readOnly}
            >
              <SelectTrigger
                className={cn(
                  'flex-1',
                  errors.category && 'border-destructive focus:ring-destructive'
                )}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GoalCategory).map((category) => {
                  const Icon = CATEGORY_ICONS[category];
                  return (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="capitalize">{category.replace('_', ' ')}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {errors.category && (
            <div className="text-sm text-destructive">
              {errors.category[0]}
            </div>
          )}
        </div>

        {/* Stakeholders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Stakeholders Involved
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-0 ml-1">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Identify people or groups who will be affected by or involved in achieving this goal.
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <p className="text-sm text-muted-foreground">
              Who are the key people or groups involved in this goal?
            </p>
          </div>

          <StakeholderInput
            stakeholders={data.stakeholdersInvolved}
            onChange={(stakeholders) => handleChange('stakeholdersInvolved', stakeholders)}
            disabled={readOnly}
          />
        </div>

        {/* Background Context */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="background" className="text-base font-semibold">
              Additional Background
            </Label>
            <p className="text-sm text-muted-foreground">
              Any additional context, history, or relevant information that might be helpful.
            </p>
          </div>

          <Textarea
            id="background"
            value={data.background || ''}
            onChange={(e) => handleChange('background', e.target.value)}
            placeholder="Additional context... (e.g., 'This goal is part of our Q2 customer experience initiative...')"
            rows={3}
            disabled={readOnly}
          />
        </div>

        {/* Warnings and Suggestions */}
        {(warnings?.length || suggestions?.length) && (
          <div className="space-y-4">
            {warnings && warnings.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
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
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
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

export default ContextStep;