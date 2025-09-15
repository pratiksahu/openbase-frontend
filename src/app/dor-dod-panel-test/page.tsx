'use client';

import { useState } from 'react';

import { DorDodPanel } from '@/components/DorDodPanel';
import { defaultTemplates } from '@/components/DorDodPanel/defaultTemplates';
import type { DorDodState, ValidationResult, Criterion } from '@/components/DorDodPanel/DorDodPanel.types';

export default function DorDodPanelTestPage() {
  const [state, setState] = useState<DorDodState | undefined>();
  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>();

  const handleStateChange = (newState: DorDodState) => {
    setState(newState);
  };

  const handleValidationChange = (result: ValidationResult) => {
    setValidationResult(result);
  };

  const handleApprovalRequest = (_criteria: Criterion[]) => {
    // This function can be used to handle approval requests
    // Currently empty for testing purposes
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">DoR/DoD Panel Test</h1>
        <p className="text-muted-foreground">
          Test page for the Definition of Ready and Definition of Done panel component.
        </p>
      </div>

      <div className="mb-6">
        <DorDodPanel
          templates={defaultTemplates}
          onStateChange={handleStateChange}
          onValidationChange={handleValidationChange}
          onApprovalRequest={handleApprovalRequest}
          showProgressIndicators={true}
          showTimeTracking={true}
          showApprovalWorkflow={true}
        />
      </div>

      {/* Debug Information */}
      <div className="mt-8 space-y-4">
        <details className="bg-muted p-4 rounded-lg">
          <summary className="font-semibold cursor-pointer">Current State (Debug)</summary>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(state, null, 2)}
          </pre>
        </details>

        <details className="bg-muted p-4 rounded-lg">
          <summary className="font-semibold cursor-pointer">Validation Result (Debug)</summary>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(validationResult, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}