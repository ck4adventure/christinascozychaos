import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeTags } from '@/lib/hourly';
import { dbEntryToApi, parseDate } from '@/lib/hourlyApi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = parseDate(searchParams.get('from'));
    const to = parseDate(searchParams.get('to'));
    if (!from || !to) {
      return NextResponse.json({ error: 'from and to are required ISO dates' }, { status: 400 });
    }

    const entries = await prisma.hourlyEntry.findMany({
      where: { loggedAt: { gte: from, lt: to } },
      orderBy: { loggedAt: 'asc' },
      include: { _count: { select: { edits: true } } },
    });
    return NextResponse.json({
      entries: entries.map((e) => dbEntryToApi(e, e._count.edits)),
    });
  } catch (e) {
    console.error('GET /api/hourly/entries error:', e);
    return NextResponse.json({ error: 'Failed to load entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }
    const loggedAt = body.loggedAt === undefined ? new Date() : parseDate(body.loggedAt);
    if (!loggedAt) {
      return NextResponse.json({ error: 'loggedAt must be an ISO date' }, { status: 400 });
    }

    const entry = await prisma.hourlyEntry.create({
      data: { message, tags: normalizeTags(body.tags ?? []), loggedAt },
    });
    return NextResponse.json({ entry: dbEntryToApi(entry) }, { status: 201 });
  } catch (e) {
    console.error('POST /api/hourly/entries error:', e);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
