'use client';

import { Bell, Home, Settings, User } from 'lucide-react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function ComponentsTest() {
  return (
    <div className="container mx-auto space-y-8 p-8">
      <h1 className="mb-8 text-4xl font-bold">Component Library Test</h1>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Various button styles and sizes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>

      {/* Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Lucide Icons</CardTitle>
          <CardDescription>Icon library integration</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Home className="h-6 w-6" />
          <User className="h-6 w-6" />
          <Settings className="h-6 w-6" />
          <Bell className="h-6 w-6" />
          <Button size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Input controls and form components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Type your message here..." />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>

          <div className="space-y-2">
            <Label>Choose an option</Label>
            <RadioGroup defaultValue="option-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-1" id="option-1" />
                <Label htmlFor="option-1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-2" id="option-2" />
                <Label htmlFor="option-2">Option 2</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Select Framework</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="remix">Remix</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
                <SelectItem value="gatsby">Gatsby</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Status indicators and labels</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs Component</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="space-y-2">
                <h3 className="font-medium">Account Settings</h3>
                <p className="text-muted-foreground text-sm">
                  Make changes to your account here.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="space-y-2">
                <h3 className="font-medium">Password Settings</h3>
                <p className="text-muted-foreground text-sm">
                  Change your password here.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-2">
                <h3 className="font-medium">General Settings</h3>
                <p className="text-muted-foreground text-sm">
                  Manage your general preferences.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Indicator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={33} className="w-full" />
          <Progress value={66} className="w-full" />
          <Progress value={100} className="w-full" />
        </CardContent>
      </Card>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Avatars</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert message with important information.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error Alert</AlertTitle>
            <AlertDescription>
              This is an error alert indicating something went wrong.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Separator */}
      <Card>
        <CardHeader>
          <CardTitle>Content Separator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>Content above separator</div>
          <Separator />
          <div>Content below separator</div>
        </CardContent>
      </Card>

      {/* Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
          <CardDescription>Skeleton loading indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast Test */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>
            Click buttons to show different toast types
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              toast('Default Notification', {
                description: 'This is a default toast message.',
              });
            }}
          >
            Show Default Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.success('Success!', {
                description: 'Your action was completed successfully.',
              });
            }}
          >
            Show Success Toast
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toast.error('Error!', {
                description: 'Something went wrong. Please try again.',
              });
            }}
          >
            Show Error Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast.info('Information', {
                description: "Here's some helpful information for you.",
              });
            }}
          >
            Show Info Toast
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
