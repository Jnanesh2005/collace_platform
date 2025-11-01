from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from .models import Community, CommunityMembership
from .serializers import (CommunitySerializer, CreateCommunitySerializer, 
                         CommunityMembershipSerializer)

class CommunityListView(generics.ListAPIView):
    serializer_class = CommunitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_college = self.request.user.college
        return Community.objects.filter(college=user_college)

class CommunitySearchView(generics.ListAPIView):
    serializer_class = CommunitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        user_college = self.request.user.college
        return Community.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query),
            college=user_college
        )[:20]

class CreateCommunityView(generics.CreateAPIView):
    queryset = Community.objects.all()
    serializer_class = CreateCommunitySerializer
    permission_classes = [IsAuthenticated]

class CommunityDetailView(generics.RetrieveAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_community(request, community_id):
    try:
        community = Community.objects.get(id=community_id)
        membership, created = CommunityMembership.objects.get_or_create(
            user=request.user,
            community=community,
            defaults={'role': CommunityMembership.MEMBER}
        )
        
        if created:
            serializer = CommunityMembershipSerializer(membership)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Already a member'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Community.DoesNotExist:
        return Response({'error': 'Community not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def leave_community(request, community_id):
    try:
        community = Community.objects.get(id=community_id)
        membership = CommunityMembership.objects.filter(
            user=request.user,
            community=community
        ).first()
        
        if membership:
            membership.delete()
            return Response({'status': 'left community'})
        else:
            return Response({'error': 'Not a member'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Community.DoesNotExist:
        return Response({'error': 'Community not found'}, status=status.HTTP_404_NOT_FOUND)

class CommunityMembersView(generics.ListAPIView):
    serializer_class = CommunityMembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        community_id = self.kwargs['community_id']
        return CommunityMembership.objects.filter(community_id=community_id)