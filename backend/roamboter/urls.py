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

import home.urls as home_urls
import AIapi.urls as AIapi_urls
import dashboard.urls as dashboard_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path(r'ai/', include(AIapi_urls)),
    path(r'dashboard/', include(dashboard_urls)),
    path(r'', include(home_urls)),]



if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    #serve static from development server
    urlpatterns += staticfiles_urlpatterns()
