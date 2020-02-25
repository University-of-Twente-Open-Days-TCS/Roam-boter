from django.urls import include, path

from . import views

urlpatterns = [
    path(r'save', views.SaveAIView),
]
