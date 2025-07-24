# Blog System

## Overview
The Blog system manages blog posts with support for featured content, external links, and image integration. It provides a simple API for blog post management with admin-only write access.

## Model Structure

### BlogPost Model
```python
class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    url = models.URLField()
    image = models.URLField(blank=True, null=True)
    date = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)
    super_featured = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-date']
```

### Fields
- `title`: Blog post title
- `author`: Author's name
- `content`: Optional post content (can be empty if using external URL)
- `url`: Link to the full blog post
- `image`: Optional URL for post thumbnail/header image
- `date`: Publication date (UTC)
- `updated`: Last modification timestamp
- `super_featured`: Flag for large featured posts
- `featured`: Flag for small featured posts

## API Endpoints

### List Blog Posts
```
GET /api/blog/
```
Lists all blog posts.

#### Features
- Public access (no authentication required)
- Ordered by date (newest first)
- Includes featured status

#### Response
```json
[
    {
        "id": 1,
        "title": "Introduction to AI",
        "author": "John Doe",
        "content": "Blog post content...",
        "url": "https://example.com/blog/intro-to-ai",
        "image": "https://example.com/images/ai.jpg",
        "date": "2025-01-01T12:00:00Z",
        "updated": "2025-01-01T12:00:00Z",
        "super_featured": true,
        "featured": false
    }
]
```

### Create Blog Post
```
POST /api/blog/
```
Creates a new blog post (admin only).

#### Required Fields
- `title`: Post title
- `author`: Author name
- `url`: Post URL

#### Optional Fields
- `content`: Post content
- `image`: Image URL
- `super_featured`: Boolean
- `featured`: Boolean
- `date`: Publication date (defaults to now)

#### Response
Same format as list response, with status 201 on success.

### Get Blog Post
```
GET /api/blog/{id}/
```
Retrieves a specific blog post.

#### Features
- Public access
- Returns 404 if post not found

#### Response
Same format as list response items.

### Update Blog Post
```
PUT/PATCH /api/blog/{id}/
```
Updates a blog post (admin only).

#### Updatable Fields
All fields can be updated except:
- `updated` (auto-managed)

#### Response
Updated post object on success.

### Delete Blog Post
```
DELETE /api/blog/{id}/
```
Deletes a blog post (admin only).

#### Response
204 No Content on success.

## Admin Interface Features

The blog system includes a customized Django admin interface with:

### List View
- Displays title, author, date, and featured status
- Quick-edit featured status
- Filtering by author and date
- Search by title, author, and content
- Date-based navigation

### Edit View
- Full form for all fields
- Rich text editor for content
- Image URL validation
- Featured status toggles

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created (for new posts)
- `204`: No Content (for deletion)
- `400`: Bad Request (invalid data)
- `401`: Unauthorized
- `403`: Forbidden (non-admin trying to modify)
- `404`: Not Found
- `500`: Server Error

Error responses include a descriptive message:
```json
{
    "error": "Error description"
}
``` 