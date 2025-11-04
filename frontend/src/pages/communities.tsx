import React, { useState } from 'react';
import { useCommunities } from '../hooks/use-communities';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Plus, Search } from 'lucide-react';

const Communities: React.FC = () => {
  const { communities, loading, error, joinCommunity, leaveCommunity } = useCommunities();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinCommunity = async (communityId: number) => {
    try {
      await joinCommunity(communityId);
    } catch (err) {
      console.error('Failed to join community:', err);
    }
  };

  const handleLeaveCommunity = async (communityId: number) => {
    try {
      await leaveCommunity(communityId);
    } catch (err) {
      console.error('Failed to leave community:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading communities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover and join communities at your college
          </p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Create Community
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Communities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <Card key={community.id} className="overflow-hidden">
            <div 
              className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"
              style={{
                // --- UPDATE THIS LINE ---
                backgroundImage: community.cover_image_url ? `url(${community.cover_image_url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 -mt-12">
                  <img
                    // --- UPDATE THIS LINE ---
                    src={community.avatar_url || '/default-community.png'}
                    alt={community.name}
                    className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 bg-white"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{community.name}</h3>
                    {community.is_official && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Official
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {community.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{community.members_count} members</span>
                </div>
                <span>{community.college}</span>
              </div>

              {community.is_member ? (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleLeaveCommunity(community.id)}
                >
                  Leave Community
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => handleJoinCommunity(community.id)}
                >
                  Join Community
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <Users size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No communities found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Be the first to create a community!'}
          </p>
          <Button>
            <Plus size={16} className="mr-2" />
            Create Community
          </Button>
        </div>
      )}
    </div>
  );
};

export default Communities;