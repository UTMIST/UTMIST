from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    """
    Extends the default Django User model with additional fields.
    
    Fields:
    - user: One-to-one relationship with Django's User model
    - name: User's full name
    - organization: Optional field for user's organization
    - profile_picture: Profile picture stored in public directory
    """
    DEFAULT_PROFILE_PICTURE = 'profile_pictures/default.webp'
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=255)
    organization = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        default=DEFAULT_PROFILE_PICTURE,
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.user.email}'s profile"
