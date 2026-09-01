import { ApiProject, ApiSection, ApiNote, ProjectType } from '@/lib/writing';

/** Data-access boundary for the writing tool — implemented once against the real
 *  DB-backed API, and once entirely in localStorage for the public /writing-demo route. */
export interface WritingClient {
  listProjects(): Promise<ApiProject[]>;
  createProject(title: string, type: ProjectType): Promise<ApiProject | null>;
  deleteProject(id: string): Promise<void>;
  getProject(id: string): Promise<(ApiProject & { sections: ApiSection[] }) | null>;
  createSection(projectId: string, title: string): Promise<ApiSection | null>;
  deleteSection(id: string): Promise<void>;
  reorderSections(projectId: string, orderedIds: string[]): Promise<void>;
  getSection(id: string): Promise<(ApiSection & { notes: ApiNote[] }) | null>;
  updateSectionContent(id: string, content: unknown): Promise<boolean>;
  updateSectionTitle(id: string, title: string): Promise<boolean>;
  createNote(sectionId: string, body: string): Promise<ApiNote | null>;
  deleteNote(id: string): Promise<void>;
}

export const realWritingClient: WritingClient = {
  async listProjects() {
    const res = await fetch('/api/projects');
    if (!res.ok) return [];
    return res.json();
  },

  async createProject(title, type) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, type }),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async deleteProject(id) {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  },

  async getProject(id) {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async createSection(projectId, title) {
    const res = await fetch('/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, title }),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async deleteSection(id) {
    await fetch(`/api/sections/${id}`, { method: 'DELETE' });
  },

  async reorderSections(projectId, orderedIds) {
    await fetch('/api/sections/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, orderedIds }),
    });
  },

  async getSection(id) {
    const res = await fetch(`/api/sections/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async updateSectionContent(id, content) {
    const res = await fetch(`/api/sections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return res.ok;
  },

  async updateSectionTitle(id, title) {
    const res = await fetch(`/api/sections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return res.ok;
  },

  async createNote(sectionId, body) {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionId, body }),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async deleteNote(id) {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  },
};
