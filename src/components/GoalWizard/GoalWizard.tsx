/**
 * GoalWizard Component
 *
 * Main container component for the multi-step SMART goal creation wizard.
 * Orchestrates the entire wizard flow including navigation, state management,
 * validation, and integration with all step components.
 */

'use client';

import {
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import React, { useEffect, useCallback, lazy, Suspense } from 'react';

import { SmartScoreBadge } from '@/components/SmartScoreBadge/SmartScoreBadge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import {
  GoalWizardProps,
  WizardStep,
  NavigationConfig,
} from './GoalWizard.types';
import { DEFAULT_STEPS } from './GoalWizard.utils';
import { WizardContextProvider, useWizardContext } from './WizardContext';
import { WizardStepper } from './WizardStepper';


// Lazy load step components for better performance
const ContextStep = lazy(() => import('./steps/ContextStep'));
const SpecificStep = lazy(() => import('./steps/SpecificStep'));
const MeasurableStep = lazy(() => import('./steps/MeasurableStep'));
const AchievableStep = lazy(() => import('./steps/AchievableStep'));

// Placeholder components for remaining steps
const RelevantStep = lazy(() =>
  Promise.resolve({
    default: ({ data, onChange }: any) => (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Make it Relevant</h2>
        <p className="text-muted-foreground">
          This step is under construction. Define strategic alignment and business value.
        </p>
        <div className="p-8 text-center bg-muted/50 rounded-lg">
          <div className="text-lg font-medium">Coming Soon</div>
          <div className="text-sm text-muted-foreground mt-2">
            Relevant step component will be implemented next
          </div>
        </div>
      </div>
    )
  })
);

const TimeboundStep = lazy(() =>
  Promise.resolve({
    default: ({ data, onChange }: any) => (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Make it Time-bound</h2>
        <p className="text-muted-foreground">
          This step is under construction. Set deadlines and create timeline.
        </p>
        <div className="p-8 text-center bg-muted/50 rounded-lg">
          <div className="text-lg font-medium">Coming Soon</div>
          <div className="text-sm text-muted-foreground mt-2">
            Time-bound step component will be implemented next
          </div>
        </div>
      </div>
    )
  })
);

const PreviewStep = lazy(() =>
  Promise.resolve({
    default: ({ data, onChange, formData, smartScore }: any) => (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Preview & Finalize</h2>
        <p className="text-muted-foreground">
          Review your complete SMART goal before saving.
        </p>
        <div className="p-8 text-center bg-muted/50 rounded-lg">
          <div className="text-lg font-medium">Coming Soon</div>
          <div className="text-sm text-muted-foreground mt-2">
            Preview step component will be implemented next
          </div>
        </div>
      </div>
    )
  })
);

// =============================================================================
// Step Loading Component
// =============================================================================

const StepLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm text-muted-foreground">Loading step...</span>
    </div>
  </div>
);

// =============================================================================
// Navigation Controls Component
// =============================================================================

interface NavigationControlsProps {
  config: NavigationConfig;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  className?: string;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  config,
  onPrevious,
  onNext,
  onSaveDraft,
  onCancel,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between pt-6 border-t border-border', className)}>
      <div className="flex items-center space-x-2">
        {config.showCancel && (
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            {config.cancelText || 'Cancel'}
          </Button>
        )}
        {config.showSaveDraft && (
          <Button variant="outline" onClick={onSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            {config.saveDraftText || 'Save Draft'}
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {config.showPrevious && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={config.previousDisabled}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {config.previousText || 'Previous'}
          </Button>
        )}
        {config.showNext && (
          <Button
            onClick={onNext}
            disabled={config.nextDisabled}
          >
            {config.nextText || 'Next'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// Step Content Renderer
// =============================================================================

const StepContentRenderer: React.FC = () => {
  const { state, dataManagement } = useWizardContext();
  const { currentStep, formData, validationResults } = state;

  const stepData = dataManagement.getStepData(currentStep);
  const validation = validationResults[currentStep];

  const handleStepChange = useCallback((data: any) => {
    dataManagement.updateStepData(currentStep, data);
  }, [currentStep, dataManagement]);

  const renderStep = () => {
    const commonProps = {
      data: stepData || {},
      onChange: handleStepChange,
      errors: validation?.errors || {},
      warnings: validation?.warnings,
      suggestions: validation?.suggestions,
      readOnly: false,
    };

    switch (currentStep) {
      case WizardStep.CONTEXT:
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <ContextStep {...commonProps} />
          </Suspense>
        );

      case WizardStep.SPECIFIC:
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <SpecificStep {...commonProps} />
          </Suspense>
        );

      case WizardStep.MEASURABLE:
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <MeasurableStep {...commonProps} goalId="wizard-goal" />
          </Suspense>
        );

      case WizardStep.ACHIEVABLE:
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <AchievableStep {...commonProps} />
          </Suspense>
        );

      case WizardStep.RELEVANT:
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <RelevantStep {...commonProps} />
          </Suspense>
        );

      case WizardStep.TIMEBOUND:
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <TimeboundStep {...commonProps} />
          </Suspense>
        );

      case WizardStep.PREVIEW:
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <PreviewStep
              {...commonProps}
              formData={formData}
              smartScore={state.smartScore}
            />
          </Suspense>
        );

      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Unknown Step</h3>
            <p className="text-sm text-muted-foreground">
              The requested step could not be found.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[600px]">
      {renderStep()}
    </div>
  );
};

