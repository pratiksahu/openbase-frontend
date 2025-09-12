import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  // In a real app, you would fetch the post data based on the slug
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Section>
      <Container size="md">
        <article>
          <header className="mb-8 space-y-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: post.title },
              ]}
            />

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                {post.title}
              </h1>

              <div className="text-muted-foreground flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <OptimizedImage
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span>{post.author.name}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>

                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <OptimizedImage
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="h-64 w-full rounded-lg object-cover md:h-96"
            />
          </header>

          <div
            className="prose prose-gray dark:prose-invert max-w-none"
            data-testid="post-content"
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <footer className="border-border mt-12 border-t pt-8">
            <div
              className="bg-muted/50 rounded-lg p-6"
              data-testid="author-info"
            >
              <div className="flex items-start space-x-4">
                <OptimizedImage
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div className="space-y-2">
                  <h3 className="font-semibold">{post.author.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {post.author.bio}
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </article>
      </Container>
    </Section>
  );
}

// Mock function - in real app, this would fetch from CMS/database
function getBlogPost(slug: string) {
  const posts = {
    'getting-started-nextjs-14': {
      title: 'Getting Started with Next.js 14',
      date: '2024-01-15',
      readTime: '5 min read',
      image: '/blog/nextjs-14.jpg',
      author: {
        name: 'Sarah Johnson',
        avatar: '/authors/sarah.jpg',
        bio: 'Full-stack developer with 10+ years building web applications.',
      },
      tags: ['Next.js', 'React', 'Tutorial'],
      content: `
        <p>Next.js 14 brings exciting new features and improvements...</p>
        <h2>App Router</h2>
        <p>The new App Router provides better performance...</p>
        <!-- More content -->
      `,
    },
  };

  return posts[slug as keyof typeof posts] || null;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}