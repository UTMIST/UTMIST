from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'date', 'super_featured', 'featured', 'updated')
    list_filter = ('author', 'date', 'super_featured', 'featured')
    search_fields = ('title', 'author', 'content')
    ordering = ('-date',)
    date_hierarchy = 'date'
    list_editable = ('super_featured', 'featured')  # Allow quick editing of featured status
