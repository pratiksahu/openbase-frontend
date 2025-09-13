'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  HelpCircle,
  Save,
  Upload,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';


import type { CriteriaEditorProps, Criterion, CriteriaCategory, DorDodTemplate } from './DorDodPanel.types';
import { getCategoryInfo } from './DorDodPanel.utils';

// Form validation schema
const criterionSchema = z.object({
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.enum(['required', 'recommended', 'optional']),
  helpText: z.string().optional(),
  validationRule: z.object({
    type: z.enum(['required', 'conditional', 'dependency']),
    message: z.string().min(1, 'Validation message is required'),
    condition: z.string().optional(),
    dependsOn: z.array(z.string()).optional(),
  }).optional(),
  order: z.number().min(0),
});

type CriterionFormData = z.infer<typeof criterionSchema>;

export function CriteriaEditor({
  criterion,
  onSave,
  onCancel,
  availableTemplates = [],
  mode = 'add',
}: CriteriaEditorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [, setSelectedTemplate] = useState<DorDodTemplate | null>(null);
  const [bulkCriteria, setBulkCriteria] = useState<string>('');
  const [importFormat, setImportFormat] = useState<'text' | 'json' | 'csv'>('text');

  const form = useForm<CriterionFormData>({
    resolver: zodResolver(criterionSchema),
    defaultValues: {
      description: criterion?.description || '',
      category: criterion?.category || 'required',
      helpText: criterion?.helpText || '',
      validationRule: criterion?.validationRule || undefined,
      order: criterion?.order || 1,
    },
  });

  useEffect(() => {
    if (criterion) {
      form.reset({
        description: criterion.description,
        category: criterion.category,
        helpText: criterion.helpText,
        validationRule: criterion.validationRule,
        order: criterion.order,
      });
    }
  }, [criterion, form]);

  const handleSave = (data: CriterionFormData) => {
    onSave({
      ...data,
      isCompleted: false,
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel();
  };

  const handleTemplateApply = (template: DorDodTemplate, section: 'dor' | 'dod') => {
    const criteria = section === 'dor' ? template.dorCriteria : template.dodCriteria;
    criteria.forEach((templateCriterion, index) => {
      onSave({
        ...templateCriterion,
        isCompleted: false,
        order: index + 1,
      });
    });
    setSelectedTemplate(null);
  };

  const handleBulkImport = () => {
    if (!bulkCriteria.trim()) return;

    try {
      let criteria: Array<Omit<Criterion, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>>;

      switch (importFormat) {
        case 'text':
          // Parse simple text list (one criterion per line)
          criteria = bulkCriteria
            .split('\n')
            .map((line, index) => line.trim())
            .filter(Boolean)
            .map((description) => ({
              description,
              category: 'required' as CriteriaCategory,
              order: index + 1,
            }));
          break;

        case 'json':
          const jsonData = JSON.parse(bulkCriteria);
          criteria = Array.isArray(jsonData) ? jsonData : [jsonData];
          break;

        case 'csv':
          // Parse CSV format: Description,Category,HelpText
          const lines = bulkCriteria.split('\n').filter(Boolean);
          // const headers = lines[0].split(',');
          criteria = lines.slice(1).map((line, index) => {
            const values = line.split(',');
            return {
              description: values[0]?.replace(/^"|"$/g, '') || '',
              category: (values[1]?.toLowerCase() as CriteriaCategory) || 'required',
              helpText: values[2]?.replace(/^"|"$/g, '') || undefined,
              order: index + 1,
            };
          });
          break;

        default:
          throw new Error('Unsupported format');
      }

      criteria.forEach(criterionData => onSave({
        ...criterionData,
        isCompleted: false,
      }));
      setBulkCriteria('');
      setIsOpen(false);
    } catch {
      // Error parsing bulk criteria - silently handle or show user-friendly message
    }
  };

  const renderSingleCriterionForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe what needs to be completed..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormDescription>
                  Clear, actionable description of the criterion
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['required', 'recommended', 'optional'] as const).map((category) => {
                        const info = getCategoryInfo(category);
                        return (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              <span>{info.icon}</span>
                              <span>{info.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>Display order (1-100)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="helpText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Help Text</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Additional context or guidance..."
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  Optional explanation or guidance for this criterion
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Advanced Options */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              checked={showAdvanced}
              onCheckedChange={(checked) => setShowAdvanced(!!checked)}
            />
            <Label htmlFor="advanced" className="cursor-pointer">
              Show advanced validation options
            </Label>
          </div>

          {showAdvanced && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Validation Rules</CardTitle>
                <CardDescription>
                  Configure validation behavior for this criterion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="validationRule.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validation Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select validation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="required">Required</SelectItem>
                          <SelectItem value="conditional">Conditional</SelectItem>
                          <SelectItem value="dependency">Dependency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validationRule.message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validation Message</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Message to show when validation fails"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('validationRule.type') === 'conditional' && (
                  <FormField
                    control={form.control}
                    name="validationRule.condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Conditional logic (advanced)"
                          />
                        </FormControl>
                        <FormDescription>
                          JavaScript expression for conditional validation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {mode === 'edit' ? 'Update' : 'Add'} Criterion
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  const renderTemplateSelector = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Apply Template</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a template to quickly add common criteria for your project type.
        </p>
      </div>

      <div className="grid gap-4">
        {availableTemplates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:bg-accent/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {template.category.replace('-', ' ')}
                    </Badge>
                    {template.isCustom && (
                      <Badge variant="secondary" className="text-xs">
                        Custom
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateApply(template, 'dor')}
                >
                  Apply DoR ({template.dorCriteria.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateApply(template, 'dod')}
                >
                  Apply DoD ({template.dodCriteria.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBulkImport = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Bulk Import</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Import multiple criteria at once using different formats.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Import Format</Label>
          <Select value={importFormat} onValueChange={(value: 'text' | 'json' | 'csv') => setImportFormat(value)}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Plain Text (one per line)</SelectItem>
              <SelectItem value="json">JSON Format</SelectItem>
              <SelectItem value="csv">CSV Format</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Criteria Data</Label>
          <Textarea
            value={bulkCriteria}
            onChange={(e) => setBulkCriteria(e.target.value)}
            placeholder={
              importFormat === 'text'
                ? "Requirements are clear\nDesign is approved\nTests are written"
                : importFormat === 'json'
                ? '[{"description": "Requirements are clear", "category": "required"}]'
                : "Description,Category,HelpText\nRequirements are clear,required,All functional requirements documented"
            }
            className="min-h-[200px] mt-2"
          />
        </div>

        {importFormat !== 'text' && (
          <Alert>
            <HelpCircle className="h-4 w-4" />
            <AlertDescription>
              {importFormat === 'json' && 'Provide an array of criterion objects with description, category, and optional helpText.'}
              {importFormat === 'csv' && 'Use comma-separated values with headers: Description,Category,HelpText'}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleBulkImport} disabled={!bulkCriteria.trim()}>
          <Upload className="mr-2 h-4 w-4" />
          Import Criteria
        </Button>
        <Button variant="outline" onClick={() => setBulkCriteria('')}>
          Clear
        </Button>
      </div>
    </div>
  );

  if (mode === 'bulk') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Criteria</DialogTitle>
            <DialogDescription>
              Add multiple criteria using templates or bulk import
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="template">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="template">Templates</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
            </TabsList>
            <TabsContent value="template">
              {renderTemplateSelector()}
            </TabsContent>
            <TabsContent value="bulk">
              {renderBulkImport()}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Criterion' : 'Add New Criterion'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Update the criterion details below.'
              : 'Define a new criterion for your Definition of Ready or Definition of Done.'
            }
          </DialogDescription>
        </DialogHeader>

        {renderSingleCriterionForm()}
      </DialogContent>
    </Dialog>
  );
}