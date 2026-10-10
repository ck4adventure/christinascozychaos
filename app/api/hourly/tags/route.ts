import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<{ tag: string; count: bigint }[]>`
      SELECT tag, COUNT(*) AS count
      FROM "HourlyEntry", unnest("tags") AS tag
      GROUP BY tag
      ORDER BY count DESC, tag ASC
    `;
    return NextResponse.json({ tags: rows.map((r) => ({ tag: r.tag, count: Number(r.count) })) });
  } catch (e) {
    console.error('GET /api/hourly/tags error:', e);
    return NextResponse.json({ error: 'Failed to load tags' }, { status: 500 });
  }
}
