from django.contrib import admin
from .models import Blip, BlipLike, BlipComment

@admin.register(Blip)
class BlipAdmin(admin.ModelAdmin):
    list_display = ('user', 'caption', 'likes_count', 'comments_count', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('caption', 'user__username')

@admin.register(BlipLike)
class BlipLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'blip', 'created_at')
    list_filter = ('created_at',)

@admin.register(BlipComment)
class BlipCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'blip', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'user__username')