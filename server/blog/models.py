from django.db import models
from django.utils import timezone

# Create your models here.

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    content = models.TextField(blank=True)  # Making content optional since we have URL
    url = models.URLField()
    image = models.URLField(blank=True, null=True)  # Optional image URL
    date = models.DateTimeField(default=timezone.now)  # UTC timestamp
    updated = models.DateTimeField(auto_now=True)
    super_featured = models.BooleanField(default=False) # Large featured post
    featured = models.BooleanField(default=False) # Small featured post

    class Meta:
        ordering = ['-date']  # Most recent first

    def __str__(self):
        return self.title
