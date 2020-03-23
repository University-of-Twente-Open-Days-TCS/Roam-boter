from django.urls import path

from . import views

urlpatterns = [
    path(r'bots/', views.BotListAPI.as_view()),
    path(r'bots/<int:pk>/', views.BotDetailAPI.as_view()),
    path(r'simulation/<int:pk>/', views.SimulationRetrieveAPI.as_view()),
    path(r'botmatches/', views.BotMatchHistoryListAPI.as_view()),
    path(r'botmatches/<int:pk>/', views.BotMatchHistoryRetrieveAPI.as_view()),
    path(r'teammatches/', views.TeamMatchHistoryListAPI.as_view()),
    path(r'teammatches/<int:pk>/', views.TeamMatchHistoryRetrieveAPI.as_view()),
]
