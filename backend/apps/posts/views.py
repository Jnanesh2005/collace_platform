from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from .models import Post, Like, Comment
from .serializers import PostSerializer, CreatePostSerializer, CommentSerializer, LikeSerializer

class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Get posts from friends and communities user follows
        return Post.objects.filter(
            Q(author__in=user.friendship_requests_sent.filter(status='accepted').values('to_user')) |
            Q(author__in=user.friendship_requests_received.filter(status='accepted').values('from_user')) |
            Q(community__members=user) |
            Q(author=user)
        ).distinct().order_by('-created_at')

class CreatePostView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = CreatePostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        
        if created:
            post.likes_count += 1
            post.save()
            return Response({'status': 'liked'}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            post.likes_count -= 1
            post.save()
            return Response({'status': 'unliked'})
    
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        serializer = CommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            post.comments_count += 1
            post.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)