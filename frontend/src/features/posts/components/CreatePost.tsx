import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { createPost } from '../api';
import { PenSquare, Send, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['General', 'Health', 'Schooling', 'Behavior', 'Sleep'];

interface CreatePostProps {
  currentUser: string;
}

export const CreatePost: React.FC<CreatePostProps> = ({ currentUser }) => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: async (newPost: { title: string | null; content: string; category: string; author_name: string }) => {
      const token = await getAccessTokenSilently();
      return createPost(newPost, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setContent('');
      setIsOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutation.mutate({ title: null, content, category, author_name: currentUser });
  };

  if (!isAuthenticated) {
    return (
      <div className="mb-8">
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-center text-indigo-600 hover:shadow-md transition-all group border-dashed"
        >
          <LogIn size={20} className="mr-2" />
          <span className="text-[15px] font-medium">Sign in to ask a question or share a thought</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center text-gray-500 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4 group-hover:bg-indigo-100 transition-colors">
            <PenSquare size={20} className="text-indigo-600" />
          </div>
          <span className="text-[15px] font-medium">Ask a question or share a thought, {currentUser}...</span>
        </button>
      ) : (
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-md border border-indigo-100 p-5 overflow-hidden relative"
          onSubmit={handleSubmit}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 shadow-inner">
              {currentUser.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 leading-none">{currentUser}</h3>
              <p className="text-xs text-gray-500 mt-1">Posting publicly</p>
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Ask the community..."
            className="w-full h-32 resize-none border-2 border-transparent focus:border-indigo-500 rounded-lg bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 text-lg p-4 outline-none transition-all"
            style={{ caretColor: '#4f46e5' }}
            disabled={mutation.isPending}
          />
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    category === cat 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim() || mutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center"
              >
                {mutation.isPending ? 'Posting...' : 'Post'}
                {!mutation.isPending && <Send size={14} className="ml-2" />}
              </button>
            </div>
          </div>
        </motion.form>
      )}
    </div>
  );
};
