import { Metadata } from 'next';
import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
}

const defaultSEO = {
  siteName: 'OpenBase V2',
  title: 'OpenBase V2 - Modern Next.js Application',
  description:
    'A modern Next.js application built with TypeScript, Tailwind CSS, and shadcn/ui',
  image: '/images/og-default.jpg',
  type: 'website' as const,
};

export function generateMetadata({
  title,
  description = defaultSEO.description,
  image = defaultSEO.image,
  url,
  type = defaultSEO.type,
  siteName = defaultSEO.siteName,
  author,
  publishedTime,
  modifiedTime,
  tags,
  noindex = false,
  canonical,
}: SEOProps): Metadata {
  // Construct full URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourapp.com';
  const fullUrl = url || baseUrl;
  const canonicalUrl = canonical || fullUrl;

  // Construct full image URL
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  // Construct page title
  const pageTitle = title ? `${title} | ${siteName}` : defaultSEO.title;

  const metadata: Metadata = {
    title: pageTitle,
    description: description,
    keywords: tags?.join(', '),
    authors: author ? [{ name: author }] : undefined,
    generator: 'Next.js',
    applicationName: siteName,
    referrer: 'origin-when-cross-origin',
    colorScheme: 'dark light',
    creator: author,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: type,
      siteName: siteName,
      title: title || defaultSEO.title,
      description: description,
      url: fullUrl,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: title || defaultSEO.title,
      description: description,
      images: [fullImageUrl],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      nocache: false,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    other: {
      'theme-color': '#000000',
      'msapplication-TileColor': '#000000',
    },
  };

  return metadata;
}

// Client-side SEO component for dynamic content
interface ClientSEOProps extends SEOProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  structuredData?: Record<string, any>;
}

export function ClientSEO({
  title,
  structuredData,
  siteName = defaultSEO.siteName,
}: ClientSEOProps) {
  useEffect(() => {
    // Update document title dynamically
    if (title) {
      document.title = `${title} | ${siteName}`;
    }

    // Add structured data if provided
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [title, siteName, structuredData]);

  return null;
}

// Helper function to create structured data
export function createStructuredData({
  type = 'WebPage',
  title,
  description,
  image,
  url,
  author,
  publishedTime,
  modifiedTime,
}: {
  type?: 'WebPage' | 'Article' | 'Organization' | 'Person';
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourapp.com';
  const fullImageUrl =
    image && !image.startsWith('http') ? `${baseUrl}${image}` : image;

  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...(title && { headline: title, name: title }),
    ...(description && { description }),
    ...(fullImageUrl && { image: fullImageUrl }),
    ...(url && { url }),
    ...(author && { author: { '@type': 'Person', name: author } }),
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
  };
}

export { type SEOProps };
