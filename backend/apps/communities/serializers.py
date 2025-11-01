from rest_framework import serializers
from .models import Community, CommunityMembership
from apps.users.serializers import UserProfileSerializer

class CommunityMembershipSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = CommunityMembership
        fields = '__all__'
        read_only_fields = ('user', 'community', 'joined_at')

class CommunitySerializer(serializers.ModelSerializer):
    created_by = UserProfileSerializer(read_only=True)
    members_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    
    class Meta:
        model = Community
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at')
    
    def get_members_count(self, obj):
        return obj.memberships.count()
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.memberships.filter(user=request.user).exists()
        return False
    
    def get_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            membership = obj.memberships.filter(user=request.user).first()
            return membership.role if membership else None
        return None

class CreateCommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ('name', 'description', 'college', 'cover_image', 'avatar')
    
    def create(self, validated_data):
        request = self.context.get('request')
        community = Community.objects.create(
            created_by=request.user,
            **validated_data
        )
        # Make creator an admin
        CommunityMembership.objects.create(
            user=request.user,
            community=community,
            role=CommunityMembership.ADMIN
        )
        return community