import { Cookie, Settings } from 'lucide-react';
import { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const metadata: Metadata = {
  title: 'Cookie Policy | Openbase',
  description: 'Learn how Openbase uses cookies and similar technologies',
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex items-center gap-3">
        <Cookie className="text-primary h-8 w-8" />
        <h1 className="text-4xl font-bold">Cookie Policy</h1>
      </div>

      <div className="prose prose-gray dark:prose-invert mb-8 max-w-none">
        <p className="text-muted-foreground mb-6 text-lg">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">What are cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device when you
            visit our website. They help us provide you with a better experience
            by remembering your preferences and understanding how you use our
            services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">How we use cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              <strong>Essential cookies:</strong> Required for the website to
              function properly
            </li>
            <li>
              <strong>Performance cookies:</strong> Help us understand how
              visitors interact with our website
            </li>
            <li>
              <strong>Functional cookies:</strong> Remember your preferences and
              settings
            </li>
            <li>
              <strong>Marketing cookies:</strong> Used to deliver relevant
              advertisements
            </li>
          </ul>
        </section>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cookie Preferences
          </CardTitle>
          <CardDescription>
            Manage your cookie preferences below. Essential cookies cannot be
            disabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="essential">Essential Cookies</Label>
              <p className="text-muted-foreground text-sm">
                Required for basic website functionality
              </p>
            </div>
            <Switch id="essential" checked disabled />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="performance">Performance Cookies</Label>
              <p className="text-muted-foreground text-sm">
                Help us improve our website
              </p>
            </div>
            <Switch id="performance" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="functional">Functional Cookies</Label>
              <p className="text-muted-foreground text-sm">
                Remember your preferences
              </p>
            </div>
            <Switch id="functional" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing Cookies</Label>
              <p className="text-muted-foreground text-sm">
                Deliver personalized ads
              </p>
            </div>
            <Switch id="marketing" />
          </div>
        </CardContent>
      </Card>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Types of cookies we use
          </h2>

          <h3 className="mt-4 mb-2 text-xl font-semibold">Session Cookies</h3>
          <p>
            These are temporary cookies that expire when you close your browser.
            We use these to maintain your session state.
          </p>

          <h3 className="mt-4 mb-2 text-xl font-semibold">
            Persistent Cookies
          </h3>
          <p>
            These cookies remain on your device for a set period. We use these
            to remember your preferences and recognize you on return visits.
          </p>

          <h3 className="mt-4 mb-2 text-xl font-semibold">
            Third-Party Cookies
          </h3>
          <p>
            Some cookies are placed by third-party services that appear on our
            pages. We do not control these cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Managing cookies</h2>
          <p>
            You can control and manage cookies in various ways. Please note that
            removing or blocking cookies may impact your user experience and
            parts of our website may no longer be fully accessible.
          </p>
          <p className="mt-2">
            Most browsers accept cookies automatically, but you can alter your
            browser settings to prevent automatic acceptance. Below are links to
            cookie management instructions for common browsers:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              <a href="#" className="text-primary hover:underline">
                Chrome
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline">
                Firefox
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline">
                Safari
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline">
                Edge
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Contact us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us
            at:
          </p>
          <p className="mt-2">
            Email: privacy@openbase.com
            <br />
            Address: 123 Tech Street, San Francisco, CA 94105
          </p>
        </section>
      </div>

      <div className="flex gap-4">
        <Button>Save Preferences</Button>
        <Button variant="outline">Accept All</Button>
      </div>
    </div>
  );
}
