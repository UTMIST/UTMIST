from django.shortcuts import render
from rest_framework import generics, permissions
from .models import BlogPost
from .serializers import BlogPostSerializer

# Create your views here.

class BlogPostList(generics.ListCreateAPIView):
    """
    List all blog posts, or create a new blog post (admin only).
    """
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # Allow anyone to list posts
        return [permissions.IsAdminUser()]  # Only admins can create posts

class BlogPostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a blog post (admin only for update/delete).
    """
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # Allow anyone to view a post
        return [permissions.IsAdminUser()]  # Only admins can update/delete posts
