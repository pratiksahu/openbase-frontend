/**
 * WizardStepper Component
 *
 * This component provides a horizontal stepper navigation UI for the GoalWizard,
 * showing all SMART steps with status indicators, progress bar, and navigation controls.
 */

'use client';

import React from 'react';
import {
  FileText,
  Target,
  BarChart3,
  CheckCircle2,
  Users,
  Calendar,
  Eye,
  Check,
  AlertCircle,
  Clock,
  Circle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import {
  WizardStepperProps,
  WizardStep,
  StepStatus,
  StepConfig,
} from './GoalWizard.types';

// =============================================================================
// Icon Mapping
// =============================================================================

const STEP_ICONS = {
  FileText,
  Target,
  BarChart3,
  CheckCircle2,
  Users,
  Calendar,
  Eye,
} as const;

// =============================================================================
// Status Icon Component
// =============================================================================

interface StatusIconProps {
  status: StepStatus;
  isActive: boolean;
  className?: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, isActive, className }) => {
  const iconClass = cn(
    'h-4 w-4',
    className
  );

  switch (status) {
    case StepStatus.COMPLETED:
      return <Check className={iconClass} />;
    case StepStatus.ERROR:
      return <AlertCircle className={iconClass} />;
    case StepStatus.IN_PROGRESS:
      return isActive ? <Clock className={iconClass} /> : <Circle className={iconClass} />;
    case StepStatus.NOT_STARTED:
    default:
      return <Circle className={iconClass} />;
  }
};

// =============================================================================
// Step Item Component
// =============================================================================

interface StepItemProps {
  config: StepConfig;
  status: StepStatus;
  isActive: boolean;
  isClickable: boolean;
  showDescriptions: boolean;
  showEstimatedTime: boolean;
  onClick: () => void;
}

