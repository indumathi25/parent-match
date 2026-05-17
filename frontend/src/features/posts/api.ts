import type { Post, Comment } from './types';

const API_BASE_URL = '/api/v1';

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts/`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

export const createPost = async (
  post: { title: string | null; content: string; category: string; author_name: string },
  accessToken?: string
): Promise<Post> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  const response = await fetch(`${API_BASE_URL}/posts/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
};

export const createComment = async (
  postId: string,
  comment: { content: string; author_name: string },
  accessToken?: string
): Promise<Comment> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers,
    body: JSON.stringify(comment),
  });
  if (!response.ok) {
    throw new Error('Failed to create comment');
  }
  return response.json();
};
