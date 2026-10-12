import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.hourlyQuickAdd.deleteMany({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/hourly/quick-adds/[id] error:', e);
    return NextResponse.json({ error: 'Failed to delete quick-add' }, { status: 500 });
  }
}
