import { NextRequest, NextResponse } from 'next/server';

import { generateSitemap } from '@/lib/sitemap';

export async function GET(_request: NextRequest) {
  try {
    const sitemap = await generateSitemap();

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
