/**
 * SpecificStep Component
 *
 * This component provides the second step of the GoalWizard where users define
 * clear and specific objectives, refining their goal statement with detailed
 * success criteria and scope boundaries.
 */

'use client';

import {
  Plus,
  X,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  HelpCircle,
  Tag,
} from 'lucide-react';
import React, { useState } from 'react';

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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { SpecificStepProps, SpecificStepData } from '../GoalWizard.types';

// =============================================================================
// Specificity Checklist Data
// =============================================================================

const SPECIFICITY_CHECKLIST = [
  {
    question: 'What will be accomplished?',
    description: 'Clear outcome or deliverable',
    example: 'Reduce customer support response time',
  },
  {
    question: 'Who is involved?',
    description: 'Key people or teams responsible',
    example: 'Customer support team and engineering team',
  },
  {
    question: 'Where will it happen?',
    description: 'Location or context',
    example: 'Across all support channels (email, chat, phone)',
  },
  {
    question: 'Which resources are needed?',
    description: 'Key resources required',
    example: 'New ticketing system, training materials, analytics tools',
  },
  {
    question: 'Why is this important?',
    description: 'The reason or motivation',
    example: 'To improve customer satisfaction and reduce churn',
  },
];

// =============================================================================
// Common Tags for Different Goal Types
// =============================================================================

const COMMON_TAGS = {
  business: [
    'revenue',
    'growth',
    'efficiency',
    'customer',
    'market',
    'sales',
    'profit',
  ],
  project: [
    'milestone',
    'delivery',
    'quality',
    'timeline',
    'scope',
    'budget',
    'stakeholder',
  ],
  personal: [
    'skill',
    'learning',
    'health',
    'career',
    'productivity',
    'habit',
    'development',
  ],
  team: [
    'collaboration',
    'communication',
    'process',
    'culture',
    'performance',
    'engagement',
  ],
  technical: [
    'development',
    'deployment',
    'testing',
    'documentation',
    'performance',
    'security',
  ],
};

// =============================================================================
// List Input Component
// =============================================================================

interface ListInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  label: string;
  disabled?: boolean;
  maxItems?: number;
}

