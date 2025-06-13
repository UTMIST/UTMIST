from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile model.
    Used for all profile operations (registration, login, profile management).
    
    Fields:
    - email: User's email from related User model
    - name: User's full name
    - organization: Optional organization name
    - profile_picture: Profile picture file (write-only)
    - profile_picture_url: Full URL to profile picture
    - linkedin_url: Optional LinkedIn profile URL
    - github_url: Optional GitHub profile URL
    - discord_username: Optional Discord username
    """
    email = serializers.EmailField(source='user.email', read_only=True)
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['email', 'name', 'organization', 'profile_picture', 'profile_picture_url',
                 'linkedin_url', 'github_url', 'discord_username']
        extra_kwargs = {
            'profile_picture': {'write_only': True}
        }

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return self.context['request'].build_absolute_uri(obj.profile_picture.url)
        return None

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Creates both User and UserProfile instances.
    
    Fields:
    - email: User's email (used as username)
    - password: User's password (write-only)
    - name: User's full name
    - organization: Optional organization
    - profile_picture: Optional profile picture
    - linkedin_url: Optional LinkedIn profile URL
    - github_url: Optional GitHub profile URL
    - discord_username: Optional Discord username
    """
    name = serializers.CharField(write_only=True)
    organization = serializers.CharField(write_only=True, required=False)
    profile_picture = serializers.ImageField(write_only=True, required=False)
    linkedin_url = serializers.URLField(write_only=True, required=False)
    github_url = serializers.URLField(write_only=True, required=False)
    discord_username = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'organization', 'profile_picture',
                 'linkedin_url', 'github_url', 'discord_username']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        # Extract profile data
        name = validated_data.pop('name')
        organization = validated_data.pop('organization', None)
        profile_picture = validated_data.pop('profile_picture', None)
        linkedin_url = validated_data.pop('linkedin_url', None)
        github_url = validated_data.pop('github_url', None)
        discord_username = validated_data.pop('discord_username', None)

        # Create user
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'].lower(),
            password=validated_data['password']
        )

        # Create profile
        profile = UserProfile.objects.create(
            user=user,
            name=name,
            organization=organization,
            linkedin_url=linkedin_url,
            github_url=github_url,
            discord_username=discord_username
        )
        
        # Set profile picture if provided
        if profile_picture:
            profile.profile_picture = profile_picture
            profile.save()

        return user

