'use client';

import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ComponentsTestPage() {
  const [clickCount, setClickCount] = useState(0);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('option1');

  return (
    <main className="container mx-auto p-8">
      <h1 className="mb-8 text-4xl font-bold">Components Test Page</h1>

      {/* Buttons Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setClickCount(clickCount + 1)}>
              Click me ({clickCount})
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Alert Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert message for testing.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error Alert</AlertTitle>
            <AlertDescription>
              This is an error alert message for testing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Form Controls Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Form Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="test-checkbox"
              checked={checkboxChecked}
              onCheckedChange={checked => setCheckboxChecked(!!checked)}
            />
            <Label htmlFor="test-checkbox">
              Test Checkbox {checkboxChecked && '(Checked)'}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="test-switch"
              checked={switchEnabled}
              onCheckedChange={setSwitchEnabled}
            />
            <Label htmlFor="test-switch">
              Test Switch {switchEnabled && '(Enabled)'}
            </Label>
          </div>

          <RadioGroup value={selectedRadio} onValueChange={setSelectedRadio}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id="r1" />
              <Label htmlFor="r1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id="r2" />
              <Label htmlFor="r2">Option 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option3" id="r3" />
              <Label htmlFor="r3">Option 3</Label>
            </div>
          </RadioGroup>
          <p className="text-muted-foreground text-sm">
            Selected: {selectedRadio}
          </p>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p>Content for Tab 1</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <p>Content for Tab 2</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <p>Content for Tab 3</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
