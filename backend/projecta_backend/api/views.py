from rest_framework import viewsets
from .models import Team, User, Project, Task
from .serializers import TeamSerializer, UserSerializer, ProjectSerializer, TaskSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        team = user.team

        team_data = {"name": team.name} if team else None

        upcoming_tasks = (
            Task.objects
            .filter(user=user)
            .select_related("project")
            .order_by("deadline")[:3]
        )

        tasks_data = [
            {
                "id": task.id,
                "name": task.name,
                "deadline": task.deadline,
                "status": task.status,
                "project": {
                    "id": task.project.id,
                    "name": task.project.name
                }
            }
            for task in upcoming_tasks
        ]

        # 3 ближайших проекта команды
        team_projects = (
            Project.objects
            .filter(team=team)
            .order_by("deadline")[:3]
        )

        projects_data = []
        for project in team_projects:
            total_tasks = Task.objects.filter(project=project).count()
            done_tasks = Task.objects.filter(project=project, status="Готово").count()
            user_tasks_remaining = Task.objects.filter(project=project, user=user).exclude(status="Готово").count()

            completion_percent = round((done_tasks / total_tasks * 100), 1) if total_tasks else 0.0

            projects_data.append({
                "id": project.id,
                "name": project.name,
                "deadline": project.deadline,
                "completion_percent": completion_percent,
                "user_tasks_remaining": user_tasks_remaining
            })
        return Response({
            "team": team_data,
            "upcoming_tasks": tasks_data,
            "upcoming_projects": projects_data
        })
    
class TeamProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        team = user.team

        if not team:
            return Response({"detail": "Пользователь не принадлежит команде."}, status=400)

        projects = Project.objects.filter(team=team)

        project_data = []
        for project in projects:
            total_tasks = Task.objects.filter(project=project).count()
            completed_tasks = Task.objects.filter(project=project, status="Готово").count()
            user_tasks_count = Task.objects.filter(project=project, user=user).count()

            completion_percent = round((completed_tasks / total_tasks * 100), 1) if total_tasks else 0.0

            project_data.append({
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "deadline": project.deadline,
                "completion_percent": completion_percent,
                "user_tasks_remaining": user_tasks_count,
                "imageUrl": request.build_absolute_uri(project.image.url) if project.image else None
            })

        return Response(project_data)


class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = request.user
        project = get_object_or_404(Project, pk=pk)

        # Проверка доступа к проекту (только если пользователь в команде проекта)
        if project.team != user.team:
            return Response({"detail": "Нет доступа к этому проекту."}, status=403)

        # Все задачи текущего пользователя в этом проекте
        user_tasks = Task.objects.filter(project=project, user=user)
        user_tasks_data = TaskSerializer(user_tasks, many=True).data

        # Прогресс проекта
        total_tasks = Task.objects.filter(project=project).count()
        completed_tasks = Task.objects.filter(project=project, status="Готово").count()
        progress = round((completed_tasks / total_tasks * 100), 1) if total_tasks else 0.0

        # Сборка ответа
        project_data = {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "deadline": project.deadline,
            "team_id": project.team.id,
            "image": request.build_absolute_uri(project.image.url) if project.image else None,
            "progress_percent": progress,
            "user_tasks": user_tasks_data
        }

        return Response(project_data)

class UserTasksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tasks = Task.objects.filter(user=user).select_related('project')

        tasks_data = [
            {
                "id": task.id,
                "name": task.name,
                "deadline": task.deadline,
                "status": task.status,
                "project": {
                    "id": task.project.id,
                    "name": task.project.name
                }
            }
            for task in tasks
        ]

        return Response(tasks_data)

class CalendarView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        team = user.team

        team_data = {"name": team.name} if team else None

        upcoming_tasks = (
            Task.objects
            .filter(user=user)
            .select_related("project")
            .order_by("deadline")
        )

        tasks_data = [
            {
                "id": task.id,
                "name": task.name,
                "deadline": task.deadline,
                "status": task.status,
                "project": {
                    "id": task.project.id,
                    "name": task.project.name
                }
            }
            for task in upcoming_tasks
        ]

        # 3 ближайших проекта команды
        team_projects = (
            Project.objects
            .filter(team=team)
            .order_by("deadline")
        )

        projects_data = []
        for project in team_projects:
            total_tasks = Task.objects.filter(project=project).count()
            done_tasks = Task.objects.filter(project=project, status="Готово").count()
            user_tasks_remaining = Task.objects.filter(project=project, user=user).exclude(status="Готово").count()

            completion_percent = round((done_tasks / total_tasks * 100), 1) if total_tasks else 0.0

            projects_data.append({
                "id": project.id,
                "name": project.name,
                "deadline": project.deadline,
                "completion_percent": completion_percent,
                "user_tasks_remaining": user_tasks_remaining
            })
        return Response({
            "team": team_data,
            "upcoming_tasks": tasks_data,
            "upcoming_projects": projects_data
        })
    
class TeamMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        team = user.team

        if not team:
            return Response({"detail": "Вы не состоите в команде."}, status=400)

        members = User.objects.filter(team=team)

        members_data = []
        for member in members:
            task_count = Task.objects.filter(user=member).count()
            members_data.append({
                "id": member.id,
                "name": member.name,
                "email": member.email,
                "position": member.position,
                "task_count": task_count,
                "is_current_user": member.id == user.id,
                "image": request.build_absolute_uri(member.avatar.url) if member.avatar else None
            })
        print(team.name)
        data = {
            'team_name': team.name,
            'members': members_data
        }

        return Response(data)