from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Event, EventRSVP, EventTag
from .serializers import EventSerializer, EventRSVPSerializer, EventTagSerializer

class EventTagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing event tags.
    Read-only as tags are managed through events.
    """
    queryset = EventTag.objects.all()
    serializer_class = EventTagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing events.
    
    List:
        GET /api/events/
        - Returns all events
        - Supports filtering by event_type and tags
        - Supports search by title and description
        - Supports ordering by date
    
    Detail:
        GET /api/events/{id}/
        - Returns specific event details
    
    Create:
        POST /api/events/
        - Admin only
        - Accepts event_type to determine fields
    
    Update:
        PUT/PATCH /api/events/{id}/
        - Admin only
        - Can update all fields
    
    Delete:
        DELETE /api/events/{id}/
        - Admin only
    
    Additional endpoints:
        POST /api/events/{id}/rsvp/
        - RSVP to an event (upcoming only)
        - Requires authentication
        - Returns RSVP status
        
        DELETE /api/events/{id}/rsvp/
        - Cancel RSVP (upcoming only)
        - Requires authentication
        
        GET /api/events/{id}/rsvps/
        - List all RSVPs for an event
        - Admin only
        
        POST /api/events/{id}/mark-as-past/
        - Convert upcoming event to past event
        - Admin only
        - Requires instructor and overview
        
        GET /api/events/upcoming/
        - Lists upcoming events only
        
        GET /api/events/past/
        - Lists past events only
        
        GET /api/events/featured/
        - Lists featured events only
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'time', 'created_at']
    ordering = ['date', 'time']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def rsvp(self, request, pk=None):
        """
        RSVP to an event.
        Only works for upcoming events.
        If event is full, user will be added to waitlist.
        """
        event = self.get_object()
        
        # Verify this is an upcoming event
        if event.event_type != 'upcoming':
            return Response(
                {'error': 'Can only RSVP to upcoming events'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already has an RSVP
        existing_rsvp = EventRSVP.objects.filter(event=event, user=request.user).first()
        if existing_rsvp:
            if existing_rsvp.status == 'cancelled':
                # Reactivate cancelled RSVP
                existing_rsvp.status = 'confirmed' if not event.is_full else 'waitlist'
                existing_rsvp.save()
            return Response(
                EventRSVPSerializer(existing_rsvp).data,
                status=status.HTTP_200_OK
            )
        
        # Create new RSVP
        rsvp = EventRSVP.objects.create(
            event=event,
            user=request.user,
            status='confirmed' if not event.is_full else 'waitlist'
        )
        
        return Response(
            EventRSVPSerializer(rsvp).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def cancel_rsvp(self, request, pk=None):
        """Cancel RSVP to an event"""
        event = self.get_object()
        
        # Verify this is an upcoming event
        if event.event_type != 'upcoming':
            return Response(
                {'error': 'Can only cancel RSVPs for upcoming events'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        rsvp = get_object_or_404(EventRSVP, event=event, user=request.user)
        
        # Mark as cancelled
        rsvp.status = 'cancelled'
        rsvp.save()
        
        # If there was a waitlist and this was a confirmed RSVP,
        # move the first waitlisted person to confirmed
        if rsvp.status == 'confirmed':
            waitlist_rsvp = event.rsvps.filter(status='waitlist').first()
            if waitlist_rsvp:
                waitlist_rsvp.status = 'confirmed'
                waitlist_rsvp.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, permission_classes=[IsAuthenticated])
    def rsvps(self, request, pk=None):
        """List all RSVPs for an event"""
        event = self.get_object()
        rsvps = event.rsvps.all()
        return Response(
            EventRSVPSerializer(rsvps, many=True).data
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_as_past(self, request, pk=None):
        """
        Convert an upcoming event to a past event.
        Requires instructor and overview fields.
        """
        event = self.get_object()
        
        # Verify this is an upcoming event
        if event.event_type != 'upcoming':
            return Response(
                {'error': 'Can only convert upcoming events to past events'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify required fields are provided
        instructor = request.data.get('instructor')
        overview = request.data.get('overview')
        if not instructor or not overview:
            return Response(
                {'error': 'Instructor and overview are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update event
        event.event_type = 'past'
        event.instructor = instructor
        event.overview = overview
        event.save()
        
        return Response(
            EventSerializer(event).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False)
    def upcoming(self, request):
        """List all upcoming events"""
        events = self.get_queryset().filter(event_type='upcoming')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def past(self, request):
        """List all past events"""
        events = self.get_queryset().filter(event_type='past')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def featured(self, request):
        """List all featured events"""
        events = self.get_queryset().filter(event_type='featured')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        """
        Optionally restricts the returned events by filtering against
        query parameters in the URL:
        - event_type: Filter by event type (upcoming/past/featured)
        - tags: Filter by tag names (comma-separated)
        """
        queryset = Event.objects.all()
        
        # Filter by event type
        event_type = self.request.query_params.get('event_type', None)
        if event_type:
            queryset = queryset.filter(event_type=event_type)

        # Filter by tags
        tags = self.request.query_params.get('tags', None)
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            queryset = queryset.filter(tags__name__in=tag_list).distinct()

        return queryset 