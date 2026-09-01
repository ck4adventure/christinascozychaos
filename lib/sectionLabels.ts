import { ProjectType } from '@prisma/client';

export const sectionLabel: Record<ProjectType, { singular: string; plural: string; newLabel: string }> = {
  NOVEL: { singular: 'Chapter', plural: 'Chapters', newLabel: '+ New Chapter' },
  SHORT_STORY_COLLECTION: { singular: 'Story', plural: 'Stories', newLabel: '+ New Story' },
};