const StepItem: React.FC<StepItemProps> = ({
  config,
  status,
  isActive,
  isClickable,
  showDescriptions,
  showEstimatedTime,
  onClick,
}) => {
  const IconComponent = STEP_ICONS[config.icon as keyof typeof STEP_ICONS] || Circle;

  // Determine colors based on status and active state
  const getStepColors = () => {
    if (isActive) {
      return {
        border: 'border-primary',
        background: 'bg-primary',
        text: 'text-primary-foreground',
        label: 'text-primary',
      };
    }

    switch (status) {
      case StepStatus.COMPLETED:
        return {
          border: 'border-green-500',
          background: 'bg-green-500',
          text: 'text-white',
          label: 'text-green-700 dark:text-green-300',
        };
      case StepStatus.ERROR:
        return {
          border: 'border-red-500',
          background: 'bg-red-500',
          text: 'text-white',
          label: 'text-red-700 dark:text-red-300',
        };
      case StepStatus.IN_PROGRESS:
        return {
          border: 'border-blue-500',
          background: 'bg-blue-500',
          text: 'text-white',
          label: 'text-blue-700 dark:text-blue-300',
        };
      case StepStatus.NOT_STARTED:
      default:
        return {
          border: 'border-muted-foreground/30',
          background: 'bg-muted',
          text: 'text-muted-foreground',
          label: 'text-muted-foreground',
        };
    }
  };

  const colors = getStepColors();

  const stepContent = (
    <div className="flex flex-col items-center space-y-2">
      {/* Step Circle */}
      <div
        className={cn(
          'relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200',
          colors.border,
          colors.background,
          isClickable && 'hover:scale-105 cursor-pointer',
          !isClickable && 'cursor-not-allowed opacity-60'
        )}
      >
        {/* Main Icon */}
        <IconComponent className={cn('h-5 w-5', colors.text)} />

        {/* Status Indicator */}
        <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border border-border">
          <StatusIcon status={status} isActive={isActive} className="h-2.5 w-2.5" />
        </div>
      </div>

      {/* Step Label */}
      <div className="text-center">
        <div className={cn('font-medium text-sm', colors.label)}>
          {config.title}
        </div>
        {showDescriptions && (
          <div className="text-xs text-muted-foreground mt-1 max-w-24 leading-tight">
            {config.description}
          </div>
        )}
        {showEstimatedTime && config.estimatedTime && (
          <div className="text-xs text-muted-foreground mt-1">
            {config.estimatedTime}min
          </div>
        )}
      </div>
    </div>
  );

  if (!isClickable) {
    return stepContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={onClick}
          >
            {stepContent}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-sm">
          <div className="space-y-1">
            <div className="font-medium">{config.title}</div>
            <div className="text-sm text-muted-foreground">{config.description}</div>
            {config.helpContent && (
              <div className="text-xs text-muted-foreground pt-1 border-t border-border">
                {config.helpContent}
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              {config.estimatedTime && (
                <span>Est. {config.estimatedTime} minutes</span>
              )}
              <span className="capitalize">{status.replace('_', ' ')}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// =============================================================================
// Connection Line Component
// =============================================================================

interface ConnectionLineProps {
  isCompleted: boolean;
  isActive: boolean;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ isCompleted, isActive }) => {
  return (
    <div className="flex-1 flex items-center px-2">
      <div
        className={cn(
          'h-0.5 w-full rounded transition-all duration-300',
          isCompleted
            ? 'bg-green-500'
            : isActive
              ? 'bg-gradient-to-r from-primary to-muted'
              : 'bg-muted'
        )}
      />
    </div>
  );
};

// =============================================================================
// Main WizardStepper Component
// =============================================================================

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  stepStatus,
  onStepClick,
  steps,
  disabled = false,
  className,
  showDescriptions = true,
  showEstimatedTime = false,
}) => {
  // Calculate progress
  const completedSteps = steps.filter(
    step => stepStatus[step.step] === StepStatus.COMPLETED
  ).length;
  const progressPercentage = Math.round((completedSteps / steps.length) * 100);

  // Determine clickability for each step
  const canNavigateToStep = (targetStep: WizardStep): boolean => {
    if (disabled) return false;

    const targetIndex = steps.findIndex(step => step.step === targetStep);
    if (targetIndex === -1) return false;

    // Can always click current step or completed steps
    if (targetStep === currentStep || stepStatus[targetStep] === StepStatus.COMPLETED) {
      return true;
    }

    // Can click next step if current is completed
    const currentIndex = steps.findIndex(step => step.step === currentStep);
    if (targetIndex === currentIndex + 1 && stepStatus[currentStep] === StepStatus.COMPLETED) {
      return true;
    }

    // Can click any previous step
    return targetIndex < currentIndex;
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progressPercentage}%</span>
        </div>
        <Progress
          value={progressPercentage}
          className="h-2"
        />
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Mobile/Compact View */}
        <div className="block sm:hidden">
          <div className="space-y-2">
            {steps.map((stepConfig, index) => {
              const isActive = stepConfig.step === currentStep;
              const status = stepStatus[stepConfig.step];
              const isClickable = canNavigateToStep(stepConfig.step);

              return (
                <div
                  key={stepConfig.step}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg border',
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:bg-accent/50'
                  )}
                >
                  <div className="flex-shrink-0">
                    <StepItem
                      config={stepConfig}
                      status={status}
                      isActive={isActive}
                      isClickable={isClickable}
                      showDescriptions={false}
                      showEstimatedTime={showEstimatedTime}
                      onClick={() => onStepClick(stepConfig.step)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-medium text-sm',
                      isActive ? 'text-primary' : 'text-foreground'
                    )}>
                      {stepConfig.title}
                    </div>
                    {showDescriptions && (
                      <div className="text-sm text-muted-foreground">
                        {stepConfig.description}
                      </div>
                    )}
                    {showEstimatedTime && stepConfig.estimatedTime && (
                      <div className="text-xs text-muted-foreground">
                        Est. {stepConfig.estimatedTime} minutes
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <StatusIcon
                      status={status}
                      isActive={isActive}
                      className="text-muted-foreground"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop/Wide View */}
        <div className="hidden sm:flex items-center justify-between">
          {steps.map((stepConfig, index) => {
            const isActive = stepConfig.step === currentStep;
            const status = stepStatus[stepConfig.step];
            const isClickable = canNavigateToStep(stepConfig.step);
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={stepConfig.step}>
                {/* Step */}
                <div className="flex-shrink-0">
                  <StepItem
                    config={stepConfig}
                    status={status}
                    isActive={isActive}
                    isClickable={isClickable}
                    showDescriptions={showDescriptions}
                    showEstimatedTime={showEstimatedTime}
                    onClick={() => onStepClick(stepConfig.step)}
                  />
                </div>

                {/* Connection Line */}
                {!isLast && (
                  <ConnectionLine
                    isCompleted={status === StepStatus.COMPLETED}
                    isActive={isActive}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Summary */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          Step {steps.findIndex(step => step.step === currentStep) + 1} of {steps.length}
        </div>
        <div>
          {completedSteps} completed, {steps.length - completedSteps} remaining
        </div>
      </div>
    </div>
  );
};

export default WizardStepper;