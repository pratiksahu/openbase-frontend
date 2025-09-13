'use client';

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  MoreVertical,
  Plus,
  RotateCcw,
  Settings,
  Upload,
} from 'lucide-react';
import { useState, useCallback, useReducer, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CriteriaEditor } from './CriteriaEditor';
import { CriteriaList } from './CriteriaList';
import { defaultTemplates } from './defaultTemplates';
import type {
  DorDodPanelProps,
  DorDodState,
  DorDodAction,
  Criterion,
} from './DorDodPanel.types';
import {
  calculateProgressMetrics,
  validateCriteria,
  generateCriterionId,
  createAuditLogEntry,
  applyTemplate,
  exportCriteria,
} from './DorDodPanel.utils';

// Reducer for state management
function dorDodReducer(state: DorDodState, action: DorDodAction): DorDodState {
  const now = new Date();

  switch (action.type) {
    case 'ADD_CRITERION': {
      const { section, criterion } = action.payload;
      const newCriterion: Criterion = {
        ...criterion,
        id: generateCriterionId(),
        isCompleted: false,
        createdAt: now,
        updatedAt: now,
      };

      const updatedCriteria = section === 'dor'
        ? [...state.dorCriteria, newCriterion]
        : state.dorCriteria;
      const updatedDodCriteria = section === 'dod'
        ? [...state.dodCriteria, newCriterion]
        : state.dodCriteria;

      const progressMetrics = calculateProgressMetrics([...updatedCriteria, ...updatedDodCriteria]);
      const validationResult = validateCriteria([...updatedCriteria, ...updatedDodCriteria]);

      return {
        ...state,
        dorCriteria: updatedCriteria,
        dodCriteria: updatedDodCriteria,
        progressMetrics,
        validationResult,
        auditLog: [
          createAuditLogEntry('criterion-added', newCriterion.id, undefined, undefined, newCriterion),
          ...state.auditLog,
        ],
        lastUpdated: now,
      };
    }

    case 'UPDATE_CRITERION': {
      const { id, updates } = action.payload;
      const updateCriteriaArray = (criteria: Criterion[]) =>
        criteria.map(c => c.id === id ? { ...c, ...updates, updatedAt: now } : c);

      const dorCriteria = updateCriteriaArray(state.dorCriteria);
      const dodCriteria = updateCriteriaArray(state.dodCriteria);

      const progressMetrics = calculateProgressMetrics([...dorCriteria, ...dodCriteria]);
      const validationResult = validateCriteria([...dorCriteria, ...dodCriteria]);

      return {
        ...state,
        dorCriteria,
        dodCriteria,
        progressMetrics,
        validationResult,
        auditLog: [
          createAuditLogEntry('criterion-updated', id, undefined, undefined, updates),
          ...state.auditLog,
        ],
        lastUpdated: now,
      };
    }

    case 'DELETE_CRITERION': {
      const { id } = action.payload;
      const dorCriteria = state.dorCriteria.filter(c => c.id !== id);
      const dodCriteria = state.dodCriteria.filter(c => c.id !== id);

      const progressMetrics = calculateProgressMetrics([...dorCriteria, ...dodCriteria]);
      const validationResult = validateCriteria([...dorCriteria, ...dodCriteria]);

      return {
        ...state,
        dorCriteria,
        dodCriteria,
        progressMetrics,
        validationResult,
        auditLog: [
          createAuditLogEntry('criterion-deleted', id),
          ...state.auditLog,
        ],
        lastUpdated: now,
      };
    }

    case 'TOGGLE_CRITERION': {
      const { id, completed } = action.payload;
      const updateCriteriaArray = (criteria: Criterion[]) =>
        criteria.map(c => c.id === id ? { ...c, isCompleted: completed, updatedAt: now } : c);

      const dorCriteria = updateCriteriaArray(state.dorCriteria);
      const dodCriteria = updateCriteriaArray(state.dodCriteria);

      const progressMetrics = calculateProgressMetrics([...dorCriteria, ...dodCriteria]);
      const validationResult = validateCriteria([...dorCriteria, ...dodCriteria]);

      // Update time tracking if criteria changed significantly
      let timeTracking = state.timeTracking;
      if (progressMetrics.isReadyToStart && !state.timeTracking.markedReadyAt) {
        timeTracking = { ...timeTracking, markedReadyAt: now };
      }
      if (progressMetrics.isReadyToComplete && !state.timeTracking.markedDoneAt) {
        timeTracking = { ...timeTracking, markedDoneAt: now };
      }

      return {
        ...state,
        dorCriteria,
        dodCriteria,
        progressMetrics,
        validationResult,
        timeTracking,
        auditLog: [
          createAuditLogEntry(completed ? 'criterion-completed' : 'criterion-uncompleted', id),
          ...state.auditLog,
        ],
        lastUpdated: now,
      };
    }

    case 'REORDER_CRITERIA': {
      const { section, criteriaIds } = action.payload;
      const reorderCriteria = (criteria: Criterion[], ids: string[]) =>
        ids.map((id, index) => {
          const criterion = criteria.find(c => c.id === id);
          return criterion ? { ...criterion, order: index + 1, updatedAt: now } : null;
        }).filter(Boolean) as Criterion[];

      const dorCriteria = section === 'dor'
        ? reorderCriteria(state.dorCriteria, criteriaIds)
        : state.dorCriteria;
      const dodCriteria = section === 'dod'
        ? reorderCriteria(state.dodCriteria, criteriaIds)
        : state.dodCriteria;

      return {
        ...state,
        dorCriteria,
        dodCriteria,
        lastUpdated: now,
      };
    }

    case 'APPLY_TEMPLATE': {
      const { template, options } = action.payload;
      const { dorCriteria, dodCriteria } = applyTemplate(
        template,
        state.dorCriteria,
        state.dodCriteria,
        options
      );

      const progressMetrics = calculateProgressMetrics([...dorCriteria, ...dodCriteria]);
      const validationResult = validateCriteria([...dorCriteria, ...dodCriteria]);

      return {
        ...state,
        dorCriteria,
        dodCriteria,
        currentTemplate: template,
        progressMetrics,
        validationResult,
        auditLog: [
          createAuditLogEntry('template-applied', undefined, undefined, undefined, template),
          ...state.auditLog,
        ],
        lastUpdated: now,
      };
    }

    case 'CLEAR_ALL': {
      const { section } = action.payload;
      const dorCriteria = !section || section === 'dor' ? [] : state.dorCriteria;
      const dodCriteria = !section || section === 'dod' ? [] : state.dodCriteria;

      const progressMetrics = calculateProgressMetrics([...dorCriteria, ...dodCriteria]);
      const validationResult = validateCriteria([...dorCriteria, ...dodCriteria]);

      return {
        ...state,
        dorCriteria,
        dodCriteria,
        progressMetrics,
        validationResult,
        lastUpdated: now,
      };
    }

    case 'REQUEST_APPROVAL': {
      return {
        ...state,
        approvalWorkflow: {
          ...state.approvalWorkflow,
          requestedAt: now,
          status: 'requested',
        },
        auditLog: [
          createAuditLogEntry('approval-requested'),
          ...state.auditLog,
        ],
        lastUpdated: now,
      };
    }

    case 'APPROVE': {
      const { approver, comments } = action.payload;
      return {
        ...state,
        approvalWorkflow: {
          ...state.approvalWorkflow,
          approvedAt: now,
          approvedBy: approver,
          status: 'approved',
          comments: comments ? [
            ...state.approvalWorkflow.comments,
            {
              id: `comment-${now.getTime()}`,
              author: approver,
              message: comments,
              createdAt: now,
              type: 'approval',
            },
          ] : state.approvalWorkflow.comments,
        },
        auditLog: [
          createAuditLogEntry('approval-granted', undefined, approver),
          ...state.auditLog,
        ],
        lastUpdated: now,
      };
    }

    case 'REJECT': {
      const { rejector, reason } = action.payload;
      return {
        ...state,
        approvalWorkflow: {
          ...state.approvalWorkflow,
          rejectedAt: now,
          rejectedBy: rejector,
          status: 'rejected',
          comments: [
            ...state.approvalWorkflow.comments,
            {
              id: `comment-${now.getTime()}`,
              author: rejector,
              message: reason,
              createdAt: now,
              type: 'rejection',
            },
          ],
        },
        auditLog: [
          createAuditLogEntry('approval-rejected', undefined, rejector),
          ...state.auditLog,
        ],
        lastUpdated: now,
      };
    }

    default:
      return state;
  }
}

