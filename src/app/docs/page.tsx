import { FileText, Code, Terminal, Zap, Database, Shield } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Documentation | Openbase',
  description: 'Comprehensive documentation for Openbase platform',
};

const docSections = [
  {
    title: 'Getting Started',
    description: 'Quick start guide and basic concepts',
    icon: Zap,
    links: [
      'Installation',
      'Configuration',
      'Your First Project',
      'Basic Concepts',
    ],
  },
  {
    title: 'API Reference',
    description: 'Complete API documentation with examples',
    icon: Code,
    links: ['Authentication', 'REST API', 'GraphQL', 'Webhooks'],
  },
  {
    title: 'CLI Tools',
    description: 'Command line interface documentation',
    icon: Terminal,
    links: ['Installation', 'Commands', 'Configuration', 'Scripting'],
  },
  {
    title: 'Database',
    description: 'Database schema and query documentation',
    icon: Database,
    links: ['Schema Design', 'Queries', 'Migrations', 'Optimization'],
  },
  {
    title: 'Security',
    description: 'Security features and best practices',
    icon: Shield,
    links: ['Authentication', 'Authorization', 'Encryption', 'Compliance'],
  },
  {
    title: 'Advanced Topics',
    description: 'Deep dives into advanced features',
    icon: FileText,
    links: ['Performance', 'Scaling', 'Monitoring', 'Troubleshooting'],
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Documentation</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to build with Openbase
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {docSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Icon className="text-primary mb-2 h-8 w-8" />
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href="#"
                          className="hover:text-primary flex items-center gap-2 text-sm transition-colors"
                        >
                          <span className="text-muted-foreground">→</span>
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-muted mt-12 rounded-lg p-8">
          <h2 className="mb-4 text-2xl font-bold">Popular Topics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="#"
              className="bg-background block rounded-lg p-4 transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 font-semibold">Quick Start Guide</h3>
              <p className="text-muted-foreground text-sm">
                Get up and running in 5 minutes
              </p>
            </Link>
            <Link
              href="#"
              className="bg-background block rounded-lg p-4 transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 font-semibold">API Authentication</h3>
              <p className="text-muted-foreground text-sm">
                Learn how to authenticate API requests
              </p>
            </Link>
            <Link
              href="#"
              className="bg-background block rounded-lg p-4 transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 font-semibold">Error Handling</h3>
              <p className="text-muted-foreground text-sm">
                Best practices for handling errors
              </p>
            </Link>
            <Link
              href="#"
              className="bg-background block rounded-lg p-4 transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 font-semibold">Rate Limiting</h3>
              <p className="text-muted-foreground text-sm">
                Understanding API rate limits
              </p>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/help" className="text-primary hover:underline">
              Visit Help Center
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
