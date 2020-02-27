from django.views import View
from django.views.generic import TemplateView

from django.http import HttpResponse, HttpResponseRedirect

from django.contrib import messages


from .forms import EnterTeamForm
from dashboard.workshopmanager import link_session_to_team




import json

import logging
logger = logging.getLogger("debugLogger")

# Create your views here.
class HomeView(TemplateView):
    template_name = "home.html"

# Views for creating a session and linking a user to a team.

# View which a user can use to enter a team with the team code. 
class EnterTeamView(View):

    http_method_names = ['post',]

    def post(self, request, *args, **kwargs):

        team_form = EnterTeamForm(request.POST)
        if team_form.is_valid():
            # Link session to team TODO:
            team_code = team_form.cleaned_data['team_code']

            successfully_linked = link_session_to_team(team_code, request.session)

            if successfully_linked:
                return HttpResponseRedirect('/')
            else:
                return HttpResponse("Incorrect Team Code", status=400)

        else:
            error_json = json.dumps(team_form.errors)
            return HttpResponse(error_json, status=403, content_type="application/json")

