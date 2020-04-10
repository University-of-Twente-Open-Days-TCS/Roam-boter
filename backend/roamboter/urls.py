"""roamboter URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import include, url

from django.contrib import admin
from django.urls import path

import AIapi.urls as AIapi_urls
import dashboard.urls as dashboard_urls
import matches.urls as matches_urls

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),                    # standard django admin urls
    path('api-auth/', include('rest_framework.urls')),  # rest_framework urls 
    #Our apps url configuration
    path(r'ai/', include(AIapi_urls)),                  # saving and getting AI's
    path(r'matches/', include(matches_urls)),           # playing matches and retrieving bots.
    path(r'', include(dashboard_urls)),
    path(r'csrf/', views.csrf),                         # sets csrf cookie.
    path(r'test/', views.test),                         # ping test
]




if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    #serve static from development server
    urlpatterns += staticfiles_urlpatterns()
