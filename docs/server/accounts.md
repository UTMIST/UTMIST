# Accounts System

## Overview
The Accounts system handles user authentication, registration, and profile management. It extends Django's built-in User model with additional fields and functionality, providing endpoints for user management and social media integration.

## Model Structure

### UserProfile Model
```python
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=255)
    organization = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='public/profile_pictures/',
        default='public/profile_pictures/default.webp',
        blank=True,
        null=True
    )
    linkedin_url = models.URLField(max_length=255, blank=True, null=True)
    github_url = models.URLField(max_length=255, blank=True, null=True)
    discord_username = models.CharField(max_length=100, blank=True, null=True)
```

### Fields
- `user`: One-to-one relationship with Django's User model
- `name`: User's full name (required)
- `organization`: Optional organization name
- `profile_picture`: Optional profile picture stored in public directory with default image
- `linkedin_url`: Optional LinkedIn profile URL
- `github_url`: Optional GitHub profile URL
- `discord_username`: Optional Discord username

### File Storage
Profile pictures are stored in the `public/profile_pictures/` directory, making them accessible through the web server. A default profile picture (`default.webp`) is provided in the same directory.

## API Endpoints

### Registration
```
POST /api/accounts/register/
```
Creates a new user account with profile information.

#### Required Fields
- `email`: User's email address (used as username)
- `password`: User's password
- `name`: User's full name

#### Optional Fields
- `organization`: Organization name
- `profile_picture`: Profile picture file (stored in public/profile_pictures/)
- `linkedin_url`: LinkedIn profile URL
- `github_url`: GitHub profile URL
- `discord_username`: Discord username

#### Response
```json
{
    "message": "Registration successful",
    "token": "auth_token_string",
    "profile": {
        "email": "user@example.com",
        "name": "User Name",
        "organization": "Organization",
        "profile_picture_url": "http://example.com/media/public/profile_pictures/image.webp",
        "linkedin_url": "https://linkedin.com/in/username",
        "github_url": "https://github.com/username",
        "discord_username": "username#1234"
    }
}
```

### Login
```
POST /api/accounts/login/
```
Authenticates a user and returns their profile information.

#### Required Fields
- `email`: User's email address
- `password`: User's password

#### Response
```json
{
    "token": "auth_token_string",
    "profile": {
        "email": "user@example.com",
        "name": "User Name",
        "organization": "Organization",
        "profile_picture_url": "http://example.com/media/public/profile_pictures/image.webp",
        "linkedin_url": "https://linkedin.com/in/username",
        "github_url": "https://github.com/username",
        "discord_username": "username#1234"
    }
}
```

### Profile Management
```
GET /api/accounts/profile/
```
Retrieves the authenticated user's profile information.

#### Response
Same as profile object in login/register responses.

```
PUT /api/accounts/profile/
```
Updates the authenticated user's profile information.

#### Optional Fields
- `name`: User's full name
- `organization`: Organization name
- `profile_picture`: Profile picture file (stored in public/profile_pictures/)
- `linkedin_url`: LinkedIn profile URL
- `github_url`: GitHub profile URL
- `discord_username`: Discord username

#### Response
Same as profile object in login/register responses.

### Logout
```
POST /api/accounts/logout/
```
Invalidates the user's authentication token.

#### Response
```json
{
    "message": "Successfully logged out"
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created (for registration)
- `400`: Bad Request (invalid data)
- `401`: Unauthorized (invalid/missing token)
- `500`: Server Error

Error responses include a descriptive message:
```json
{
    "error": "Error description"
}
``` 