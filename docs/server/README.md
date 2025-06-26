# Server Documentation

## Overview
This directory contains documentation for the server-side components of the UTMIST website. The server is built using Django and Django REST Framework, providing a robust API for the client application.

## Contents

### User Management
- [User Profile](UserProfile.md): Documentation for the user profile system, including authentication and profile management endpoints
- [Changelog](CHANGELOG.md): Recent changes and updates to the server components

## API Structure

The API follows RESTful principles and is organized into several main sections:

### Authentication and User Management (`/api/accounts/`)
- User registration and authentication
- Profile management
- Social media integration

### Events (`/api/events/`)
- Event creation and management
- RSVP functionality
- Event categorization

### Blog (`/api/blog/`)
- Blog post management
- Content organization
- Media handling

## Common Patterns

### Authentication
All authenticated endpoints require a token in the Authorization header:
```
Authorization: Token <token_string>
```

### Response Format
All API responses follow a consistent format:
- Success responses include relevant data
- Error responses include an error message and appropriate HTTP status code

### File Uploads
File uploads (e.g., profile pictures) should use `multipart/form-data` content type.

## Development Guidelines

### Adding New Features
1. Create/update models in appropriate app
2. Generate and apply migrations
3. Update serializers and views
4. Add/update tests
5. Document changes in CHANGELOG.md
6. Update relevant documentation files

### Testing
- All new features should include test coverage
- Run tests using `python manage.py test`
- Update test documentation when adding new test cases 