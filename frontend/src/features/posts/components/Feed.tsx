import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api';
import { PostItem } from './PostItem';
import { CreatePost } from './CreatePost';
import { Loader2 } from 'lucide-react';

interface FeedProps {
  currentUser: string;
}

export const Feed: React.FC<FeedProps> = ({ currentUser }) => {
  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    refetchInterval: 5000, // simple polling for MVP real-time feel
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-indigo-600">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="font-medium">Loading community...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
        Error loading posts: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-0">
      <CreatePost currentUser={currentUser} />
      
      <div className="space-y-6">
        {posts?.map((post) => (
          <PostItem key={post.id} post={post} currentUser={currentUser} />
        ))}
        {(!posts || posts.length === 0) && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
            <p className="text-gray-500">Be the first parent to share a query!</p>
          </div>
        )}
      </div>
    </div>
  );
};
