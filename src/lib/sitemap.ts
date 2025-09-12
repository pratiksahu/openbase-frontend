import fs from 'fs';
import path from 'path';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourapp.com';

// Static pages that should be included in sitemap
const staticPages: SitemapEntry[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/about', changefreq: 'monthly', priority: 0.8 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
  { loc: '/features', changefreq: 'weekly', priority: 0.8 },
  { loc: '/pricing', changefreq: 'weekly', priority: 0.9 },
  { loc: '/blog', changefreq: 'daily', priority: 0.9 },
  { loc: '/login', changefreq: 'yearly', priority: 0.3 },
  { loc: '/register', changefreq: 'yearly', priority: 0.3 },
];

// Function to get dynamic pages (e.g., blog posts)
async function getDynamicPages(): Promise<SitemapEntry[]> {
  // TODO: Implement logic to fetch dynamic pages from your CMS/database
  // Example for blog posts:
  /*
  const posts = await getBlogPosts();
  return posts.map(post => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.updatedAt,
    changefreq: 'weekly' as const,
    priority: 0.7,
  }));
  */
  return [];
}

function generateSitemapXML(pages: SitemapEntry[]): string {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(page => {
    return `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    ${page.lastmod ? `    <lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `    <changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `    <priority>${page.priority}</priority>` : ''}
  </url>`;
  })
  .join('\n')}
</urlset>`;
  return sitemap;
}

export async function generateSitemap(): Promise<string> {
  const dynamicPages = await getDynamicPages();
  const allPages = [...staticPages, ...dynamicPages];
  return generateSitemapXML(allPages);
}

// Generate sitemap file
export async function writeSitemap(): Promise<void> {
  const sitemap = await generateSitemap();
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
}
