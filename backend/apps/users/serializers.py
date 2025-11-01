from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Friendship

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'college', 'first_name', 'last_name')
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            college=validated_data['college'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')
        
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'college', 'first_name', 
                 'last_name', 'bio', 'avatar', 'cover_image', 'is_verified',
                 'created_at')
        read_only_fields = ('id', 'email', 'is_verified', 'created_at')

class FriendshipSerializer(serializers.ModelSerializer):
    from_user = UserProfileSerializer(read_only=True)
    to_user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Friendship
        fields = '__all__'