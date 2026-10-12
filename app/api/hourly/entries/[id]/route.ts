import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeTags } from '@/lib/hourly';
import { dbEntryToApi, parseDate } from '@/lib/hourlyApi';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const message = body.message === undefined ? undefined : String(body.message).trim();
    if (message === '') {
      return NextResponse.json({ error: 'message cannot be empty' }, { status: 400 });
    }
    const tags = body.tags === undefined ? undefined : normalizeTags(body.tags);
    const loggedAt = body.loggedAt === undefined ? undefined : parseDate(body.loggedAt);
    if (loggedAt === null) {
      return NextResponse.json({ error: 'loggedAt must be an ISO date' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.hourlyEntry.findUnique({ where: { id } });
      if (!current) return null;

      const changed =
        (message !== undefined && message !== current.message) ||
        (tags !== undefined && tags.join('\u0000') !== current.tags.join('\u0000')) ||
        (loggedAt !== undefined && loggedAt.getTime() !== current.loggedAt.getTime());

      if (!changed) {
        return { entry: current, editCount: await tx.hourlyEdit.count({ where: { entryId: id } }) };
      }

      await tx.hourlyEdit.create({
        data: {
          entryId: id,
          prevMessage: current.message,
          prevTags: current.tags,
          prevLoggedAt: current.loggedAt,
        },
      });
      const entry = await tx.hourlyEntry.update({
        where: { id },
        data: {
          ...(message !== undefined && { message }),
          ...(tags !== undefined && { tags }),
          ...(loggedAt !== undefined && { loggedAt }),
        },
      });
      return { entry, editCount: await tx.hourlyEdit.count({ where: { entryId: id } }) };
    });

    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ entry: dbEntryToApi(result.entry, result.editCount) });
  } catch (e) {
    console.error('PATCH /api/hourly/entries/[id] error:', e);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.hourlyEntry.deleteMany({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/hourly/entries/[id] error:', e);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
