/**
 * AcceptanceCriteria Component
 *
 * A comprehensive acceptance criteria editor with support for multiple formats:
 * - Plain text bullets
 * - Gherkin syntax (Given/When/Then)
 * - Markdown format
 * Includes syntax highlighting, validation, templates, and preview mode.
 *
 * @fileoverview AcceptanceCriteria component for TaskEditor
 * @version 1.0.0
 */

'use client';

import {
  FileText,
  Code,
  Hash as Markdown,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import React, { useState, useCallback, useMemo } from 'react';
// UI Components
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// Types and utilities
import {
  AcceptanceCriteriaProps,
  AcceptanceCriteriaFormat,
  AcceptanceCriteriaData,
  TemplateSnippet,
} from './TaskEditor.types';
import {
  validateAcceptanceCriteria,
  parseGherkinContent,
} from './TaskEditor.utils';

// =============================================================================
// Default Template Snippets
// =============================================================================

const DEFAULT_TEMPLATES: TemplateSnippet[] = [
  {
    id: 'gherkin-basic',
    name: 'Basic Gherkin Scenario',
    description: 'A simple Given/When/Then scenario',
    format: AcceptanceCriteriaFormat.GHERKIN,
    content: `Given I am on the login page
When I enter valid credentials
Then I should be logged in successfully`,
    category: 'Authentication',
    keywords: ['login', 'auth', 'basic'],
  },
  {
    id: 'gherkin-form',
    name: 'Form Validation Scenario',
    description: 'Testing form validation with error cases',
    format: AcceptanceCriteriaFormat.GHERKIN,
    content: `Given I am on the registration form
When I submit the form with invalid email format
Then I should see an email validation error
And the form should not be submitted`,
    category: 'Forms',
    keywords: ['form', 'validation', 'error'],
  },
  {
    id: 'gherkin-api',
    name: 'API Response Scenario',
    description: 'Testing API endpoint responses',
    format: AcceptanceCriteriaFormat.GHERKIN,
    content: `Given the API endpoint is available
When I send a GET request to /api/users
Then I should receive a 200 status code
And the response should contain user data`,
    category: 'API',
    keywords: ['api', 'endpoint', 'response'],
  },
  {
    id: 'plain-checklist',
    name: 'Basic Checklist',
    description: 'Simple bullet-point acceptance criteria',
    format: AcceptanceCriteriaFormat.PLAIN_TEXT,
    content: `• User can view the dashboard upon successful login
• All navigation links work correctly
• Page loads within 3 seconds
• Error messages display appropriately
• Data is saved automatically every 30 seconds`,
    category: 'General',
    keywords: ['checklist', 'basic', 'requirements'],
  },
  {
    id: 'markdown-detailed',
    name: 'Detailed Markdown Criteria',
    description: 'Rich markdown formatting with sections',
    format: AcceptanceCriteriaFormat.MARKDOWN,
    content: `## User Interface Requirements

### Must Have
- **Responsive design** that works on mobile, tablet, and desktop
- **Accessibility compliance** with WCAG 2.1 AA standards
- **Loading states** for all async operations

### Should Have
- *Dark mode support* with theme toggle
- *Keyboard navigation* support
- *Progressive enhancement* for slower connections

### Performance Criteria
1. Page load time < 3 seconds
2. Time to interactive < 5 seconds
3. Lighthouse score > 90

\`\`\`
Acceptance: All criteria must pass before deployment
\`\`\``,
    category: 'UI/UX',
    keywords: ['markdown', 'detailed', 'ui', 'performance'],
  },
];

// =============================================================================
// Syntax Highlighting Component (Simplified)
// =============================================================================

interface SyntaxHighlighterProps {
  content: string;
  format: AcceptanceCriteriaFormat;
  className?: string;
}

function SyntaxHighlighter({
  content,
  format,
  className = '',
}: SyntaxHighlighterProps) {
  const getHighlightedContent = () => {
    if (format === AcceptanceCriteriaFormat.GHERKIN) {
      return content
        .replace(
          /^(Given|When|Then|And|But)(\s+)/gm,
          '<span class="text-blue-600 font-semibold">$1</span>$2'
        )
        .replace(
          /^(\s*)(•|\*|-|\d+\.)\s/gm,
          '$1<span class="text-purple-600">$2</span> '
        );
    }

    if (format === AcceptanceCriteriaFormat.MARKDOWN) {
      return content
        .replace(
          /^(#{1,6})\s+(.+)$/gm,
          '<span class="text-blue-600 font-bold">$1</span> <span class="font-semibold">$2</span>'
        )
        .replace(
          /\*\*(.*?)\*\*/g,
          '<span class="font-bold text-gray-900">$1</span>'
        )
        .replace(/\*(.*?)\*/g, '<span class="italic text-gray-700">$1</span>')
        .replace(
          /`([^`]+)`/g,
          '<span class="bg-gray-100 text-red-600 px-1 rounded font-mono text-sm">$1</span>'
        )
        .replace(
          /^(\s*)(•|\*|-|\d+\.)\s/gm,
          '$1<span class="text-purple-600">$2</span> '
        );
    }

    return content.replace(
      /^(\s*)(•|\*|-|\d+\.)\s/gm,
      '$1<span class="text-purple-600">$2</span> '
    );
  };

  return (
    <pre
      className={`font-mono text-sm leading-relaxed whitespace-pre-wrap ${className}`}
      dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
    />
  );
}

// =============================================================================
// Main AcceptanceCriteria Component
// =============================================================================

export function AcceptanceCriteria({
  criteria,
  onCriteriaChange,
  templates = DEFAULT_TEMPLATES,
  supportedFormats = Object.values(AcceptanceCriteriaFormat),
  showPreview = true,
  isReadOnly = false,
  className = '',
}: AcceptanceCriteriaProps): React.JSX.Element {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [hasCopied, setHasCopied] = useState(false);

  // =============================================================================
  // Validation and Processing
  // =============================================================================

  const validatedCriteria = useMemo(() => {
    return validateAcceptanceCriteria(criteria);
  }, [criteria]);

  const gherkinData = useMemo(() => {
    if (
      criteria.format === AcceptanceCriteriaFormat.GHERKIN &&
      criteria.content
    ) {
      return parseGherkinContent(criteria.content);
    }
    return null;
  }, [criteria.format, criteria.content]);

  // =============================================================================
  // Handlers
  // =============================================================================

  const handleFormatChange = useCallback(
    (newFormat: AcceptanceCriteriaFormat) => {
      const updatedCriteria: AcceptanceCriteriaData = {
        ...criteria,
        format: newFormat,
      };

      onCriteriaChange(validateAcceptanceCriteria(updatedCriteria));
    },
    [criteria, onCriteriaChange]
  );

  const handleContentChange = useCallback(
    (newContent: string) => {
      const updatedCriteria: AcceptanceCriteriaData = {
        ...criteria,
        content: newContent,
      };

      onCriteriaChange(validateAcceptanceCriteria(updatedCriteria));
    },
    [criteria, onCriteriaChange]
  );

  const handleTemplateApply = useCallback(
    (template: TemplateSnippet) => {
      const updatedCriteria: AcceptanceCriteriaData = {
        format: template.format,
        content: template.content,
        isValid: true,
      };

      onCriteriaChange(validateAcceptanceCriteria(updatedCriteria));
      toast.success(`Applied template: ${template.name}`);
    },
    [onCriteriaChange]
  );

  const handleCopyContent = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(criteria.content);
      setHasCopied(true);
      toast.success('Content copied to clipboard');
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      toast.error('Failed to copy content');
    }
  }, [criteria.content]);

  const handleAddGherkinSection = useCallback(
    (keyword: string) => {
      const newLine = criteria.content ? '\n' : '';
      const newContent = criteria.content + `${newLine}${keyword} `;
      handleContentChange(newContent);
    },
    [criteria.content, handleContentChange]
  );

  // =============================================================================
  // Render Helpers
  // =============================================================================

  const renderFormatSelector = () => (
    <div className="flex items-center gap-4">
      <Label htmlFor="format-select">Format</Label>
      <Select
        value={criteria.format}
        onValueChange={handleFormatChange}
        disabled={isReadOnly}
      >
        <SelectTrigger id="format-select" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {supportedFormats.includes(AcceptanceCriteriaFormat.PLAIN_TEXT) && (
            <SelectItem value={AcceptanceCriteriaFormat.PLAIN_TEXT}>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Plain Text
              </div>
            </SelectItem>
          )}
          {supportedFormats.includes(AcceptanceCriteriaFormat.GHERKIN) && (
            <SelectItem value={AcceptanceCriteriaFormat.GHERKIN}>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Gherkin (BDD)
              </div>
            </SelectItem>
          )}
          {supportedFormats.includes(AcceptanceCriteriaFormat.MARKDOWN) && (
            <SelectItem value={AcceptanceCriteriaFormat.MARKDOWN}>
              <div className="flex items-center gap-2">
                <Markdown className="h-4 w-4" />
                Markdown
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );

  const renderTemplateSelector = () => {
    const filteredTemplates = templates.filter(t =>
      supportedFormats.includes(t.format)
    );

    if (filteredTemplates.length === 0 || isReadOnly) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Templates
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-2">
            <h4 className="mb-2 font-medium">Template Library</h4>
            <p className="text-muted-foreground mb-3 text-sm">
              Choose a template to get started quickly
            </p>
          </div>
          <Separator />
          {filteredTemplates.map(template => (
            <DropdownMenuItem
              key={template.id}
              onClick={() => handleTemplateApply(template)}
              className="flex-col items-start p-3"
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">{template.name}</span>
                <Badge variant="outline" className="text-xs">
                  {template.format}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {template.description}
              </p>
              <div className="mt-2 flex gap-1">
                {template.keywords.map(keyword => (
                  <Badge key={keyword} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderGherkinHelpers = () => {
    if (criteria.format !== AcceptanceCriteriaFormat.GHERKIN || isReadOnly) {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Quick add:</span>
        {['Given', 'When', 'Then', 'And', 'But'].map(keyword => (
          <Button
            key={keyword}
            variant="ghost"
            size="sm"
            onClick={() => handleAddGherkinSection(keyword)}
            className="h-7 px-2 text-xs"
          >
            {keyword}
          </Button>
        ))}
      </div>
    );
  };

  const renderEditor = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="criteria-content">
            Acceptance Criteria
            {criteria.format === AcceptanceCriteriaFormat.GHERKIN && (
              <span className="text-muted-foreground ml-2 text-sm">
                (Use Given/When/Then format)
              </span>
            )}
            {criteria.format === AcceptanceCriteriaFormat.MARKDOWN && (
              <span className="text-muted-foreground ml-2 text-sm">
                (Markdown supported)
              </span>
            )}
          </Label>
          <div className="flex items-center gap-2">
            {criteria.content && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyContent}
                className="h-8 px-2"
              >
                {hasCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
            {showPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="h-8 px-2"
              >
                {isPreviewMode ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
            )}
          </div>
        </div>

        {isPreviewMode ? (
          <Card>
            <CardContent className="p-4">
              <SyntaxHighlighter
                content={criteria.content || 'No content to preview'}
                format={criteria.format}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>
        ) : (
          <Textarea
            id="criteria-content"
            value={criteria.content}
            onChange={e => handleContentChange(e.target.value)}
            placeholder={
              criteria.format === AcceptanceCriteriaFormat.GHERKIN
                ? 'Given I am a user\nWhen I perform an action\nThen I should see the expected result'
                : criteria.format === AcceptanceCriteriaFormat.MARKDOWN
                  ? '## Requirements\n\n- **Must have:** Feature works correctly\n- *Should have:* Good user experience\n\n### Acceptance\n\n✅ All tests pass'
                  : '• User can perform the main action\n• System responds within expected timeframe\n• Error cases are handled gracefully\n• Data is persisted correctly'
            }
            rows={12}
            className={`font-mono text-sm ${!validatedCriteria.isValid ? 'border-destructive' : ''}`}
            disabled={isReadOnly}
          />
        )}

        {renderGherkinHelpers()}
      </div>

      {/* Validation Messages */}
      {!validatedCriteria.isValid && validatedCriteria.validationErrors && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Validation Errors:</p>
              <ul className="list-inside list-disc text-sm">
                {validatedCriteria.validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Format-specific help */}
      {criteria.format === AcceptanceCriteriaFormat.GHERKIN && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <p className="mb-2 font-medium">Gherkin Syntax Tips:</p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>
                <strong>Given:</strong> Sets up the initial context
              </li>
              <li>
                <strong>When:</strong> Describes the action or event
              </li>
              <li>
                <strong>Then:</strong> Specifies the expected outcome
              </li>
              <li>
                <strong>And/But:</strong> Adds additional conditions
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderGherkinStructure = () => {
    if (!gherkinData) return null;

    return (
      <div className="space-y-4">
        <h4 className="font-medium">Scenario Structure</h4>

        {gherkinData.given.length > 0 && (
          <div>
            <h5 className="mb-2 text-sm font-medium text-blue-600">
              Given (Context)
            </h5>
            <ul className="space-y-1 text-sm">
              {gherkinData.given.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {gherkinData.when.length > 0 && (
          <div>
            <h5 className="mb-2 text-sm font-medium text-purple-600">
              When (Actions)
            </h5>
            <ul className="space-y-1 text-sm">
              {gherkinData.when.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {gherkinData.then.length > 0 && (
          <div>
            <h5 className="mb-2 text-sm font-medium text-green-600">
              Then (Outcomes)
            </h5>
            <ul className="space-y-1 text-sm">
              {gherkinData.then.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {gherkinData.and && gherkinData.and.length > 0 && (
          <div>
            <h5 className="mb-2 text-sm font-medium text-gray-600">
              Additional Conditions
            </h5>
            <ul className="space-y-1 text-sm">
              {gherkinData.and.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // =============================================================================
  // Main Render
  // =============================================================================

  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Acceptance Criteria</h3>
          <p className="text-muted-foreground text-sm">
            Define clear, testable requirements for this task
            {validatedCriteria.isValid ? (
              <Badge
                variant="outline"
                className="ml-2 border-green-300 text-green-700"
              >
                <Check className="mr-1 h-3 w-3" />
                Valid
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="ml-2 border-red-300 text-red-700"
              >
                <AlertCircle className="mr-1 h-3 w-3" />
                Invalid
              </Badge>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {renderTemplateSelector()}
          {renderFormatSelector()}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          {criteria.format === AcceptanceCriteriaFormat.GHERKIN &&
            gherkinData && (
              <TabsTrigger value="structure">Structure</TabsTrigger>
            )}
        </TabsList>

        <TabsContent value="editor" className="mt-6">
          {renderEditor()}
        </TabsContent>

        {criteria.format === AcceptanceCriteriaFormat.GHERKIN && (
          <TabsContent value="structure" className="mt-6">
            {renderGherkinStructure()}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
