import React from 'react';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Collace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The premier social media platform dedicated exclusively to fostering vibrant 
            and verified communities within higher education.
          </p>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-200">
                Welcome back, {user.first_name}!
              </p>
              <Button 
                onClick={() => navigate('/feed')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Feed
              </Button>
            </div>
          ) : (
            <div className="space-x-4">
              <Button 
                onClick={() => navigate('/login')}
                size="lg"
                variant="outline"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">College Communities</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with verified students from your college in dedicated communities.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Short Videos</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share and discover campus life through engaging short video content.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Network</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Exclusive access for college students with verified email authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;