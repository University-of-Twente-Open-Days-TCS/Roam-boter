from django.urls import include, path

from django.contrib.auth import views as auth_views
from django.contrib.auth import urls as auth_urls

from .views import OpenWorkshopView, CloseWorkshopView, GenerateTeamCodes, DashboardView


urlpatterns = [
    path(r'open/', OpenWorkshopView.as_view()),
    path(r'close/', CloseWorkshopView.as_view()),
    path(r'generate/', GenerateTeamCodes.as_view()),
    # Put the django.contrib.auth urls under the dashboard app.
    path(r'login/', auth_views.LoginView.as_view(template_name="dashlogin.html")),
    path(r'logout/', auth_views.LogoutView.as_view()),
    path(r'', include(auth_urls)),
    path(r'', DashboardView.as_view(), name="dashboard"),
]
