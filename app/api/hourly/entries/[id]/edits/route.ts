import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbEditToApi } from '@/lib/hourlyApi';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const edits = await prisma.hourlyEdit.findMany({
      where: { entryId: id },
      orderBy: { editedAt: 'asc' },
    });
    return NextResponse.json({ edits: edits.map(dbEditToApi) });
  } catch (e) {
    console.error('GET /api/hourly/entries/[id]/edits error:', e);
    return NextResponse.json({ error: 'Failed to load edit history' }, { status: 500 });
  }
}
