import {
  CheckIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';


export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section spacing="xl" data-testid="hero-section">
        <Container>
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Build Amazing Apps
                <span className="text-primary block">Faster Than Ever</span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                A modern Next.js starter with everything you need to build
                production-ready applications. TypeScript, Tailwind CSS,
                testing, and more.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild data-testid="cta-button">
                <Link href="/features">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#demo">
                  <PlayIcon className="mr-2 h-4 w-4" />
                  View Demo
                </Link>
              </Button>
            </div>

            <div className="text-muted-foreground flex items-center justify-center space-x-1 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="ml-2">Trusted by 1000+ developers</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Overview */}
      <Section variant="muted">
        <Container>
          <div className="space-y-12 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Everything You Need</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                Built with modern tools and best practices to help you ship
                faster and build better.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="space-y-4 text-center">
                  <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <Button asChild>
              <Link href="/features">View All Features</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Social Proof */}
      <Section>
        <Container>
          <div className="space-y-8 text-center">
            <h2 className="text-2xl font-bold">Loved by Developers</h2>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-card rounded-lg border p-6">
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center space-x-3">
                    <OptimizedImage
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section variant="accent">
        <Container>
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground mx-auto max-w-xl text-xl">
              Join thousands of developers building amazing applications.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Start Building</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

const features = [
  {
    icon: CheckIcon,
    title: 'TypeScript Ready',
    description:
      'Built with TypeScript for better developer experience and type safety.',
  },
  {
    icon: CheckIcon,
    title: 'Modern UI',
    description:
      'Beautiful components built with Tailwind CSS and Radix UI primitives.',
  },
  {
    icon: CheckIcon,
    title: 'Production Ready',
    description:
      'Optimized builds, testing setup, and deployment configuration included.',
  },
];

const testimonials = [
  {
    content:
      'This starter saved me weeks of setup time. Everything just works!',
    author: 'Sarah Johnson',
    role: 'Frontend Developer',
    avatar: '/avatars/sarah.svg',
  },
  {
    content:
      "The best Next.js starter I've used. Great documentation and examples.",
    author: 'Mike Chen',
    role: 'Full Stack Developer',
    avatar: '/avatars/mike.svg',
  },
  {
    content:
      'Clean code, modern patterns, and excellent performance out of the box.',
    author: 'Emma Davis',
    role: 'Tech Lead',
    avatar: '/avatars/emma.svg',
  },
];