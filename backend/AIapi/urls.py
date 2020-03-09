from django.urls import include, path

from . import views
from . import api_views

urlpatterns = [
    path(r'save/', views.SaveAIView.as_view()),
    path(r'', api_views.AIList.as_view()),
    path(r'<int:pk>/', api_views.AIDetail.as_view()),
]
