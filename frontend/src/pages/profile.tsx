import React from 'react';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Settings, Edit, Users } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-6 overflow-hidden">
        <div 
          className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"
          style={{
            backgroundImage: user.cover_image ? `url(${user.cover_image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6 -mt-16">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white"
              />
              <div className="mt-12">
                <h1 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  @{user.username}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {user.college}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {user.bio && (
            <div className="mt-6">
              <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
            </div>
          )}

          <div className="flex space-x-6 mt-6 text-sm">
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span className="font-semibold">247</span>
              <span className="text-gray-600 dark:text-gray-400">Friends</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold">156</span>
              <span className="text-gray-600 dark:text-gray-400">Posts</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold">42</span>
              <span className="text-gray-600 dark:text-gray-400">Communities</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">About</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Member since</p>
                <p className="text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="text-sm">
                  {user.is_verified ? 'Verified Student' : 'Pending Verification'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">Actions</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={logout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity to show</p>
                <p className="text-sm mt-2">Your posts and interactions will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;