// =============================================================================
// Main Wizard Content Component
// =============================================================================

const WizardContent: React.FC<Omit<GoalWizardProps, 'initialGoal'>> = ({
  onSave,
  onCancel,
  onSaveDraft,
  onStepChange,
  className,
  showProgress = true,
}) => {
  const { state, navigation, draftManagement, export: exportFunctions } = useWizardContext();
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [isDraftSaving, setIsDraftSaving] = React.useState(false);

  // Handle step changes
  useEffect(() => {
    onStepChange?.(state.currentStep);
  }, [state.currentStep, onStepChange]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            if (navigation.canGoNext()) {
              navigation.goNext();
            }
            break;
          case 's':
            e.preventDefault();
            handleSaveDraft();
            break;
          case 'Escape':
            e.preventDefault();
            setShowCancelDialog(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigation]);

  const handleSaveDraft = useCallback(async () => {
    if (isDraftSaving) return;

    setIsDraftSaving(true);
    try {
      const draftId = draftManagement.saveDraft();
      onSaveDraft?.(state.formData);
      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to save draft:', error);
      // You could show an error toast here
    } finally {
      setIsDraftSaving(false);
    }
  }, [isDraftSaving, draftManagement, onSaveDraft, state.formData]);

  const handleFinish = useCallback(async () => {
    try {
      const goal = exportFunctions.generatePreview();
      onSave(goal);
    } catch (error) {
      console.error('Failed to generate goal:', error);
      // You could show an error toast here
    }
  }, [exportFunctions, onSave]);

  const handleCancel = useCallback(() => {
    if (state.hasUnsavedChanges) {
      setShowCancelDialog(true);
    } else {
      onCancel();
    }
  }, [state.hasUnsavedChanges, onCancel]);

  const handleConfirmCancel = useCallback(() => {
    setShowCancelDialog(false);
    onCancel();
  }, [onCancel]);

  // Determine navigation configuration
  const getNavigationConfig = (): NavigationConfig => {
    const isLastStep = state.currentStep === WizardStep.PREVIEW;
    const currentValidation = state.validationResults[state.currentStep];

    return {
      showPrevious: navigation.canGoPrevious(),
      showNext: !isLastStep,
      showSaveDraft: true,
      showCancel: true,
      nextText: isLastStep ? 'Finish' : 'Next',
      nextDisabled: !currentValidation?.isValid,
      previousDisabled: false,
    };
  };

  const navigationConfig = getNavigationConfig();

  return (
    <>
      <div className={cn('space-y-6', className)}>
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create SMART Goal</h1>
              <p className="text-muted-foreground">
                Follow the guided process to create a comprehensive, achievable goal
              </p>
            </div>
            {state.smartScore && (
              <SmartScoreBadge
                goal={exportFunctions.generatePreview()}
                size="lg"
                showTooltip
              />
            )}
          </div>

          {showProgress && (
            <WizardStepper
              currentStep={state.currentStep}
              stepStatus={state.stepStatus}
              onStepClick={navigation.goToStep}
              steps={DEFAULT_STEPS}
              showDescriptions={false}
              showEstimatedTime
            />
          )}
        </div>

        <Separator />

        {/* Main Content */}
        <Card>
          <CardContent className="p-6">
            <StepContentRenderer />

            <NavigationControls
              config={navigationConfig}
              onPrevious={navigation.goPrevious}
              onNext={
                state.currentStep === WizardStep.PREVIEW
                  ? handleFinish
                  : navigation.goNext
              }
              onSaveDraft={handleSaveDraft}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>

        {/* Auto-save indicator */}
        {state.autoSaveEnabled && state.hasUnsavedChanges && (
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Save className="h-3 w-3 mr-1" />
            Auto-saving changes...
          </div>
        )}

        {state.lastSaved && (
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Last saved: {state.lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Goal Creation?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to cancel?
              Your progress will be lost unless you save it as a draft first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                handleSaveDraft();
                setShowCancelDialog(false);
              }}
              disabled={isDraftSaving}
            >
              {isDraftSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft & Exit
            </Button>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// =============================================================================
// Main GoalWizard Component
// =============================================================================

export const GoalWizard: React.FC<GoalWizardProps> = ({
  initialGoal,
  autoSaveEnabled = true,
  autoSaveInterval = 30000,
  ...props
}) => {
  return (
    <WizardContextProvider
      autoSaveInterval={autoSaveInterval}
      onAutoSave={props.onSaveDraft}
    >
      <WizardContent {...props} />
    </WizardContextProvider>
  );
};

export default GoalWizard;