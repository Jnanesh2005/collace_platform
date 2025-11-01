from django.contrib import admin
from .models import Community, CommunityMembership

@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ('name', 'college', 'is_official', 'created_by', 'created_at')
    list_filter = ('college', 'is_official', 'created_at')
    search_fields = ('name', 'description', 'college')

@admin.register(CommunityMembership)
class CommunityMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'community', 'role', 'joined_at')
    list_filter = ('role', 'joined_at')
    search_fields = ('user__username', 'community__name')