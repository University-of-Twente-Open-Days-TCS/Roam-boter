from django.urls import include, path

from django.contrib.auth import views as auth_views
from django.contrib.auth import urls as auth_urls

from .views import OpenWorkshopView, CloseWorkshopView, GenerateTeamCodes, DashboardView, EnterTeamView, LeaveTeamView

from .api_views import TeamDetailAPI, EnterTeamAPI


urlpatterns = [
    # Open/Close workshop
    path(r'open/', OpenWorkshopView.as_view(), name="open_workshop_api"),
    path(r'close/', CloseWorkshopView.as_view(), name="close_workshop_api"),
    # Generate Team Codes
    path(r'generate/', GenerateTeamCodes.as_view(), name="generate_team_codes_api"),
    # API
    path(r'team/detail/', TeamDetailAPI.as_view()),
    path(r'enter/', EnterTeamAPI.as_view()),

    # LEGACY PAGES
    path(r'legacy/enter/', EnterTeamView.as_view(), name="enter_team_api"),
    path(r'legacy/leave/', LeaveTeamView.as_view(), name="leave_team_api"),


    # Put the django.contrib.auth urls under the dashboard app.
    path(r'login/', auth_views.LoginView.as_view(template_name="dashlogin.html")),
    path(r'logout/', auth_views.LogoutView.as_view()),
    path(r'', include(auth_urls)),
    path(r'', DashboardView.as_view(), name="dashboard"),
]
