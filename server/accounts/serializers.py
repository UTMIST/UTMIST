from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['name', 'organization']
    

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    organization = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'organization']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Extract profile data
        name = validated_data.pop('name')
        organization = validated_data.pop('organization', None)

        # Create user
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Create profile
        UserProfile.objects.create(
            user=user,
            name=name,
            organization=organization
        )

        return user

