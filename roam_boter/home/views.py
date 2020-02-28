from django.views import View
from django.views.generic import TemplateView

from django.http import HttpResponse, HttpResponseRedirect

from django.contrib import messages


from dashboard.mixins import EnteredTeamRequired
import dashboard.workshopmanager as wmanager



import json

import logging
logger = logging.getLogger("debugLogger")

# Create your views here.
class HomeView(EnteredTeamRequired, TemplateView):
    """Home View view that returns the home screen for user's that entered a team"""

    redirect_url = '/enter/'
    template_name = "home.html"


class EnterTeamPageView(TemplateView):
    """View that returns the page where people can enter teams"""

    template_name = "enter_team.html"

