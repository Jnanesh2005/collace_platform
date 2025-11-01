from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Blip, BlipLike, BlipComment
from .serializers import (BlipSerializer, CreateBlipSerializer, 
                         BlipCommentSerializer, BlipLikeSerializer)

class BlipListView(generics.ListAPIView):
    serializer_class = BlipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Blip.objects.all().order_by('-created_at')[:50]

class CreateBlipView(generics.CreateAPIView):
    queryset = Blip.objects.all()
    serializer_class = CreateBlipSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_blip(request, blip_id):
    try:
        blip = Blip.objects.get(id=blip_id)
        like, created = BlipLike.objects.get_or_create(user=request.user, blip=blip)
        
        if created:
            blip.likes_count += 1
            blip.save()
            return Response({'status': 'liked'}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            blip.likes_count -= 1
            blip.save()
            return Response({'status': 'unliked'})
    
    except Blip.DoesNotExist:
        return Response({'error': 'Blip not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_blip_comment(request, blip_id):
    try:
        blip = Blip.objects.get(id=blip_id)
        serializer = BlipCommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user, blip=blip)
            blip.comments_count += 1
            blip.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Blip.DoesNotExist:
        return Response({'error': 'Blip not found'}, status=status.HTTP_404_NOT_FOUND)

class UserBlipsView(generics.ListAPIView):
    serializer_class = BlipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Blip.objects.filter(user_id=user_id).order_by('-created_at')