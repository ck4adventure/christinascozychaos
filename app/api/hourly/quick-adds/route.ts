import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_QUICK_ADDS, normalizeTags } from '@/lib/hourly';
import { dbQuickAddToApi } from '@/lib/hourlyApi';

export async function GET() {
  try {
    if ((await prisma.hourlyQuickAdd.count()) === 0) {
      await prisma.hourlyQuickAdd.createMany({
        data: DEFAULT_QUICK_ADDS.map((q, i) => ({ ...q, sortOrder: i })),
        skipDuplicates: true,
      });
    }
    const quickAdds = await prisma.hourlyQuickAdd.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json({ quickAdds: quickAdds.map(dbQuickAddToApi) });
  } catch (e) {
    console.error('GET /api/hourly/quick-adds error:', e);
    return NextResponse.json({ error: 'Failed to load quick-adds' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const label = typeof body.label === 'string' ? body.label.trim() : '';
    if (!label) {
      return NextResponse.json({ error: 'label is required' }, { status: 400 });
    }
    const last = await prisma.hourlyQuickAdd.findFirst({ orderBy: { sortOrder: 'desc' } });
    const quickAdd = await prisma.hourlyQuickAdd.upsert({
      where: { label },
      update: { tags: normalizeTags(body.tags ?? []) },
      create: { label, tags: normalizeTags(body.tags ?? []), sortOrder: (last?.sortOrder ?? -1) + 1 },
    });
    return NextResponse.json({ quickAdd: dbQuickAddToApi(quickAdd) }, { status: 201 });
  } catch (e) {
    console.error('POST /api/hourly/quick-adds error:', e);
    return NextResponse.json({ error: 'Failed to create quick-add' }, { status: 500 });
  }
}
