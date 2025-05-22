from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UserViewSet, ProjectViewSet, TaskViewSet,
                    TeamViewSet, CurrentUserView, DashboardView,
                    TeamProjectsView, ProjectDetailView, UserTasksView,
                    CalendarView, TeamMembersView)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'teams', TeamViewSet)

urlpatterns = [
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("team-projects/", TeamProjectsView.as_view(), name="team-projects"),
    path("projects/<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path("user-tasks/", UserTasksView.as_view(), name="user-tasks"),
    path("all-tasks-projects/", CalendarView.as_view(), name="calendar"),
    path("team-members/", TeamMembersView.as_view(), name="team-members"),
    path('', include(router.urls)),
]
