import type { PlantCardProps, PostCardData } from '@/components';

import basil from './assets/post-basil.jpg';
import monstera from './assets/post-monstera.jpg';
import tomato from './assets/post-tomato.jpg';

/**
 * Fixtures for the developer component gallery only. They stand in for
 * user-generated content, so they are data, not UI strings (not in i18n).
 */
export const DEMO_IMAGES = { basil, monstera, tomato } as const;

export const DEMO_PLANTS: (PlantCardProps & { id: string })[] = [
  {
    id: 'p1',
    nickname: 'Tommy the Tomato',
    species: 'Solanum lycopersicum',
    photo: tomato,
    stage: 'fruiting',
    nextTask: { type: 'water', due: { kind: 'today' } },
    health: 'good',
  },
  {
    id: 'p2',
    nickname: 'Monty',
    species: 'Monstera deliciosa',
    photo: monstera,
    stage: 'growing',
    nextTask: { type: 'fertilize', due: { kind: 'overdue', days: 2 } },
    health: 'attention',
  },
  {
    id: 'p3',
    nickname: 'Sweet Basil',
    species: 'Ocimum basilicum',
    photo: basil,
    stage: 'sprout',
    nextTask: { type: 'mist', due: { kind: 'upcoming', days: 3 } },
    health: 'good',
  },
  {
    id: 'p4',
    nickname: 'Mystery seedling',
    species: 'Unknown species',
    photo: null,
    stage: 'seed',
    nextTask: null,
    health: 'critical',
  },
];

export const DEMO_POST: PostCardData = {
  id: 'post-1',
  author: {
    username: 'maya.grows',
    displayName: 'Maya Green',
    avatarUrl: null,
    experience: 'hobbyist',
  },
  createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  media: [tomato, monstera, basil],
  caption:
    'Day 45 and the first cherry tomatoes are blushing! 🍅 Switched to watering every 2 days in the heatwave and it made a huge difference. #FirstHarvest #balconygarden thanks @leo for the tip',
  plant: { name: 'Cherry tomato', day: 45 },
  likesCount: 1284,
  commentsCount: 14,
  liked: false,
  saved: false,
  topComment: { username: 'leo.plants', text: 'Looking amazing! Pinch those suckers 👀' },
};
