from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class EventTag(models.Model):
    """
    Model for event tags/categories.
    """
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Resource(models.Model):
    """
    Model for event resources (used in past events).
    """
    title = models.CharField(max_length=200)
    url = models.URLField()
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='resources')

    def __str__(self):
        return f"{self.title} - {self.event.title}"

class LearningGoal(models.Model):
    """
    Model for event learning goals (used in past events).
    """
    description = models.TextField()
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='learning_goals')

    def __str__(self):
        return f"{self.description[:50]}..."

class Event(models.Model):
    """
    Model representing UTMIST events.
    Handles upcoming, past, and featured events.
    
    Common Fields:
    - title: Name of the event
    - date: Event date and time
    - tags: Categories/types of event
    
    Upcoming Event Fields:
    - location: Where the event takes place
    - time: Time range of the event (e.g., "17:00-19:00")
    - description: Event description
    - max_participants: Maximum number of participants allowed
    
    Past Event Fields:
    - instructor: Name of the instructor
    - overview: Detailed event overview
    - learning_goals: List of learning objectives (separate model)
    - resources: List of related materials (separate model)
    
    Featured Event Fields:
    - registration_url: External registration link (required)
    - background: CSS gradient for card background
    - title_class_name: CSS class for title styling
    - title_alignment: Title position (left/right)
    - class_name: CSS class for card styling
    """
    
    # Event type choices
    EVENT_TYPE_CHOICES = [
        ('upcoming', 'Upcoming Event'),
        ('past', 'Past Event'),
        ('featured', 'Featured Event'),
    ]
    
    TITLE_ALIGNMENT_CHOICES = [
        ('left', 'Left'),
        ('right', 'Right'),
    ]

    # Common fields
    title = models.CharField(max_length=200)
    date = models.DateTimeField()  # Actual datetime for sorting and filtering
    tags = models.ManyToManyField(EventTag, related_name='events', blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default='upcoming')
    
    # Upcoming event fields
    location = models.CharField(max_length=200, blank=True, null=True)
    time = models.CharField(max_length=50, blank=True, null=True)  # Store as string like "17:00-19:00"
    description = models.TextField(blank=True, null=True)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    
    # Past event fields
    instructor = models.CharField(max_length=200, blank=True, null=True)
    overview = models.TextField(blank=True, null=True)
    
    # Featured event fields
    registration_url = models.URLField(blank=True, null=True)  # Required for featured events
    background = models.CharField(max_length=200, blank=True, null=True)  # CSS gradient
    title_class_name = models.CharField(max_length=50, blank=True, null=True)
    title_alignment = models.CharField(
        max_length=5,
        choices=TITLE_ALIGNMENT_CHOICES,
        blank=True,
        null=True
    )
    class_name = models.CharField(max_length=50, blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.title} ({self.event_type})"

    def clean(self):
        """Validate model fields based on event type"""
        from django.core.exceptions import ValidationError
        
        if self.event_type == 'featured' and not self.registration_url:
            raise ValidationError({
                'registration_url': 'Registration URL is required for featured events'
            })

    @property
    def current_participants(self):
        """Get number of current RSVPs"""
        if self.event_type != 'upcoming':
            return 0
        return self.rsvps.count()

    @property
    def is_full(self):
        """Check if event has reached max participants"""
        if self.event_type != 'upcoming' or self.max_participants is None:
            return False
        return self.current_participants >= self.max_participants

class EventRSVP(models.Model):
    """
    Model for tracking event RSVPs.
    Only applicable for upcoming events.
    """
    
    RSVP_STATUS = [
        ('confirmed', 'Confirmed'),
        ('waitlist', 'Waitlist'),
        ('cancelled', 'Cancelled'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_rsvps')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=RSVP_STATUS, default='confirmed')

    class Meta:
        unique_together = ['event', 'user']
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user.username} - {self.event.title} ({self.status})"

    def save(self, *args, **kwargs):
        # Only allow RSVPs for upcoming events
        if self.event.event_type == 'featured':
            raise ValueError("Cannot RSVP to featured events - use registration URL instead")
        if self.event.event_type != 'upcoming':
            raise ValueError("Can only RSVP to upcoming events")
            
        # If event is full and this is a new RSVP, set to waitlist
        if not self.pk and self.event.is_full:
            self.status = 'waitlist'
        super().save(*args, **kwargs) 