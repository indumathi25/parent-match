import React from 'react';
import { motion } from 'framer-motion';
import type { Post } from '../types';
import { CommentSection } from './CommentSection';
import { Tag } from 'lucide-react';

interface PostItemProps {
  post: Post;
  currentUser: string;
}

export const PostItem: React.FC<PostItemProps> = ({ post, currentUser }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner">
            {post.author_name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900 leading-none">{post.author_name}</h3>
            <span className="text-xs text-gray-500 mt-1 block">
              {new Date(post.created_at).toLocaleDateString(undefined, { 
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          <Tag size={12} className="text-indigo-600 mr-1.5" />
          <span className="text-xs font-medium text-indigo-700 capitalize">{post.category}</span>
        </div>
      </div>
      
      {post.title && <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{post.title}</h2>}
      
      <p className="text-gray-700 mb-5 leading-relaxed whitespace-pre-line text-[15px]">
        {post.content}
      </p>

      <CommentSection postId={post.id} comments={post.comments} currentUser={currentUser} />
    </motion.div>
  );
};
