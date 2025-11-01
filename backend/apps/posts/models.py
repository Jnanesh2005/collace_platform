from django.db import models
from apps.users.models import User
from apps.communities.models import Community

class Post(models.Model):
    TEXT = 'text'
    IMAGE = 'image'
    VIDEO = 'video'
    POLL = 'poll'
    
    POST_TYPES = [
        (TEXT, 'Text'),
        (IMAGE, 'Image'),
        (VIDEO, 'Video'),
        (POLL, 'Poll'),
    ]
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, null=True, blank=True, related_name='posts')
    content = models.TextField()
    post_type = models.CharField(max_length=10, choices=POST_TYPES, default=TEXT)
    media_file = models.FileField(upload_to='posts/media/', null=True, blank=True)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'post']

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']