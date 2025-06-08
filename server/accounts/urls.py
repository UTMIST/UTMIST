from django.urls import path
from .views import EmailLoginView, RegisterView, LogoutView

urlpatterns = [
    path('login/', EmailLoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
