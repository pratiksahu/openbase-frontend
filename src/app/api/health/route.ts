import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current health status of the API and its dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                 memory:
 *                   type: object
 *                 services:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                     external_api:
 *                       type: string
 *       503:
 *         description: API is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
  } catch {
    return 'unhealthy';
  }
}

async function checkExternalAPI(): Promise<string> {
  // Implement external API health check
  try {
    // Example: await fetch('https://api.example.com/health');
    return 'healthy';
  } catch {
    return 'unhealthy';
  }
}
