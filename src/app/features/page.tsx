import {
  CodeBracketIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CogIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';

export default function FeaturesPage() {
  return (
    <Section>
      <Container>
        <PageHeader
          title="Features"
          description="Everything you need to build modern web applications"
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Home', href: '/' }, { label: 'Features' }]}
            />
          }
        />

        <div className="grid gap-12 lg:gap-16" data-testid="features-grid">
          {featureGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-8">
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">{group.title}</h2>
                <p className="text-muted-foreground mx-auto max-w-2xl">
                  {group.description}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="bg-card rounded-lg border p-6 transition-shadow hover:shadow-md"
                    data-testid="feature-card"
                  >
                    <div className="space-y-4">
                      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                        <feature.icon
                          className="text-primary h-5 w-5"
                          data-testid="feature-icon"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3
                          className="text-lg font-semibold"
                          data-testid="feature-title"
                        >
                          {feature.title}
                        </h3>
                        <p
                          className="text-muted-foreground text-sm"
                          data-testid="feature-description"
                        >
                          {feature.description}
                        </p>
                      </div>
                      {feature.tags && (
                        <div className="flex flex-wrap gap-2">
                          {feature.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

const featureGroups = [
  {
    title: 'Developer Experience',
    description:
      'Tools and workflows that make development enjoyable and productive.',
    features: [
      {
        icon: CodeBracketIcon,
        title: 'TypeScript',
        description:
          'Full TypeScript support with strict mode enabled for better code quality and developer experience.',
        tags: ['TypeScript', 'IntelliSense', 'Type Safety'],
      },
      {
        icon: CogIcon,
        title: 'ESLint & Prettier',
        description:
          'Configured linting and formatting with popular rule sets and automatic fixes on save.',
        tags: ['ESLint', 'Prettier', 'Code Quality'],
      },
      {
        icon: RocketLaunchIcon,
        title: 'Hot Module Reload',
        description:
          'Fast refresh for instant feedback during development with Next.js built-in HMR.',
        tags: ['HMR', 'Fast Refresh', 'Development'],
      },
    ],
  },
  {
    title: 'UI & Styling',
    description:
      'Modern styling solutions and component libraries for beautiful interfaces.',
    features: [
      {
        icon: PaintBrushIcon,
        title: 'Tailwind CSS',
        description:
          'Utility-first CSS framework with custom design system and dark mode support.',
        tags: ['Tailwind CSS', 'Dark Mode', 'Responsive'],
      },
      {
        icon: CodeBracketIcon,
        title: 'Component Library',
        description:
          'Pre-built components with consistent design patterns and accessibility features.',
        tags: ['Components', 'Accessibility', 'Storybook'],
      },
      {
        icon: PaintBrushIcon,
        title: 'Icons',
        description:
          'Beautiful icon sets from Heroicons with consistent styling and sizing.',
        tags: ['Icons', 'Heroicons', 'SVG'],
      },
    ],
  },
  {
    title: 'Performance & SEO',
    description:
      'Optimizations and features for fast loading and search engine visibility.',
    features: [
      {
        icon: RocketLaunchIcon,
        title: 'Image Optimization',
        description:
          'Automatic image optimization with WebP/AVIF support and lazy loading.',
        tags: ['Images', 'WebP', 'Lazy Loading'],
      },
      {
        icon: ChartBarIcon,
        title: 'Bundle Splitting',
        description:
          'Automatic code splitting and dynamic imports for optimal performance.',
        tags: ['Code Splitting', 'Performance', 'Optimization'],
      },
      {
        icon: ShieldCheckIcon,
        title: 'SEO Ready',
        description:
          'Meta tags, structured data, and sitemap generation for better search rankings.',
        tags: ['SEO', 'Meta Tags', 'Sitemap'],
      },
    ],
  },
];