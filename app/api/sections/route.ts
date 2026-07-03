import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbSectionToApi } from '@/lib/writing';

export async function POST(request: Request) {
  try {
    const { projectId, title } = await request.json();
    if (!projectId || !title?.trim()) {
      return NextResponse.json({ error: 'projectId and title are required' }, { status: 400 });
    }
    const last = await prisma.section.findFirst({
      where: { projectId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const nextOrder = (last?.order ?? -1) + 1;
    const section = await prisma.section.create({
      data: { projectId, title: title.trim(), content: {}, order: nextOrder },
    });
    return NextResponse.json(dbSectionToApi(section), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
