from django.urls import include, path

from . import views

urlpatterns = [
    path(r'', views.AIList.as_view()),
    path(r'<int:pk>/', views.AIDetail.as_view()),
]
