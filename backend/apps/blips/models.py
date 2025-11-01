from django.db import models
from apps.users.models import User

class Blip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blips')
    video = models.FileField(upload_to='blips/videos/')
    thumbnail = models.ImageField(upload_to='blips/thumbnails/', null=True, blank=True)
    caption = models.TextField(blank=True)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    shares_count = models.IntegerField(default=0)
    duration = models.FloatField(default=0)  # in seconds
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Blip by {self.user.username} - {self.caption[:20]}"

class BlipLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    blip = models.ForeignKey(Blip, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'blip']

    def __str__(self):
        return f"{self.user.username} liked Blip {self.blip.id}"

class BlipComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    blip = models.ForeignKey(Blip, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.user.username} on Blip {self.blip.id}"