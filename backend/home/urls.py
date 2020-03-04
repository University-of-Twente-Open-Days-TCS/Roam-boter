from django.urls import include, path
from .views import HomeView, EnterTeamPageView

urlpatterns = [
    path(r'enter/', EnterTeamPageView.as_view(), name="enter_team"),
    path(r'', HomeView.as_view()),
]
