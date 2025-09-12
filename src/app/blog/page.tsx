import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { OptimizedImage } from '@/components/ui/optimized-image';

export default function BlogPage() {
  return (
    <Section>
      <Container>
        <PageHeader
          title="Blog"
          description="Latest news, tutorials, and insights from our team"
        />

        <div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          data-testid="blog-grid"
        >
          {posts.map((post, index) => (
            <article
              key={index}
              className="bg-card overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
              data-testid="blog-card"
            >
              <OptimizedImage
                src={post.image}
                alt={post.title}
                width={400}
                height={200}
                className="h-48 w-full object-cover"
              />

              <div className="space-y-4 p-6">
                <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime={post.date} data-testid="post-date">
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2
                    className="text-xl font-semibold"
                    data-testid="post-title"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p
                    className="text-muted-foreground"
                    data-testid="post-excerpt"
                  >
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <OptimizedImage
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-muted-foreground text-sm">
                      {post.author.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-2 transition-colors">
            Load More Posts
          </button>
        </div>
      </Container>
    </Section>
  );
}

const posts = [
  {
    title: 'Getting Started with Next.js 14',
    slug: 'getting-started-nextjs-14',
    excerpt:
      'Learn how to build modern web applications with the latest features in Next.js 14.',
    image: '/blog/nextjs-14.jpg',
    date: '2024-01-15',
    readTime: '5 min read',
    author: {
      name: 'Sarah Johnson',
      avatar: '/authors/sarah.jpg',
    },
    tags: ['Next.js', 'React', 'Tutorial'],
  },
  {
    title: 'Building Accessible Components',
    slug: 'building-accessible-components',
    excerpt:
      'Best practices for creating components that work for everyone, including users with disabilities.',
    image: '/blog/accessibility.jpg',
    date: '2024-01-10',
    readTime: '8 min read',
    author: {
      name: 'Mike Chen',
      avatar: '/authors/mike.jpg',
    },
    tags: ['Accessibility', 'React', 'Best Practices'],
  },
  {
    title: 'Optimizing Performance with React',
    slug: 'optimizing-performance-react',
    excerpt:
      'Techniques and patterns for building fast React applications that scale.',
    image: '/blog/performance.jpg',
    date: '2024-01-05',
    readTime: '12 min read',
    author: {
      name: 'Emma Davis',
      avatar: '/authors/emma.jpg',
    },
    tags: ['Performance', 'React', 'Optimization'],
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}