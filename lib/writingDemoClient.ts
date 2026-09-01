import { ApiProject, ApiSection, ApiNote, ProjectType } from '@/lib/writing';
import { generateId } from '@/lib/storage';
import { WritingClient } from '@/lib/writingClient';

const PROJECTS_KEY = 'ccc_demo_writing_projects';
const SECTIONS_KEY = 'ccc_demo_writing_sections';
const NOTES_KEY = 'ccc_demo_writing_notes';

function read<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}
function write<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

function paragraph(text: string) {
  return { type: 'paragraph', content: [{ type: 'text', text }] };
}

function seed(): { projects: ApiProject[]; sections: ApiSection[]; notes: ApiNote[] } {
  const now = new Date().toISOString();
  const projectId = generateId();
  const sectionOneId = generateId();
  const sectionTwoId = generateId();

  const projects: ApiProject[] = [
    { id: projectId, title: 'The Lighthouse Keeper', type: 'NOVEL', createdAt: now, updatedAt: now },
  ];

  const sections: ApiSection[] = [
    {
      id: sectionOneId,
      projectId,
      title: 'Chapter One: The Signal',
      order: 0,
      createdAt: now,
      updatedAt: now,
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'The Signal' }] },
          paragraph('The lamp had burned for eleven nights straight when Mira first noticed the pattern in the static — three short pulses, then a pause exactly nine seconds long, over and over, like something out there was trying very hard to be polite about interrupting.'),
          paragraph('She almost didn’t write it down. Almost.'),
        ],
      },
      notes: [],
    },
    {
      id: sectionTwoId,
      projectId,
      title: 'Chapter Two: Low Tide',
      order: 1,
      createdAt: now,
      updatedAt: now,
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Low Tide' }] },
          paragraph('By morning the tide had pulled back further than anyone remembered it going, leaving the rocks slick and strange under a sky the color of an old bruise.'),
        ],
      },
      notes: [],
    },
  ];

  const notes: ApiNote[] = [
    { id: generateId(), sectionId: sectionOneId, body: 'Keep the pulse pattern consistent — 3 short, 9s pause — it pays off in Ch. 7.', createdAt: now },
  ];

  write(PROJECTS_KEY, projects);
  write(SECTIONS_KEY, sections);
  write(NOTES_KEY, notes);

  return { projects, sections, notes };
}

function loadAll() {
  const projects = read<ApiProject>(PROJECTS_KEY);
  if (projects.length === 0) return seed();
  return { projects, sections: read<ApiSection>(SECTIONS_KEY), notes: read<ApiNote>(NOTES_KEY) };
}

export function resetWritingDemo() {
  localStorage.removeItem(PROJECTS_KEY);
  localStorage.removeItem(SECTIONS_KEY);
  localStorage.removeItem(NOTES_KEY);
  seed();
}

export const demoWritingClient: WritingClient = {
  async listProjects() {
    const { projects, sections } = loadAll();
    return projects.map((p) => ({
      ...p,
      sectionCount: sections.filter((s) => s.projectId === p.id).length,
    }));
  },

  async createProject(title, type: ProjectType) {
    const { projects } = loadAll();
    const now = new Date().toISOString();
    const project: ApiProject = { id: generateId(), title, type, createdAt: now, updatedAt: now };
    write(PROJECTS_KEY, [project, ...projects]);
    return project;
  },

  async deleteProject(id) {
    const { projects, sections, notes } = loadAll();
    const sectionIds = new Set(sections.filter((s) => s.projectId === id).map((s) => s.id));
    write(PROJECTS_KEY, projects.filter((p) => p.id !== id));
    write(SECTIONS_KEY, sections.filter((s) => s.projectId !== id));
    write(NOTES_KEY, notes.filter((n) => !sectionIds.has(n.sectionId)));
  },

  async getProject(id) {
    const { projects, sections } = loadAll();
    const project = projects.find((p) => p.id === id);
    if (!project) return null;
    return {
      ...project,
      sections: sections.filter((s) => s.projectId === id).sort((a, b) => a.order - b.order),
    };
  },

  async createSection(projectId, title) {
    const { sections } = loadAll();
    const now = new Date().toISOString();
    const order = sections.filter((s) => s.projectId === projectId).length;
    const section: ApiSection = { id: generateId(), projectId, title, content: {}, order, createdAt: now, updatedAt: now };
    write(SECTIONS_KEY, [...sections, section]);
    return section;
  },

  async deleteSection(id) {
    const { sections, notes } = loadAll();
    write(SECTIONS_KEY, sections.filter((s) => s.id !== id));
    write(NOTES_KEY, notes.filter((n) => n.sectionId !== id));
  },

  async reorderSections(projectId, orderedIds) {
    const { sections } = loadAll();
    const orderIndex = new Map(orderedIds.map((id, i) => [id, i]));
    const next = sections.map((s) =>
      s.projectId === projectId && orderIndex.has(s.id) ? { ...s, order: orderIndex.get(s.id)! } : s
    );
    write(SECTIONS_KEY, next);
  },

  async getSection(id) {
    const { sections, notes } = loadAll();
    const section = sections.find((s) => s.id === id);
    if (!section) return null;
    return { ...section, notes: notes.filter((n) => n.sectionId === id) };
  },

  async updateSectionContent(id, content) {
    const { sections } = loadAll();
    write(SECTIONS_KEY, sections.map((s) => (s.id === id ? { ...s, content, updatedAt: new Date().toISOString() } : s)));
    return true;
  },

  async updateSectionTitle(id, title) {
    const { sections } = loadAll();
    write(SECTIONS_KEY, sections.map((s) => (s.id === id ? { ...s, title, updatedAt: new Date().toISOString() } : s)));
    return true;
  },

  async createNote(sectionId, body) {
    const { notes } = loadAll();
    const note: ApiNote = { id: generateId(), sectionId, body, createdAt: new Date().toISOString() };
    write(NOTES_KEY, [...notes, note]);
    return note;
  },

  async deleteNote(id) {
    const { notes } = loadAll();
    write(NOTES_KEY, notes.filter((n) => n.id !== id));
  },
};
