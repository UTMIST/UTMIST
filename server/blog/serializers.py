from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'author', 'content', 'url', 'image', 'date', 'updated', 'super_featured', 'featured']
        read_only_fields = ['updated'] 