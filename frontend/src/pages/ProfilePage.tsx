import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2, MessageSquare, Calendar, Mail, ArrowLeft } from 'lucide-react';
import { fetchMyProfile, fetchMyPosts } from '../features/users/api';
import type { Post } from '../features/posts/types';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchMyProfile(token);
    },
    enabled: isAuthenticated,
  });

  const { data: myPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['my-posts'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchMyPosts(token);
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  const isLoading = profileLoading || postsLoading;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Feed
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full border-2 border-indigo-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Mail size={14} className="mr-1" />
              {user?.email}
            </div>
            {profile && (
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <Calendar size={12} className="mr-1" />
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-sm text-gray-500">
          <MessageSquare size={14} className="mr-1 text-indigo-400" />
          <span><strong className="text-gray-900">{myPosts?.length ?? 0}</strong> posts</span>
        </div>
      </div>

      {/* My Posts */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">My Posts</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-32 text-indigo-600">
          <Loader2 className="animate-spin mr-2" size={20} />
          <span className="text-sm">Loading...</span>
        </div>
      ) : myPosts && myPosts.length > 0 ? (
        <div className="space-y-4">
          {myPosts.map((post: Post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              {post.title && (
                <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
              )}
              <p className="text-gray-700 text-sm">{post.content}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  {post.category}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <MessageSquare size={11} className="mr-1" />
                    {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                  </span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">You haven't posted anything yet.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-indigo-600 text-sm hover:underline"
          >
            Go share something with the community!
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
