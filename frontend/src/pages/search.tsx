import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Search, Users, User, Hash } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'communities' | 'posts'>('all');

  // Mock data - in real app, this would come from API
  const mockResults = {
    people: [
      { id: 1, name: 'John Doe', username: 'johndoe', college: 'Stanford University' },
      { id: 2, name: 'Jane Smith', username: 'janesmith', college: 'MIT' },
    ],
    communities: [
      { id: 1, name: 'Computer Science Club', members: 245, college: 'Stanford University' },
      { id: 2, name: 'Basketball Team', members: 32, college: 'MIT' },
    ],
    posts: [
      { id: 1, content: 'Just finished my final project! #computerscience #coding', author: 'johndoe' },
      { id: 2, content: 'Great game yesterday! #basketball #team', author: 'janesmith' },
    ],
  };

  const tabs = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'people', label: 'People', icon: User },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'posts', label: 'Posts', icon: Hash },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Search</h1>

      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search for people, communities, or posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-lg py-6"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Results */}
      <div className="space-y-6">
        {(activeTab === 'all' || activeTab === 'people') && (
          <div>
            <h3 className="text-lg font-semibold mb-4">People</h3>
            <div className="space-y-3">
              {mockResults.people.map((person) => (
                <Card key={person.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src="/default-avatar.png"
                        alt={person.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">{person.name}</h4>
                        <p className="text-gray-600 text-sm">@{person.username}</p>
                        <p className="text-gray-500 text-sm">{person.college}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'communities') && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Communities</h3>
            <div className="space-y-3">
              {mockResults.communities.map((community) => (
                <Card key={community.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src="/default-community.png"
                        alt={community.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{community.name}</h4>
                        <p className="text-gray-600 text-sm">{community.members} members</p>
                        <p className="text-gray-500 text-sm">{community.college}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'posts') && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Posts</h3>
            <div className="space-y-3">
              {mockResults.posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <p className="text-gray-800 mb-2">{post.content}</p>
                    <p className="text-gray-500 text-sm">by @{post.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searchQuery && (
          <div className="text-center py-12 text-gray-500">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p>Try adjusting your search terms or explore different categories</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;