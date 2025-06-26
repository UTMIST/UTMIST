from django.apps import AppConfig

class EventsConfig(AppConfig):
    """
    Django app configuration for the events app.
    Handles event management and display.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events' 