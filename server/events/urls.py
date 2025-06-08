from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, EventTagViewSet

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'', EventViewSet)  # Base endpoint is now /api/events/
router.register(r'tags', EventTagViewSet)  # Tags endpoint is now /api/events/tags/

# URL patterns for the events app
# All URLs are prefixed with 'api/events/'
urlpatterns = [
    path('', include(router.urls)),
] 