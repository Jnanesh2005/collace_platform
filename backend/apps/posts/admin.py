from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Post, Like, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('author', 'post_type', 'likes_count', 'comments_count', 'created_at')
    list_filter = ('post_type', 'created_at')
    search_fields = ('content', 'author__username')

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'user__username')