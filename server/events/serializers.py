from rest_framework import serializers
from .models import Event, EventTag, EventRSVP, Resource, LearningGoal
from django.utils.dateparse import parse_datetime

class EventTagSerializer(serializers.ModelSerializer):
    """
    Serializer for event tags.
    """
    class Meta:
        model = EventTag
        fields = ['id', 'name']

class ResourceSerializer(serializers.ModelSerializer):
    """
    Serializer for event resources.
    """
    class Meta:
        model = Resource
        fields = ['title', 'url']

class LearningGoalSerializer(serializers.ModelSerializer):
    """
    Serializer for learning goals.
    """
    class Meta:
        model = LearningGoal
        fields = ['description']

class EventRSVPSerializer(serializers.ModelSerializer):
    """
    Serializer for event RSVPs.
    """
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = EventRSVP
        fields = ['id', 'event', 'username', 'status', 'created_at']
        read_only_fields = ['status']

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for Event model.
    Handles all event types (upcoming, past, featured).
    """
    tags = serializers.ListField(
        child=serializers.CharField(),
        source='tag_names',
        required=False
    )
    current_participants = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    user_rsvp_status = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    
    # Past event fields
    learning_goals = LearningGoalSerializer(many=True, required=False)
    resources = ResourceSerializer(many=True, required=False)

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'date',
            'event_type',
            'tags',
            # Upcoming event fields
            'location',
            'time',
            'description',
            'registration_url',
            'max_participants',
            'current_participants',
            'is_full',
            'user_rsvp_status',
            # Past event fields
            'instructor',
            'overview',
            'learning_goals',
            'resources',
            # Featured event fields
            'background',
            'title_class_name',
            'title_alignment',
            'class_name',
            # Metadata
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        """Validate event data based on event type"""
        event_type = data.get('event_type')
        
        # For featured events, registration URL is required
        if event_type == 'featured' and not data.get('registration_url'):
            raise serializers.ValidationError({
                'registration_url': 'Registration URL is required for featured events'
            })
            
        return data

    def get_date(self, obj):
        """Format date as 'May 12th, 2024'"""
        if not obj.date:
            return None
            
        # Format date like "May 12th, 2024"
        date_str = obj.date.strftime("%B %-d")
        
        # Add ordinal suffix
        day = obj.date.day
        if 4 <= day <= 20 or 24 <= day <= 30:
            suffix = "th"
        else:
            suffix = ["st", "nd", "rd"][day % 10 - 1]
            
        return f"{date_str}{suffix}, {obj.date.year}"

    def get_user_rsvp_status(self, obj):
        """Get RSVP status for requesting user"""
        if obj.event_type != 'upcoming':
            return None
            
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                rsvp = obj.rsvps.get(user=request.user)
                return rsvp.status
            except EventRSVP.DoesNotExist:
                return None
        return None

    def create(self, validated_data):
        """Create event with related objects"""
        # Handle tags
        tags = validated_data.pop('tag_names', [])
        
        # Handle learning goals for past events
        learning_goals = validated_data.pop('learning_goals', [])
        
        # Handle resources for past events
        resources = validated_data.pop('resources', [])
        
        # Create event
        event = super().create(validated_data)
        
        # Add tags
        for tag_name in tags:
            tag, _ = EventTag.objects.get_or_create(name=tag_name)
            event.tags.add(tag)
        
        # Add learning goals for past events
        if event.event_type == 'past':
            for goal in learning_goals:
                LearningGoal.objects.create(event=event, **goal)
        
        # Add resources for past events
        if event.event_type == 'past':
            for resource in resources:
                Resource.objects.create(event=event, **resource)
        
        return event

    def update(self, instance, validated_data):
        """Update event with related objects"""
        # Handle tags
        tags = validated_data.pop('tag_names', None)
        
        # Handle learning goals for past events
        learning_goals = validated_data.pop('learning_goals', None)
        
        # Handle resources for past events
        resources = validated_data.pop('resources', None)
        
        # Update event
        event = super().update(instance, validated_data)
        
        # Update tags if provided
        if tags is not None:
            event.tags.clear()
            for tag_name in tags:
                tag, _ = EventTag.objects.get_or_create(name=tag_name)
                event.tags.add(tag)
        
        # Update learning goals if provided
        if learning_goals is not None and event.event_type == 'past':
            event.learning_goals.all().delete()
            for goal in learning_goals:
                LearningGoal.objects.create(event=event, **goal)
        
        # Update resources if provided
        if resources is not None and event.event_type == 'past':
            event.resources.all().delete()
            for resource in resources:
                Resource.objects.create(event=event, **resource)
        
        return event

    def validate_date(self, value):
        """
        Validate that the event date is not in the past when creating an event.
        Allow past dates when updating an event.
        """
        if self.instance is None:  # Creating new event
            from django.utils import timezone
            if value < timezone.now():
                raise serializers.ValidationError("Cannot create events in the past")
        return value 