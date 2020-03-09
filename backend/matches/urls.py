from django.urls import include, path

from . import api_views

urlpatterns = [
    path(r'bots/', api_views.BotListAPI.as_view()),
    path(r'bots/<int:pk>/', api_views.BotDetailAPI.as_view()),
    path(r'botmatches/', api_views.BotMatchHistoryListAPI.as_view()),
    path(r'botmatches/<int:pk>/', api_views.BotMatchHistoryRetrieveAPI.as_view()),
]
