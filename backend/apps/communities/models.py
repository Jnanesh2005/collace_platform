from django.db import models

# Create your models here.
from django.db import models
from apps.users.models import User

class Community(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    college = models.CharField(max_length=255)
    is_official = models.BooleanField(default=False)
    cover_image = models.ImageField(upload_to='communities/covers/', null=True, blank=True)
    avatar = models.ImageField(upload_to='communities/avatars/', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_communities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['name', 'college']
        verbose_name_plural = 'Communities'

    def __str__(self):
        return f"{self.name} - {self.college}"

class CommunityMembership(models.Model):
    MEMBER = 'member'
    ADMIN = 'admin'
    MODERATOR = 'moderator'
    
    ROLE_CHOICES = [
        (MEMBER, 'Member'),
        (ADMIN, 'Admin'),
        (MODERATOR, 'Moderator'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_memberships')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'community']