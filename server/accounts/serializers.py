from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile model.
    Used for retrieving and updating user profile information.
    
    Fields:
    - name: User's full name
    - organization: Optional organization name
    """
    class Meta:
        model = UserProfile
        fields = ['name', 'organization']
    

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Creates both User and UserProfile instances.
    
    Fields:
    - email: User's email (used as username)
    - password: User's password (write-only)
    - name: User's full name (write-only)
    - organization: Optional organization (write-only)
    
    Validation:
    - Ensures email is unique
    - Creates user with email as username
    - Creates associated profile with name and organization
    """
    name = serializers.CharField(write_only=True)
    organization = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'organization']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        # Extract profile data
        name = validated_data.pop('name')
        organization = validated_data.pop('organization', None)

        # Create user
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'].lower(),
            password=validated_data['password']
        )

        # Create profile
        UserProfile.objects.create(
            user=user,
            name=name,
            organization=organization
        )

        return user

