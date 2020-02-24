from django.urls import include, path
from .views import HomeView

urlpatterns = [
    path(r'', HomeView.as_view()),
]
