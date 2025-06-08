from django.apps import AppConfig

class AccountsConfig(AppConfig):
    """
    Django app configuration for the accounts app.
    Handles user authentication, registration, and profile management.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
