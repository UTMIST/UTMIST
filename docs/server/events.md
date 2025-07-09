# Events System

## Overview
The Events system manages different types of events (upcoming, past, and featured) with support for RSVPs, resources, and learning goals. It provides a flexible API for event management and participant tracking.

## Model Structure

### Event Model
```python
class Event(models.Model):
    # Common fields
    title = models.CharField(max_length=200)
    date = models.DateTimeField()
    tags = models.ManyToManyField(EventTag, related_name='events', blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    
    # Upcoming event fields
    location = models.CharField(max_length=200, blank=True, null=True)
    time = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    
    # Past event fields
    instructor = models.CharField(max_length=200, blank=True, null=True)
    overview = models.TextField(blank=True, null=True)
    
    # Featured event fields
    registration_url = models.URLField(blank=True, null=True)
    background = models.CharField(max_length=200, blank=True, null=True)
    title_class_name = models.CharField(max_length=50, blank=True, null=True)
    title_alignment = models.CharField(max_length=5, choices=TITLE_ALIGNMENT_CHOICES)
    class_name = models.CharField(max_length=50, blank=True, null=True)
```

### Related Models
- `EventTag`: Categories/types for events
- `Resource`: Learning materials for past events
- `LearningGoal`: Learning objectives for past events
- `EventRSVP`: Tracks event participation and waitlist

## API Endpoints

### Event Management

#### List Events
```
GET /api/events/
```
Lists all events with optional filtering.

##### Query Parameters
- `event_type`: Filter by type (upcoming/past/featured)
- `tags`: Filter by tag names (comma-separated)
- `search`: Search in title, description, location
- `ordering`: Order by date, time, created_at

#### Create Event
```
POST /api/events/
```
Creates a new event (admin only).

##### Fields vary by event type:
- Upcoming events: location, time, description, max_participants
- Past events: instructor, overview, learning_goals, resources
- Featured events: registration_url, styling fields

#### Get Event Details
```
GET /api/events/{id}/
```
Returns detailed information about a specific event.

#### Update Event
```
PUT/PATCH /api/events/{id}/
```
Updates an event (admin only).

#### Delete Event
```
DELETE /api/events/{id}/
```
Deletes an event (admin only).

### RSVP Management

#### RSVP to Event
```
POST /api/events/{id}/rsvp/
```
RSVP to an upcoming event.

##### Features
- Automatic waitlist if event is full
- One RSVP per user per event
- Only for upcoming events

#### Cancel RSVP
```
DELETE /api/events/{id}/rsvp/
```
Cancels an existing RSVP.

##### Features
- Moves waitlisted user to confirmed if space opens
- Only for upcoming events

#### List RSVPs
```
GET /api/events/{id}/rsvps/
```
Lists all RSVPs for an event (admin only).

### Event Type Endpoints

#### Upcoming Events
```
GET /api/events/upcoming/
```
Lists only upcoming events.

#### Past Events
```
GET /api/events/past/
```
Lists only past events.

#### Featured Events
```
GET /api/events/featured/
```
Lists only featured events.

### Event Tags

#### List Tags
```
GET /api/events/tags/
```
Lists all available event tags.

## Response Formats

### Event Object
```json
{
    "id": 1,
    "title": "Event Title",
    "date": "2025-01-01T18:00:00Z",
    "event_type": "upcoming",
    "tags": ["workshop", "ai"],
    "location": "Room 123",
    "time": "18:00-20:00",
    "description": "Event description",
    "max_participants": 30,
    "current_participants": 25,
    "is_full": false,
    "user_rsvp_status": "confirmed"
}
```

### RSVP Object
```json
{
    "id": 1,
    "event": 1,
    "username": "user123",
    "status": "confirmed",
    "created_at": "2025-01-01T12:00:00Z"
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid data)
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Server Error

Error responses include a descriptive message:
```json
{
    "error": "Error description"
}
``` 