import { Project, Section, Note, ProjectType } from '@prisma/client';

export type { ProjectType };

export interface ApiProject {
  id: string;
  title: string;
  type: ProjectType;
  createdAt: string;
  updatedAt: string;
  sectionCount?: number;
}

export interface ApiSection {
  id: string;
  projectId: string;
  title: string;
  content: unknown;
  order: number;
  createdAt: string;
  updatedAt: string;
  notes?: ApiNote[];
}

export interface ApiNote {
  id: string;
  sectionId: string;
  body: string;
  createdAt: string;
}

export function dbProjectToApi(project: Project & { sections?: Section[] }): ApiProject {
  return {
    id: project.id,
    title: project.title,
    type: project.type,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    sectionCount: project.sections?.length,
  };
}

export function dbSectionToApi(section: Section & { notes?: Note[] }): ApiSection {
  return {
    id: section.id,
    projectId: section.projectId,
    title: section.title,
    content: section.content,
    order: section.order,
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString(),
    notes: section.notes?.map(dbNoteToApi),
  };
}

export function dbNoteToApi(note: Note): ApiNote {
  return {
    id: note.id,
    sectionId: note.sectionId,
    body: note.body,
    createdAt: note.createdAt.toISOString(),
  };
}
