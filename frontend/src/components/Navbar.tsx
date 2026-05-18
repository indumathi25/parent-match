import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Users, LogIn } from 'lucide-react';
import { UserDropdown } from './UserDropdown';

export const Navbar: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-indigo-600 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          <Users className="mr-2" />
          Parent Match
        </button>

        <div className="flex items-center">
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <button
              onClick={() => loginWithRedirect().catch(console.error)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              <LogIn size={18} />
              <span className="font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
