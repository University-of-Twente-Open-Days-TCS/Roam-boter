from django.urls import include, path

from django.contrib.auth import views as auth_views
from django.contrib.auth import urls as auth_urls

from .views import OpenWorkshopView, CloseWorkshopView, GenerateTeamCodes, DashboardView, EnterTeamView, LeaveTeamView

from .api_views import TeamDetail


urlpatterns = [
    # Open/Close workshop
    path(r'open/', OpenWorkshopView.as_view(), name="open_workshop_api"),
    path(r'close/', CloseWorkshopView.as_view(), name="close_workshop_api"),
    # Generate Team Codes
    path(r'generate/', GenerateTeamCodes.as_view(), name="generate_team_codes_api"),
    # Leave enter team
    path(r'team/enter/', EnterTeamView.as_view(), name="enter_team_api"),
    path(r'team/leave/', LeaveTeamView.as_view(), name="leave_team_api"),
    # API
    path(r'team/detail/', TeamDetail.as_view()),

    # Put the django.contrib.auth urls under the dashboard app.
    path(r'login/', auth_views.LoginView.as_view(template_name="dashlogin.html")),
    path(r'logout/', auth_views.LogoutView.as_view()),
    path(r'', include(auth_urls)),
    path(r'', DashboardView.as_view(), name="dashboard"),
]
