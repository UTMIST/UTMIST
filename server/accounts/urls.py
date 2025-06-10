from django.urls import path
from .views import EmailLoginView, RegisterView, LogoutView, UpdateProfileView

# URL patterns for the accounts app
# All URLs are prefixed with 'api/accounts/'
urlpatterns = [
    # Authentication endpoints
    path('login/', EmailLoginView.as_view(), name='login'),  # POST: Login with email/password
    path('register/', RegisterView.as_view(), name='register'),  # POST: Create new account
    path('logout/', LogoutView.as_view(), name='logout'),  # POST: Logout (requires auth)
    
    # Profile management
    path('profile/', UpdateProfileView.as_view(), name='profile'),  # GET: View profile, PUT: Update profile (requires auth)
]
