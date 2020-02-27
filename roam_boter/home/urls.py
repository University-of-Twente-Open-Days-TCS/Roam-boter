from django.urls import include, path
from .views import HomeView, EnterTeamView

urlpatterns = [
    path(r'team/enter', EnterTeamView.as_view()),
    path(r'', HomeView.as_view()),
]
