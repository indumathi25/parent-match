import type { UserProfile } from './types';
import type { Post } from '../posts/types';

const API_BASE_URL = '/api/v1';

export const upsertUser = async (accessToken: string): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error('Failed to upsert user');
  return response.json();
};

export const fetchMyProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const fetchMyPosts = async (accessToken: string): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/users/me/posts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
};
