import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

export async function GET(_request: NextRequest) {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: env.NEXT_PUBLIC_APP_VERSION,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      // Add more health checks as needed
      services: {
        database: await checkDatabase(),
        external_api: await checkExternalAPI(),
      },
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

async function checkDatabase(): Promise<string> {
  // Implement database health check
  try {
    // Example: await db.raw('SELECT 1');
    return 'healthy';
  } catch (_error) {
    return 'unhealthy';
  }
}

async function checkExternalAPI(): Promise<string> {
  // Implement external API health check
  try {
    // Example: await fetch('https://api.example.com/health');
    return 'healthy';
  } catch (_error) {
    return 'unhealthy';
  }
}
