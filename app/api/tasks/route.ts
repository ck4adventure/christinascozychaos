import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFlowerForCategory } from '@/lib/data';
import { Category, Frequency } from '@/types';

export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json({ tasks: tasks.map(dbTaskToApi) });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, category, frequency, dayOfWeek, dayOfMonth, emoji } = body;

  const flower = getFlowerForCategory(category as Category);

  const task = await prisma.task.create({
    data: {
      name,
      category,
      frequency,
      dayOfWeek: dayOfWeek ?? null,
      dayOfMonth: dayOfMonth ?? null,
      emoji: emoji ?? null,
      flower,
    },
  });

  return NextResponse.json({ task: dbTaskToApi(task) }, { status: 201 });
}

function dbTaskToApi(task: {
  id: string;
  name: string;
  category: string;
  frequency: string;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  emoji: string | null;
  flower: string;
  createdAt: Date;
}) {
  return {
    id: task.id,
    name: task.name,
    category: task.category as Category,
    frequency: task.frequency as Frequency,
    dayOfWeek: task.dayOfWeek ?? undefined,
    dayOfMonth: task.dayOfMonth ?? undefined,
    emoji: task.emoji ?? undefined,
    flower: task.flower,
    createdAt: task.createdAt.toISOString(),
  };
}
