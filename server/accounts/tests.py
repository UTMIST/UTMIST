from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from .models import UserProfile
from PIL import Image
import io
import json
import os
import shutil
from django.conf import settings

class AccountsTestCase(TestCase):
    def setUp(self):
        """Set up test data and clients"""
        self.client = APIClient()
        
        # Create a test user
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'name': 'Test User',
            'organization': 'Test Org'
        }
        
        # Create a test image using PIL
        image = Image.new('RGB', (100, 100), color='red')
        image_io = io.BytesIO()
        image.save(image_io, format='WEBP')
        self.test_image = SimpleUploadedFile(
            name='test_image.webp',
            content=image_io.getvalue(),
            content_type='image/webp'
        )

    def tearDown(self):
        """Clean up test data"""
        # Clean up any uploaded test files
        test_media_dir = os.path.join(settings.MEDIA_ROOT, 'profile_pictures')
        if os.path.exists(test_media_dir):
            shutil.rmtree(test_media_dir)

    def test_registration(self):
        """Test user registration"""
        # Test basic registration
        response = self.client.post(
            reverse('register'),
            {
                'email': self.user_data['email'],
                'password': self.user_data['password'],
                'name': self.user_data['name'],
                'organization': self.user_data['organization'],
                'profile_picture': self.test_image
            },
            format='multipart'
        )
        self.assertEqual(response.status_code, 201)
        
        # Check response structure
        data = response.json()
        self.assertIn('token', data)
        self.assertIn('profile', data)
        self.assertEqual(data['profile']['email'], self.user_data['email'])
        self.assertEqual(data['profile']['name'], self.user_data['name'])
        self.assertEqual(data['profile']['organization'], self.user_data['organization'])
        self.assertIn('profile_picture_url', data['profile'])
        
        # Test duplicate email
        response = self.client.post(
            reverse('register'),
            {
                'email': self.user_data['email'],
                'password': self.user_data['password'],
                'name': self.user_data['name']
            }
        )
        self.assertEqual(response.status_code, 400)
        
        # Test invalid email
        response = self.client.post(
            reverse('register'),
            {
                'email': 'invalid',
                'password': self.user_data['password'],
                'name': self.user_data['name']
            }
        )
        self.assertEqual(response.status_code, 400)

    def test_login(self):
        """Test user login"""
        # Create a user first
        User.objects.create_user(
            username=self.user_data['email'],
            email=self.user_data['email'],
            password=self.user_data['password']
        )
        UserProfile.objects.create(
            user=User.objects.get(email=self.user_data['email']),
            name=self.user_data['name'],
            organization=self.user_data['organization']
        )
        
        # Test successful login
        response = self.client.post(reverse('login'), {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, 200)
        
        # Check response structure
        data = response.json()
        self.assertIn('token', data)
        self.assertIn('profile', data)
        
        # Test wrong password
        response = self.client.post(reverse('login'), {
            'email': self.user_data['email'],
            'password': 'wrongpass'
        })
        self.assertEqual(response.status_code, 401)
        
        # Test non-existent user
        response = self.client.post(reverse('login'), {
            'email': 'nonexistent@example.com',
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, 404)

    def test_profile_management(self):
        """Test profile viewing and updating"""
        # Create and authenticate a user
        user = User.objects.create_user(
            username=self.user_data['email'],
            email=self.user_data['email'],
            password=self.user_data['password']
        )
        profile = UserProfile.objects.create(
            user=user,
            name=self.user_data['name'],
            organization=self.user_data['organization']
        )
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        
        # Test profile viewing
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['name'], self.user_data['name'])
        
        # Test profile updating
        # Create a new test image for update
        image = Image.new('RGB', (100, 100), color='blue')
        image_io = io.BytesIO()
        image.save(image_io, format='WEBP')
        update_image = SimpleUploadedFile(
            name='update_image.webp',
            content=image_io.getvalue(),
            content_type='image/webp'
        )
        
        response = self.client.put(
            reverse('profile'),
            {
                'name': 'Updated Name',
                'organization': 'Updated Org',
                'profile_picture': update_image
            },
            format='multipart'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['name'], 'Updated Name')
        self.assertEqual(data['organization'], 'Updated Org')
        self.assertIn('profile_picture_url', data)
        
        # Test unauthorized access
        self.client.credentials()  # Remove authentication
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 401)

    def test_logout(self):
        """Test user logout"""
        # Create and authenticate a user
        user = User.objects.create_user(
            username=self.user_data['email'],
            email=self.user_data['email'],
            password=self.user_data['password']
        )
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        
        # Test successful logout
        response = self.client.post(reverse('logout'))
        self.assertEqual(response.status_code, 200)
        
        # Verify token is deleted
        self.assertFalse(Token.objects.filter(user=user).exists())
        
        # Test unauthorized logout
        self.client.credentials()  # Remove authentication
        response = self.client.post(reverse('logout'))
        self.assertEqual(response.status_code, 401)
