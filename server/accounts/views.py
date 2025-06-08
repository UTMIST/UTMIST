from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, ProfileSerializer
import logging
import json

logger = logging.getLogger(__name__)

class EmailLoginView(APIView):
    """
    API endpoint for user login using email and password.
    
    Methods:
    - POST: Authenticates a user and returns an auth token
        Required fields: email, password
        Returns: token and user info
        Status codes:
            200: Success
            400: Missing fields
            401: Invalid credentials
            404: User not found
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Both email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {'error': 'Invalid email format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'No user found with this email'},
                status=status.HTTP_404_NOT_FOUND
            )

        user = authenticate(username=user.username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username
                }
            })
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    
    Methods:
    - POST: Creates a new user account
        Required fields: email, password, name
        Optional fields: organization
        Returns: user info and success message
        Status codes:
            201: Created successfully
            400: Invalid data
            500: Server error
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            
            return Response(
                {
                    "message": "Registration successful",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username
                    },
                    "token": token.key
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": "Registration failed", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    """
    API endpoint for user logout.
    
    Methods:
    - POST: Invalidates the user's authentication token
        Requires: Authentication token
        Returns: Success message
        Status codes:
            200: Success
            401: Unauthorized
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        request.user.auth_token.delete()
        return Response(
            {"message": "Successfully logged out"},
            status=status.HTTP_200_OK
        )


class UpdateProfileView(APIView):
    """
    API endpoint for managing user profile.
    
    Methods:
    - GET: Get current user's profile
        Requires: Authentication token
        Returns: Profile data
    - PUT: Update profile information
        Requires: Authentication token
        Required fields: name
        Optional fields: organization
        Returns: Updated profile data
        Status codes:
            200: Success
            400: Invalid data
            401: Unauthorized
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    
    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
