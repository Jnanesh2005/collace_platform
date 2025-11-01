export const API_BASE_URL = 'http://localhost:8000/api';

export const COLLEGES = [
  'Stanford University',
  'MIT',
  'Harvard University',
  'UC Berkeley',
  'University of Michigan',
  'Columbia University',
  'Yale University',
  'Princeton University',
  'University of Chicago',
  'Northwestern University',
];

export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  POLL: 'poll',
} as const;

export const COMMUNITY_ROLES = {
  MEMBER: 'member',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
} as const;