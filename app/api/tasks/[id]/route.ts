import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category, Frequency } from '@/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, category, frequency, dayOfWeek, dayOfMonth, emoji } = body;

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(category !== undefined && { category }),
      ...(frequency !== undefined && { frequency }),
      ...(dayOfWeek !== undefined && { dayOfWeek }),
      ...(dayOfMonth !== undefined && { dayOfMonth }),
      ...(emoji !== undefined && { emoji }),
    },
  });

  return NextResponse.json({
    task: {
      id: task.id,
      name: task.name,
      category: task.category as Category,
      frequency: task.frequency as Frequency,
      dayOfWeek: task.dayOfWeek ?? undefined,
      dayOfMonth: task.dayOfMonth ?? undefined,
      emoji: task.emoji ?? undefined,
      flower: task.flower,
      createdAt: task.createdAt.toISOString(),
    },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
