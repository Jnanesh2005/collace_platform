from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Friendship

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'college', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'college', 'created_at')
    fieldsets = UserAdmin.fieldsets + (
        ('College Info', {'fields': ('college', 'bio', 'avatar', 'cover_image', 'is_verified')}),
    )

@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'status', 'created_at')
    list_filter = ('status', 'created_at')