import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbNoteToApi } from '@/lib/writing';

export async function POST(request: Request) {
  try {
    const { sectionId, body } = await request.json();
    if (!sectionId || !body?.trim()) {
      return NextResponse.json({ error: 'sectionId and body are required' }, { status: 400 });
    }
    const note = await prisma.note.create({ data: { sectionId, body: body.trim() } });
    return NextResponse.json(dbNoteToApi(note), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
