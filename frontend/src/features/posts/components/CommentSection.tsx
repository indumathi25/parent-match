import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, MessageCircle, LogIn } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import type { Comment } from '../types';
import { createComment } from '../api';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUser: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, currentUser }) => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [content, setContent] = useState('');
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: async (newComment: { content: string; author_name: string }) => {
      const token = await getAccessTokenSilently();
      return createComment(postId, newComment, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setContent('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    commentMutation.mutate({ content, author_name: currentUser });
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-3">
      <button 
        onClick={() => setShowComments(!showComments)}
        className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-3 font-medium"
      >
        <MessageCircle size={18} className="mr-1.5" />
        {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
      </button>

      {showComments && (
        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3 text-sm flex flex-col group">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-gray-800">{comment.author_name}</span>
                <span className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
                  {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-2 italic">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      )}

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex items-center relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Add a comment as ${currentUser}...`}
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-12 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
            disabled={commentMutation.isPending}
          />
          <button
            type="submit"
            disabled={!content.trim() || commentMutation.isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Send size={18} className={commentMutation.isPending ? 'opacity-50' : ''} />
          </button>
        </form>
      ) : (
        <button 
          onClick={() => loginWithRedirect()}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-full border border-dashed border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-all text-sm font-medium"
        >
          <LogIn size={16} />
          <span>Sign in to join the conversation</span>
        </button>
      )}
    </div>
  );
};
