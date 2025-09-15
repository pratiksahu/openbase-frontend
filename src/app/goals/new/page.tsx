/**
 * New Goal Page
 *
 * Page for creating a new SMART goal using the GoalWizard component.
 * Includes navigation handling, draft recovery, and success redirection.
 */

'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

import { GoalWizard } from '@/components/GoalWizard/GoalWizard';
import type {
  WizardStep,
  WizardFormData,
} from '@/components/GoalWizard/GoalWizard.types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { SmartGoalCreate } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

interface NewGoalPageProps {
  searchParams?: {
    template?: string;
    draft?: string;
    step?: string;
  };
}

// =============================================================================
// Page Metadata (handled by parent layout)
// =============================================================================

// =============================================================================
// Main New Goal Page Component
// =============================================================================

export default function NewGoalPage({
  searchParams: _searchParams,
}: NewGoalPageProps) {
  const router = useRouter();

  // Handle successful goal creation
  const handleSave = useCallback(
    async (goalData: SmartGoalCreate | any) => {
      try {
        // TODO: Replace with actual API call
        console.warn('Saving goal:', goalData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate a temporary ID for navigation (in real app, this would come from API)
        const tempId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        toast({
          title: 'Goal Created Successfully!',
          description: `"${goalData.title}" has been created and is ready to track.`,
        });

        // Redirect to the goal detail page
        router.push(`/goals/${tempId}`);
      } catch (error) {
        console.error('Failed to save goal:', error);
        toast({
          title: 'Error Creating Goal',
          description:
            'There was a problem creating your goal. Please try again.',
          variant: 'destructive',
        });
      }
    },
    [router]
  );

  // Handle draft saving
  const handleSaveDraft = useCallback(
    async (goalData: Partial<WizardFormData>) => {
      try {
        // TODO: Replace with actual API call to save draft
        console.warn('Saving draft:', goalData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        toast({
          title: 'Draft Saved',
          description: 'Your progress has been saved as a draft.',
        });
      } catch (error) {
        console.error('Failed to save draft:', error);
        toast({
          title: 'Error Saving Draft',
          description: 'There was a problem saving your draft.',
          variant: 'destructive',
        });
      }
    },
    []
  );

  // Handle wizard cancellation
  const handleCancel = useCallback(() => {
    router.push('/goals');
  }, [router]);

  // Handle step changes (for analytics/tracking)
  const handleStepChange = useCallback((step: WizardStep) => {
    // TODO: Track step changes for analytics
    console.warn('Step changed to:', step);
  }, []);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/goals" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Link>
        </Button>

        {/* Page Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Create a New Goal
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Follow our guided SMART goal creation process to build goals that
            are Specific, Measurable, Achievable, Relevant, and Time-bound.
          </p>
        </div>
      </div>

      {/* Goal Wizard */}
      <div className="bg-background">
        <GoalWizard
          onSave={handleSave}
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
          onStepChange={handleStepChange}
          autoSaveEnabled={true}
          autoSaveInterval={30000} // Auto-save every 30 seconds
          showProgress={true}
          className="mx-auto max-w-4xl"
        />
      </div>

      {/* Help Section */}
      <div className="mt-12 text-center">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-xl font-semibold">Need Help?</h2>
          <p className="text-muted-foreground">
            Our SMART goal wizard will guide you through creating effective
            goals. Each step includes helpful tips and examples to ensure your
            goal is well-defined and achievable.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <Button variant="outline" size="sm" asChild>
              <Link href="/help/smart-goals">
                <span>📖 SMART Goals Guide</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/templates">
                <span>📝 Goal Templates</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/examples">
                <span>💡 Example Goals</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="mb-2 text-lg font-medium">💡 Pro Tip</div>
          <p className="text-muted-foreground text-sm">
            Use the auto-save feature to preserve your progress. Your work is
            automatically saved every 30 seconds.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="mb-2 text-lg font-medium">🎯 Best Practice</div>
          <p className="text-muted-foreground text-sm">
            Be specific about what success looks like. Clear success criteria
            make it easier to track progress.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="mb-2 text-lg font-medium">📊 Measurement</div>
          <p className="text-muted-foreground text-sm">
            Choose metrics that truly reflect progress toward your goal. Vanity
            metrics can be misleading.
          </p>
        </div>
      </div>
    </div>
  );
}
