import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourapp.com';

  const robotsContent = `User-agent: *
Allow: /

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /static/

# Block authentication pages
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

# Allow important pages
Allow: /about
Allow: /contact
Allow: /features
Allow: /pricing
Allow: /blog

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
