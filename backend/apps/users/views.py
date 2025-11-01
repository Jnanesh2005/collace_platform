from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q

from .models import User, Friendship
from .serializers import (UserRegistrationSerializer, UserLoginSerializer, 
                         UserProfileSerializer, FriendshipSerializer)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserSearchView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        return User.objects.filter(
            Q(username__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(college__icontains=query)
        )[:20]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request, user_id):
    try:
        to_user = User.objects.get(id=user_id)
        if to_user == request.user:
            return Response({'error': 'Cannot send friend request to yourself'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        friendship, created = Friendship.objects.get_or_create(
            from_user=request.user,
            to_user=to_user,
            defaults={'status': Friendship.PENDING}
        )
        
        if not created:
            return Response({'error': 'Friend request already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FriendshipSerializer(friendship)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_friend_request(request, friendship_id, action):
    try:
        friendship = Friendship.objects.get(id=friendship_id, to_user=request.user)
        
        if action == 'accept':
            friendship.status = Friendship.ACCEPTED
            friendship.save()
        elif action == 'decline':
            friendship.status = Friendship.DECLINED
            friendship.save()
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FriendshipSerializer(friendship)
        return Response(serializer.data)
    
    except Friendship.DoesNotExist:
        return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)