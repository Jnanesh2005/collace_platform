from rest_framework import serializers
from .models import Blip, BlipLike, BlipComment
from apps.users.serializers import UserProfileSerializer

class BlipCommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = BlipComment
        fields = '__all__'
        read_only_fields = ('user', 'blip', 'created_at')

class BlipSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    comments = BlipCommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Blip
        fields = '__all__'
        read_only_fields = ('user', 'likes_count', 'comments_count', 'shares_count', 'created_at')
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_video_url(self, obj):
        if obj.video:
            return obj.video.url
        return None
    
    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

class CreateBlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blip
        fields = ('video', 'caption', 'duration', 'thumbnail')
    
    def create(self, validated_data):
        request = self.context.get('request')
        return Blip.objects.create(user=request.user, **validated_data)

class BlipLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlipLike
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class UpdateBlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blip
        fields = ('caption',)
    
    def update(self, instance, validated_data):
        instance.caption = validated_data.get('caption', instance.caption)
        instance.save()
        return instance