import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const start = Date.now();
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const status = dbOk ? 200 : 503;
  return NextResponse.json(
    {
      status: dbOk ? 'ok' : 'degraded',
      service: 'pet-farewell-vn',
      version: process.env.npm_package_version ?? '0.1.0',
      uptimeSec: Math.round(process.uptime()),
      dbLatencyMs: Date.now() - start,
      checks: { database: dbOk },
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}
