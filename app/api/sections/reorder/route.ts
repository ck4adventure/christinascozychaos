import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const { projectId, orderedIds } = await request.json();
    if (!projectId || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'projectId and orderedIds are required' }, { status: 400 });
    }
    await prisma.$transaction(
      (orderedIds as string[]).map((id: string, index: number) =>
        prisma.section.update({ where: { id }, data: { order: index } })
      )
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to reorder sections' }, { status: 500 });
  }
}
