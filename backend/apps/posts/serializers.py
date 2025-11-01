from rest_framework import serializers
from .models import Post, Like, Comment
from apps.users.serializers import UserProfileSerializer

class CommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('user', 'post', 'created_at', 'updated_at')

class PostSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('author', 'likes_count', 'comments_count', 'created_at', 'updated_at')
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('content', 'post_type', 'media_file', 'community')