const ListInput: React.FC<ListInputProps> = ({
  items,
  onChange,
  placeholder,
  label,
  disabled = false,
  maxItems,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    if (inputValue.trim() && !items.includes(inputValue.trim())) {
      if (maxItems && items.length >= maxItems) {
        return;
      }
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={addItem}
          disabled={
            !inputValue.trim() ||
            disabled ||
            Boolean(maxItems && items.length >= maxItems)
          }
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {maxItems && (
        <div className="text-muted-foreground text-xs">
          {items.length}/{maxItems} {label.toLowerCase()}
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-secondary flex items-center justify-between rounded-md p-2"
            >
              <span className="text-sm">{item}</span>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-destructive/20 h-auto p-1"
                  onClick={() => removeItem(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Tag Input Component
// =============================================================================

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  suggestions = [],
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    tag =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(tag)
  );

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      onChange([...tags, tag.trim().toLowerCase()]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            placeholder="Add tags (e.g., revenue, customer, project)"
            disabled={disabled}
          />
          <Button
            type="button"
            onClick={() => addTag(inputValue)}
            disabled={!inputValue.trim() || disabled}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="bg-popover absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border shadow-md">
            {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="hover:bg-accent focus:bg-accent w-full px-3 py-2 text-left text-sm focus:outline-none"
                onClick={() => addTag(suggestion)}
              >
                <Tag className="mr-2 inline h-3 w-3" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {tag}
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 hover:bg-transparent"
                  onClick={() => removeTag(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Suggested Tags */}
      {!showSuggestions && suggestions.length > 0 && tags.length < 5 && (
        <div className="space-y-2">
          <div className="text-muted-foreground text-xs">Suggested tags:</div>
          <div className="flex flex-wrap gap-1">
            {suggestions
              .slice(0, 6)
              .filter(tag => !tags.includes(tag))
              .map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 py-0 text-xs"
                  onClick={() => addTag(suggestion)}
                  disabled={disabled}
                >
                  {suggestion}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Specificity Checklist Component
// =============================================================================

interface ChecklistProps {
  data: SpecificStepData;
}

const SpecificityChecklistComponent: React.FC<ChecklistProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getChecklistStatus = () => {
    let completed = 0;

    // What will be accomplished? (title + objective)
    if (data.title?.trim() && data.specificObjective?.trim()) completed++;

    // Who is involved? (check if description mentions people/teams)
    if (
      data.description?.toLowerCase().includes('team') ||
      data.description?.toLowerCase().includes('we') ||
      data.description?.toLowerCase().includes('staff') ||
      data.description?.toLowerCase().includes('department')
    )
      completed++;

    // Where will it happen? (check if description has context)
    if (data.description?.length > 50) completed++;

    // Which resources are needed? (implicit in objective/description)
    if (data.specificObjective?.length > 30) completed++;

    // Why is this important? (success criteria or description)
    if (data.successCriteria?.length > 0) completed++;

    return { completed, total: SPECIFICITY_CHECKLIST.length };
  };

  const { completed, total } = getChecklistStatus();
  const percentage = Math.round((completed / total) * 100);

  return (
    <Card className="border-dashed">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    completed === total
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  )}
                >
                  {completed === total ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Target className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-base">
                    Specificity Checklist
                  </CardTitle>
                  <CardDescription>
                    {completed}/{total} questions addressed ({percentage}%)
                  </CardDescription>
                </div>
              </div>
              <div
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium',
                  completed === total
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                    : completed >= total / 2
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                )}
              >
                {completed === total
                  ? 'Complete'
                  : completed >= total / 2
                    ? 'Good'
                    : 'Needs Work'}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {SPECIFICITY_CHECKLIST.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-sm font-medium">{item.question}</div>
                  <div className="text-muted-foreground text-xs">
                    {item.description}
                  </div>
                  <div className="text-xs text-blue-600 italic dark:text-blue-400">
                    Example: {item.example}
                  </div>
                  {index < SPECIFICITY_CHECKLIST.length - 1 && (
                    <div className="border-border/50 border-b pt-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// =============================================================================
// Main SpecificStep Component
// =============================================================================

export const SpecificStep: React.FC<SpecificStepProps> = ({
  data,
  onChange,
  errors,
  readOnly = false,
  className,
  warnings,
  suggestions,
  onRequestSuggestion: _onRequestSuggestion,
}) => {
  const handleChange = (field: keyof SpecificStepData, value: any) => {
    onChange({ [field]: value });
  };

  const getTagSuggestions = (): string[] => {
    const title = data.title?.toLowerCase() || '';
    const description = data.description?.toLowerCase() || '';
    const objective = data.specificObjective?.toLowerCase() || '';

    const allText = `${title} ${description} ${objective}`;

    const suggestions: string[] = [];

    // Add suggestions based on content
    if (
      allText.includes('revenue') ||
      allText.includes('sales') ||
      allText.includes('business')
    ) {
      suggestions.push(...COMMON_TAGS.business);
    }
    if (
      allText.includes('project') ||
      allText.includes('delivery') ||
      allText.includes('milestone')
    ) {
      suggestions.push(...COMMON_TAGS.project);
    }
    if (
      allText.includes('team') ||
      allText.includes('collaboration') ||
      allText.includes('culture')
    ) {
      suggestions.push(...COMMON_TAGS.team);
    }
    if (
      allText.includes('learn') ||
      allText.includes('skill') ||
      allText.includes('personal')
    ) {
      suggestions.push(...COMMON_TAGS.personal);
    }
    if (
      allText.includes('develop') ||
      allText.includes('code') ||
      allText.includes('system')
    ) {
      suggestions.push(...COMMON_TAGS.technical);
    }

    // Remove duplicates and exclude already selected tags
    return [...new Set(suggestions)].filter(tag => !data.tags.includes(tag));
  };

  return (
    <TooltipProvider>
      <div className={cn('space-y-8', className)}>
        {/* Step Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Make it Specific
          </h2>
          <p className="text-muted-foreground">
            Define clear, unambiguous objectives that leave no room for
            interpretation.
          </p>
        </div>

        {/* Goal Title */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Goal Title *
            </Label>
            <p className="text-muted-foreground text-sm">
              A clear, concise title that captures the essence of your goal.
            </p>
          </div>

          <Input
            id="title"
            value={data.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="Enter a clear, specific title (e.g., 'Reduce customer support response time to under 2 hours')"
            disabled={readOnly}
            className={cn(
              'text-lg font-medium',
              errors.title && 'border-destructive focus:ring-destructive'
            )}
          />

          {errors.title && (
            <div className="text-destructive text-sm">{errors.title[0]}</div>
          )}
        </div>

        {/* Goal Description */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Detailed Description *
            </Label>
            <p className="text-muted-foreground text-sm">
              Provide comprehensive details about your goal, including context
              and background.
            </p>
          </div>

          <Textarea
            id="description"
            value={data.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Provide a detailed description of your goal... Include who is involved, what will be different, and any relevant context."
            rows={5}
            disabled={readOnly}
            className={cn(
              errors.description && 'border-destructive focus:ring-destructive'
            )}
          />

          {errors.description && (
            <div className="text-destructive text-sm">
              {errors.description[0]}
            </div>
          )}
        </div>

        {/* Specific Objective */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="specificObjective"
              className="text-base font-semibold"
            >
              Specific Objective Statement *
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-1 h-auto p-0">
                    <HelpCircle className="text-muted-foreground h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    A single, clear sentence that defines exactly what you want
                    to accomplish. This should answer &quot;what exactly will be
                    achieved?&quot;
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <p className="text-muted-foreground text-sm">
              One clear sentence that defines exactly what you want to
              accomplish.
            </p>
          </div>

          <Textarea
            id="specificObjective"
            value={data.specificObjective}
            onChange={e => handleChange('specificObjective', e.target.value)}
            placeholder="Write a single, clear objective statement... (e.g., 'Achieve an average customer support response time of less than 2 hours across all channels by the end of Q2.')"
            rows={3}
            disabled={readOnly}
            className={cn(
              errors.specificObjective &&
                'border-destructive focus:ring-destructive'
            )}
          />

          {errors.specificObjective && (
            <div className="text-destructive text-sm">
              {errors.specificObjective[0]}
            </div>
          )}
        </div>

        {/* Success Criteria */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Success Criteria *
            </Label>
            <p className="text-muted-foreground text-sm">
              Define specific conditions that must be met to consider this goal
              successful.
            </p>
          </div>

          <ListInput
            items={data.successCriteria}
            onChange={criteria => handleChange('successCriteria', criteria)}
            placeholder="Add a success criterion (e.g., 'Average response time < 2 hours')"
            label="Success Criteria"
            disabled={readOnly}
            maxItems={8}
          />

          {errors.successCriteria && (
            <div className="text-destructive text-sm">
              {errors.successCriteria[0]}
            </div>
          )}

          {data.successCriteria.length === 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
              <div className="flex items-start space-x-2">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <div className="mb-1 font-medium">
                    Tips for good success criteria:
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-xs">
                    <li>Be specific and measurable</li>
                    <li>Include timeframes when relevant</li>
                    <li>Define both quantitative and qualitative measures</li>
                    <li>Consider different stakeholder perspectives</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Advanced Options */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Advanced Options (Optional)
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-6 space-y-6">
            {/* Scope Boundaries */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="scopeBoundaries"
                  className="text-base font-semibold"
                >
                  Scope Boundaries
                </Label>
                <p className="text-muted-foreground text-sm">
                  Define what is included and excluded from this goal&apos;s
                  scope.
                </p>
              </div>

              <Textarea
                id="scopeBoundaries"
                value={data.scopeBoundaries || ''}
                onChange={e => handleChange('scopeBoundaries', e.target.value)}
                placeholder="Define the boundaries of your goal... (e.g., 'Includes email and chat support. Excludes phone support and enterprise accounts.')"
                rows={3}
                disabled={readOnly}
              />
            </div>

            {/* Non-goals */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Non-goals (What this goal does NOT include)
                </Label>
                <p className="text-muted-foreground text-sm">
                  Explicitly state what is outside the scope of this goal.
                </p>
              </div>

              <ListInput
                items={data.nonGoals || []}
                onChange={nonGoals => handleChange('nonGoals', nonGoals)}
                placeholder="Add something this goal does NOT include"
                label="Non-goals"
                disabled={readOnly}
                maxItems={6}
              />
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Tags</Label>
                <p className="text-muted-foreground text-sm">
                  Add tags to help categorize and find this goal later.
                </p>
              </div>

              <TagInput
                tags={data.tags}
                onChange={tags => handleChange('tags', tags)}
                suggestions={getTagSuggestions()}
                disabled={readOnly}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Specificity Checklist */}
        <SpecificityChecklistComponent data={data} />

        {/* Warnings and Suggestions */}
        {(warnings?.length || suggestions?.length) && (
          <div className="space-y-4">
            {warnings && warnings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  Suggestions for improvement:
                </div>
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 text-sm text-amber-700 dark:text-amber-300"
                  >
                    <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-amber-500" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {suggestions && suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <Lightbulb className="h-4 w-4" />
                  Additional suggestions:
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 text-sm text-blue-700 dark:text-blue-300"
                  >
                    <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-blue-500" />
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

export default SpecificStep;
