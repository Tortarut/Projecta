from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Team, User, Project, Task

class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'name', 'position', 'team', 'is_staff')
    list_filter = ('is_staff', 'team')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Личная информация', {'fields': ('name', 'position', 'team')}),
        ('Права доступа', {'fields': ('is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'fields': ('email', 'name', 'position', 'team', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'name')
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)
admin.site.register(Team)
admin.site.register(Project)
admin.site.register(Task)
