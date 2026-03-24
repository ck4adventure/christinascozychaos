import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
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
}

export async function POST(request: Request) {
  const { taskId } = await request.json();

  const log = await prisma.taskLog.create({
    data: { taskId },
  });

  return NextResponse.json(
    { log: { id: log.id, taskId: log.taskId, completedAt: log.completedAt.toISOString() } },
    { status: 201 }
  );
}
