import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');

    const where = since ? { completedAt: { gte: new Date(since) } } : {};
    const logs = await prisma.taskLog.findMany({ where, orderBy: { completedAt: 'desc' } });

    return NextResponse.json({
      logs: logs.map((l) => ({
        id: l.id,
        taskId: l.taskId,
        completedAt: l.completedAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error('GET /api/logs error:', e);
    return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { taskId } = await request.json();

    const log = await prisma.taskLog.create({
      data: { taskId },
    });

    return NextResponse.json(
      { log: { id: log.id, taskId: log.taskId, completedAt: log.completedAt.toISOString() } },
      { status: 201 }
    );
  } catch (e) {
    console.error('POST /api/logs error:', e);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}
