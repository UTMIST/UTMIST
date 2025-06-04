from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=255)
    organization = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.email}'s profile"
