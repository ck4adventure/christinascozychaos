import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbSectionToApi } from '@/lib/writing';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const section = await prisma.section.findUnique({
      where: { id },
      include: { notes: { orderBy: { createdAt: 'asc' } } },
    });
    if (!section) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(dbSectionToApi(section));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: { title?: string; content?: unknown } = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.content !== undefined) data.content = body.content;
    const section = await prisma.section.update({ where: { id }, data });
    return NextResponse.json(dbSectionToApi(section));
  } catch {
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.section.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
