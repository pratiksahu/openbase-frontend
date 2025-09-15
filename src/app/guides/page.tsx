import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Guides | Openbase',
  description:
    'Learn how to get the most out of Openbase with our comprehensive guides',
};

const guides = [
  {
    title: 'Getting Started with Openbase',
    description: 'Learn the basics and set up your first project',
    category: 'Basics',
    readTime: '5 min',
    author: 'Sarah Chen',
    difficulty: 'Beginner',
  },
  {
    title: 'Advanced API Integration',
    description: 'Deep dive into our API capabilities and best practices',
    category: 'Development',
    readTime: '15 min',
    author: 'Mike Johnson',
    difficulty: 'Advanced',
  },
  {
    title: 'Team Collaboration Features',
    description: 'Maximize productivity with team features and workflows',
    category: 'Collaboration',
    readTime: '8 min',
    author: 'Emma Davis',
    difficulty: 'Intermediate',
  },
  {
    title: 'Security Best Practices',
    description: 'Keep your data safe with our security recommendations',
    category: 'Security',
    readTime: '10 min',
    author: 'Alex Thompson',
    difficulty: 'Intermediate',
  },
  {
    title: 'Performance Optimization',
    description: 'Tips and tricks to optimize your Openbase experience',
    category: 'Performance',
    readTime: '12 min',
    author: 'Lisa Wang',
    difficulty: 'Advanced',
  },
  {
    title: 'Automation Workflows',
    description: 'Automate repetitive tasks and save time',
    category: 'Automation',
    readTime: '7 min',
    author: 'David Kim',
    difficulty: 'Intermediate',
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-500/10 text-green-500';
    case 'Intermediate':
      return 'bg-yellow-500/10 text-yellow-500';
    case 'Advanced':
      return 'bg-red-500/10 text-red-500';
    default:
      return '';
  }
};

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Guides & Tutorials</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to master Openbase
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 flex items-start justify-between">
                  <Badge variant="secondary">{guide.category}</Badge>
                  <Badge
                    className={getDifficultyColor(guide.difficulty)}
                    variant="secondary"
                  >
                    {guide.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {guide.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {guide.author}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <BookOpen className="mx-auto mb-4 h-12 w-12" />
              <CardTitle className="text-2xl">
                Can&apos;t find what you&apos;re looking for?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Our support team is here to help you with any questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contact">
                <button className="bg-background text-foreground hover:bg-background/90 rounded-md px-6 py-2 transition-colors">
                  Contact Support
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
