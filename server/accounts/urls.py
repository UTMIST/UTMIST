from django.urls import path
from .views import EmailLoginView, RegisterView

urlpatterns = [
    path('login/', EmailLoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
]
