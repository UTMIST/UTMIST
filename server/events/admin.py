from django.contrib import admin
from .models import Event, EventTag, EventRSVP, Resource, LearningGoal

class ResourceInline(admin.TabularInline):
    """
    Inline admin for resources (used in past events).
    """
    model = Resource
    extra = 1

class LearningGoalInline(admin.TabularInline):
    """
    Inline admin for learning goals (used in past events).
    """
    model = LearningGoal
    extra = 1

class EventRSVPInline(admin.TabularInline):
    """
    Inline admin for RSVPs (used in upcoming events).
    """
    model = EventRSVP
    extra = 0
    readonly_fields = ('created_at',)
    can_delete = True

@admin.register(EventTag)
class EventTagAdmin(admin.ModelAdmin):
    """
    Admin interface for EventTag model.
    """
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(EventRSVP)
class EventRSVPAdmin(admin.ModelAdmin):
    """
    Admin interface for EventRSVP model.
    """
    list_display = ('event', 'user', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('event__title', 'user__username', 'user__email')
    raw_id_fields = ('user', 'event')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """
    Admin interface for Event model.
    Shows different fields based on event type.
    """
    def get_list_display(self, request):
        """Dynamic list display based on event type filter"""
        list_display = ['title', 'event_type', 'date']
        event_type = request.GET.get('event_type')
        
        if event_type == 'upcoming':
            list_display.extend(['time', 'location', 'current_participants'])
        elif event_type == 'past':
            list_display.extend(['instructor'])
            
        return list_display

    def get_fieldsets(self, request, obj=None):
        """Dynamic fieldsets based on event type"""
        common_fields = ('title', 'date', 'tags')
        
        if obj is None:  # Adding new event
            return [
                ('Event Type', {'fields': ('event_type',)}),
                ('Common Fields', {'fields': common_fields}),
                ('Upcoming Event Fields', {
                    'fields': ('location', 'time', 'description', 'max_participants'),
                    'classes': ('collapse',)
                }),
                ('Past Event Fields', {
                    'fields': ('instructor', 'overview'),
                    'classes': ('collapse',)
                }),
                ('Featured Event Fields', {
                    'fields': ('registration_url', 'background', 'title_class_name', 'title_alignment', 'class_name'),
                    'classes': ('collapse',)
                })
            ]
        
        # Editing existing event
        if obj.event_type == 'upcoming':
            return [
                ('Event Info', {'fields': common_fields + (
                    'location', 'time', 'description', 'max_participants'
                )}),
                ('Metadata', {'fields': ('created_at', 'updated_at')})
            ]
        elif obj.event_type == 'past':
            return [
                ('Event Info', {'fields': common_fields + (
                    'instructor', 'overview'
                )}),
                ('Metadata', {'fields': ('created_at', 'updated_at')})
            ]
        else:  # featured
            return [
                ('Event Info', {'fields': common_fields}),
                ('Featured Event Settings', {'fields': (
                    'registration_url', 'background', 'title_class_name', 'title_alignment', 'class_name'
                )}),
                ('Metadata', {'fields': ('created_at', 'updated_at')})
            ]

    def get_inlines(self, request, obj=None):
        """Dynamic inlines based on event type"""
        if obj is None:
            return []
            
        if obj.event_type == 'upcoming':
            return [EventRSVPInline]
        elif obj.event_type == 'past':
            return [ResourceInline, LearningGoalInline]
        return []

    list_filter = ('event_type', 'date', 'tags')
    search_fields = ('title', 'description', 'location', 'instructor')
    filter_horizontal = ('tags',)
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'date'

    def current_participants(self, obj):
        """Display number of confirmed participants"""
        if obj.event_type != 'upcoming':
            return '-'
        return obj.rsvps.filter(status='confirmed').count()
    current_participants.short_description = 'Confirmed RSVPs' 