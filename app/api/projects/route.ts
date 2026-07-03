import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbProjectToApi } from '@/lib/writing';
import { ProjectType } from '@prisma/client';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { sections: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects.map(dbProjectToApi));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, type } = await request.json();
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const projectType: ProjectType = type === 'SHORT_STORY_COLLECTION' ? 'SHORT_STORY_COLLECTION' : 'NOVEL';
    const project = await prisma.project.create({
      data: { title: title.trim(), type: projectType },
      include: { sections: true },
    });
    return NextResponse.json(dbProjectToApi(project), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
