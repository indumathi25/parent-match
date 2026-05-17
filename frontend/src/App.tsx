import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Feed } from './features/posts/components/Feed';
import { Users, Heart, LogIn, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const { user, isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Navigation Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center text-indigo-600 font-bold text-xl tracking-tight">
              <Users className="mr-2" />
              Parent Match
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  {user?.picture && (
                    <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />
                  )}
                  <button 
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Log Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
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

        {/* Main Content */}
        <main className="pb-20">
          <Feed currentUser={user?.name || 'Guest'} />
        </main>
        
        {/* Footer/Bottom spacing for mobile feel */}
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-3 flex justify-center text-gray-400 text-xs sm:hidden">
          <p className="flex items-center">Made with <Heart size={12} className="mx-1 text-red-400" /> for parents</p>
        </div>
      </div>
  );
};

export default App;
