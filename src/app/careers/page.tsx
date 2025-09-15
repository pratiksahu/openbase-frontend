import { Briefcase, MapPin, Clock, Users, Heart, Zap } from 'lucide-react';
import { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Careers | Openbase',
  description: 'Join our team and help build the future of Openbase',
};

const openPositions = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    level: 'Senior',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-level',
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'New York, NY',
    type: 'Full-time',
    level: 'Senior',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-level',
  },
  {
    title: 'Data Scientist',
    department: 'Data',
    location: 'San Francisco, CA',
    type: 'Full-time',
    level: 'Senior',
  },
  {
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-level',
  },
];

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description:
      'Comprehensive health, dental, and vision coverage for you and your family',
  },
  {
    icon: Users,
    title: 'Remote First',
    description:
      'Work from anywhere with flexible hours and async communication',
  },
  {
    icon: Zap,
    title: 'Learning & Development',
    description: '$2,000 annual budget for courses, conferences, and books',
  },
  {
    icon: Clock,
    title: 'Work-Life Balance',
    description: 'Unlimited PTO, parental leave, and sabbatical programs',
  },
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Join Our Team</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            We&apos;re building the future of developer tools and looking for
            passionate people to join our mission
          </p>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Why Work at Openbase?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <Icon className="text-primary h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {position.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {position.department}
                      </CardDescription>
                    </div>
                    <Badge>{position.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {position.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {position.type}
                    </span>
                  </div>
                  <Button>View Position</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">
              Don&apos;t see the right role?
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              We&apos;re always looking for talented people to join our team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary-foreground/90 mb-4">
              Send us your resume and let us know how you can contribute to our
              mission.
            </p>
            <Button variant="secondary">Send General Application</Button>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Our Values</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-semibold">Innovation First</h3>
              <p className="text-muted-foreground text-sm">
                We push boundaries and challenge the status quo
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Customer Obsessed</h3>
              <p className="text-muted-foreground text-sm">
                Every decision starts with our users in mind
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Collaborative Spirit</h3>
              <p className="text-muted-foreground text-sm">
                We win together through open communication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