// Initial state factory
function createInitialState(initialState?: Partial<DorDodState>): DorDodState {
  const now = new Date();
  const dorCriteria = initialState?.dorCriteria || [];
  const dodCriteria = initialState?.dodCriteria || [];

  return {
    dorCriteria,
    dodCriteria,
    currentTemplate: initialState?.currentTemplate,
    progressMetrics: calculateProgressMetrics([...dorCriteria, ...dodCriteria]),
    timeTracking: {
      markedReadyAt: initialState?.timeTracking?.markedReadyAt,
      markedDoneAt: initialState?.timeTracking?.markedDoneAt,
      timeInProgress: initialState?.timeTracking?.timeInProgress,
      estimatedDuration: initialState?.timeTracking?.estimatedDuration,
    },
    validationResult: validateCriteria([...dorCriteria, ...dodCriteria]),
    approvalWorkflow: {
      comments: [],
      status: 'none',
      ...initialState?.approvalWorkflow,
    },
    auditLog: initialState?.auditLog || [],
    lastUpdated: now,
  };
}

export function DorDodPanel({
  initialState,
  templates = defaultTemplates,
  onStateChange,
  onValidationChange,
  onApprovalRequest,
  readOnly = false,
  showProgressIndicators = true,
  showTimeTracking = false,
  showApprovalWorkflow = false,
  showAuditLog: _showAuditLog = false,
  className = '',
  collapsed = false,
  printMode = false,
}: DorDodPanelProps) {
  const [state, dispatch] = useReducer(dorDodReducer, createInitialState(initialState));
  const [editingCriterion, setEditingCriterion] = useState<{ section: 'dor' | 'dod'; criterion?: Criterion } | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorMode, setEditorMode] = useState<'add' | 'edit' | 'bulk'>('add');
  const [, setActiveSection] = useState<'dor' | 'dod'>('dor');
  const [dorCollapsed, setDorCollapsed] = useState(collapsed);
  const [dodCollapsed, setDodCollapsed] = useState(collapsed);

  // Effect to notify parent of state changes
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Effect to notify parent of validation changes
  useEffect(() => {
    onValidationChange?.(state.validationResult);
  }, [state.validationResult, onValidationChange]);

  // Handlers
  const handleCriterionToggle = useCallback((id: string, completed: boolean) => {
    dispatch({ type: 'TOGGLE_CRITERION', payload: { id, completed } });
  }, []);

  const handleCriterionEdit = useCallback((criterion: Criterion) => {
    const section = state.dorCriteria.find(c => c.id === criterion.id) ? 'dor' : 'dod';
    setEditingCriterion({ section, criterion });
    setEditorMode('edit');
    setShowEditor(true);
  }, [state.dorCriteria]);

  const handleCriterionDelete = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CRITERION', payload: { id } });
  }, []);

  const handleCriterionAdd = useCallback((section: 'dor' | 'dod') => {
    setEditingCriterion({ section });
    setActiveSection(section);
    setEditorMode('add');
    setShowEditor(true);
  }, []);

  const handleBulkEdit = useCallback((section: 'dor' | 'dod') => {
    setEditingCriterion({ section });
    setActiveSection(section);
    setEditorMode('bulk');
    setShowEditor(true);
  }, []);

  const handleCriterionSave = useCallback((criterionData: Omit<Criterion, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCriterion) {
      if (editingCriterion.criterion) {
        // Edit existing criterion
        dispatch({
          type: 'UPDATE_CRITERION',
          payload: {
            id: editingCriterion.criterion.id,
            updates: criterionData,
          },
        });
      } else {
        // Add new criterion
        dispatch({
          type: 'ADD_CRITERION',
          payload: {
            section: editingCriterion.section,
            criterion: criterionData,
          },
        });
      }
    }
    setEditingCriterion(null);
    setShowEditor(false);
  }, [editingCriterion]);

  const handleCriterionCancel = useCallback(() => {
    setEditingCriterion(null);
    setShowEditor(false);
  }, []);

  const handleReorder = useCallback((section: 'dor' | 'dod', criteriaIds: string[]) => {
    dispatch({ type: 'REORDER_CRITERIA', payload: { section, criteriaIds } });
  }, []);

  const handleTemplateApply = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      dispatch({
        type: 'APPLY_TEMPLATE',
        payload: {
          template,
          options: {
            mergeWithExisting: true,
            replaceExisting: false,
          },
        },
      });
    }
  }, [templates]);

  const handleClearSection = useCallback((section?: 'dor' | 'dod') => {
    dispatch({ type: 'CLEAR_ALL', payload: { section } });
  }, []);

  const handleExport = useCallback((format: 'json' | 'csv' | 'markdown') => {
    const dorExport = exportCriteria(state.dorCriteria, format);
    const dodExport = exportCriteria(state.dodCriteria, format);

    const content = format === 'markdown'
      ? `# Definition of Ready\n${dorExport}\n\n# Definition of Done\n${dodExport}`
      : JSON.stringify({ dor: dorExport, dod: dodExport }, null, 2);

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dor-dod.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }, [state.dorCriteria, state.dodCriteria]);

  const handleApprovalRequest = useCallback(() => {
    dispatch({ type: 'REQUEST_APPROVAL', payload: { section: 'dor' } });
    onApprovalRequest?.([...state.dorCriteria, ...state.dodCriteria]);
  }, [state.dorCriteria, state.dodCriteria, onApprovalRequest]);

  const renderSectionHeader = (
    title: string,
    section: 'dor' | 'dod',
    criteria: Criterion[],
    collapsed: boolean,
    onToggleCollapse: (collapsed: boolean) => void
  ) => {
    const progress = calculateProgressMetrics(criteria);
    const sectionValidation = validateCriteria(criteria);

    return (
      <div className="flex w-full items-center justify-between p-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => onToggleCollapse(!collapsed)}
            className="flex items-center gap-3 flex-grow justify-start p-0 h-auto hover:bg-transparent"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
            <div className="text-left">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">
                {criteria.length} criteria • {progress.completionScore}% complete
              </p>
            </div>
          </Button>
        </CollapsibleTrigger>

        <div className="flex items-center gap-2">
          {/* Progress Badge */}
          {showProgressIndicators && (
            <Badge variant={progress.isReadyToStart ? 'default' : 'secondary'}>
              {progress.isReadyToStart ? 'Ready' : 'In Progress'}
            </Badge>
          )}

          {/* Validation Status */}
          {!sectionValidation.isValid && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}

          {/* Actions Menu */}
          {!readOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleCriterionAdd(section)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Criterion
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkEdit(section)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Add
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleClearSection(section)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  };

  const renderTimeTracking = () => {
    if (!showTimeTracking) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Marked Ready:</span>
              <p>{state.timeTracking.markedReadyAt?.toLocaleString() || 'Not yet'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Marked Done:</span>
              <p>{state.timeTracking.markedDoneAt?.toLocaleString() || 'Not yet'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderGlobalActions = () => {
    if (readOnly) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Templates
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {templates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => handleTemplateApply(template.id)}
                  >
                    {template.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('markdown')}>
                  Export as Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClearSection()}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear All
            </Button>

            {showApprovalWorkflow && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleApprovalRequest}
                disabled={state.approvalWorkflow.status === 'requested'}
              >
                Request Approval
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (printMode) {
    return (
      <div className={`print:text-black print:bg-white ${className}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Definition of Ready & Done</h1>
          {state.currentTemplate && (
            <p className="text-muted-foreground">Template: {state.currentTemplate.name}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Definition of Ready</h2>
            <CriteriaList
              criteria={state.dorCriteria}
              onCriterionToggle={() => {}}
              readOnly
              showProgress={false}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Definition of Done</h2>
            <CriteriaList
              criteria={state.dodCriteria}
              onCriterionToggle={() => {}}
              readOnly
              showProgress={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {renderTimeTracking()}
      {renderGlobalActions()}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Definition of Ready */}
        <Collapsible open={!dorCollapsed} onOpenChange={(open) => setDorCollapsed(!open)}>
          <Card>
            {renderSectionHeader('Definition of Ready', 'dor', state.dorCriteria, dorCollapsed, setDorCollapsed)}
            <CollapsibleContent>
              <CardContent className="pt-0">
                <CriteriaList
                  criteria={state.dorCriteria}
                  onCriterionToggle={handleCriterionToggle}
                  onCriterionEdit={readOnly ? undefined : handleCriterionEdit}
                  onCriterionDelete={readOnly ? undefined : handleCriterionDelete}
                  onReorder={readOnly ? undefined : (ids) => handleReorder('dor', ids)}
                  readOnly={readOnly}
                  showProgress={showProgressIndicators}
                  validationResult={state.validationResult}
                />

                {!readOnly && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => handleCriterionAdd('dor')}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Criterion
                    </Button>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Definition of Done */}
        <Collapsible open={!dodCollapsed} onOpenChange={(open) => setDodCollapsed(!open)}>
          <Card>
            {renderSectionHeader('Definition of Done', 'dod', state.dodCriteria, dodCollapsed, setDodCollapsed)}
            <CollapsibleContent>
              <CardContent className="pt-0">
                <CriteriaList
                  criteria={state.dodCriteria}
                  onCriterionToggle={handleCriterionToggle}
                  onCriterionEdit={readOnly ? undefined : handleCriterionEdit}
                  onCriterionDelete={readOnly ? undefined : handleCriterionDelete}
                  onReorder={readOnly ? undefined : (ids) => handleReorder('dod', ids)}
                  readOnly={readOnly}
                  showProgress={showProgressIndicators}
                  validationResult={state.validationResult}
                />

                {!readOnly && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => handleCriterionAdd('dod')}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Criterion
                    </Button>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Overall Progress Summary */}
      {showProgressIndicators && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {state.progressMetrics.readinessScore}%
                </div>
                <div className="text-sm text-muted-foreground">Readiness Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {state.progressMetrics.completionScore}%
                </div>
                <div className="text-sm text-muted-foreground">Completion Score</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Ready to Start</span>
                {state.progressMetrics.isReadyToStart ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Ready to Complete</span>
                {state.progressMetrics.isReadyToComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {!state.validationResult.isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {state.validationResult.errors.length} validation error(s) found.
            Please address these issues before proceeding.
          </AlertDescription>
        </Alert>
      )}

      {/* Criteria Editor Dialog */}
      {showEditor && editingCriterion && (
        <CriteriaEditor
          criterion={editingCriterion.criterion}
          onSave={handleCriterionSave}
          onCancel={handleCriterionCancel}
          availableTemplates={templates}
          mode={editorMode}
        />
      )}
    </div>
  );
}