import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Heart } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Feed } from './features/posts/components/Feed';
import ProfilePage from './pages/ProfilePage';
import { upsertUser } from './features/users/api';

const App: React.FC = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) return;
    getAccessTokenSilently()
      .then((token) => upsertUser(token))
      .catch(console.error);
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Feed currentUser={user?.name || 'Guest'} />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-3 flex justify-center text-gray-400 text-xs sm:hidden">
        <p className="flex items-center">Made with <Heart size={12} className="mx-1 text-red-400" /> for parents</p>
      </div>
    </div>
  );
};

export default App;
