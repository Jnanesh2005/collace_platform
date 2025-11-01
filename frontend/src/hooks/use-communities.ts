import { useState, useEffect } from 'react';
import { Community } from '../types';
import api from '../services/api';

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/communities/');
      setCommunities(response.data);
    } catch (err) {
      setError('Failed to fetch communities');
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchCommunities = async (query: string) => {
    try {
      const response = await api.get(`/communities/search/?q=${query}`);
      return response.data;
    } catch (err) {
      setError('Failed to search communities');
      throw err;
    }
  };

  const createCommunity = async (communityData: FormData) => {
    try {
      const response = await api.post('/communities/create/', communityData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCommunities(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError('Failed to create community');
      throw err;
    }
  };

  const joinCommunity = async (communityId: number) => {
    try {
      await api.post(`/communities/${communityId}/join/`);
      setCommunities(prev => prev.map(community => 
        community.id === communityId 
          ? { ...community, is_member: true, members_count: community.members_count + 1 }
          : community
      ));
    } catch (err) {
      setError('Failed to join community');
      throw err;
    }
  };

  const leaveCommunity = async (communityId: number) => {
    try {
      await api.post(`/communities/${communityId}/leave/`);
      setCommunities(prev => prev.map(community => 
        community.id === communityId 
          ? { ...community, is_member: false, members_count: community.members_count - 1 }
          : community
      ));
    } catch (err) {
      setError('Failed to leave community');
      throw err;
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return {
    communities,
    loading,
    error,
    fetchCommunities,
    searchCommunities,
    createCommunity,
    joinCommunity,
    leaveCommunity,
  };
};