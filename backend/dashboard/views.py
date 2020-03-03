# TODO: 
#   1. Open Workshop Session
#   2. Close Workshop Session
#   3. Generate Team Codes

from django.views import View
from django.views.generic import TemplateView

from django.contrib.auth.mixins import LoginRequiredMixin

from django.http import HttpResponse, HttpResponseRedirect

import dashboard.workshopmanager as wmanager
from .models import Workshop, Team

from .forms import GenerateTeamCodesForm, EnterTeamForm

import json


import logging
logger = logging.getLogger('debugLogger')


"""API CALL VIEWS ENTERING/LEAVING TEAMS"""
class EnterTeamView(View):
    """View that will link a session to a team. Given that team_code is valid"""

    http_method_names = ['post',]

    def post(self, request, *args, **kwargs):

        team_form = EnterTeamForm(request.POST)
        if team_form.is_valid():
            team_code = team_form.cleaned_data['team_code']

            successfully_linked = wmanager.link_user_session_to_team(team_code, request.session)

            if successfully_linked:
                return HttpResponseRedirect('/')
            else:
                return HttpResponse("Incorrect Team Code", status=400)

        else:
            error_json = json.dumps(team_form.errors)
            return HttpResponse(error_json, status=403, content_type="application/json")

class LeaveTeamView(View):
    """View removes session. This will thus remove a user from a team"""

    http_method_names = ['post',]

    def post(self, request, *args, **kwargs):
        """Removes a user session and returns user to home screen"""
        wmanager.remove_user_session(request.session)
        return HttpResponseRedirect('/')


"""API CALL VIEWS DASHBOARD"""
class OpenWorkshopView(LoginRequiredMixin, View):
    """Opens new workshop"""

    def post(self, request, *args, **kwargs):

        success = wmanager.open_workshop()

        if success:
            return HttpResponse(json.dumps({"success":"Created new workshop"}))
        else:
            return HttpResponse(json.dumps({"error":"Could not open new workshop"}))


'''This will close the current opened workshop'''
class CloseWorkshopView(LoginRequiredMixin, View):
    """Closes current open workshop"""

    def post(self, request, *args, **kwargs):

        success = wmanager.close_workshop()
        if success:
            return HttpResponse(json.dumps({"success":"Closed workshop"}))
        else:
            return HttpResponse(json.dumps({"error":"Could not close workshop"}))


class GenerateTeamCodes(LoginRequiredMixin, View):
    """Generate new team codes"""
    def post(self, request, *args, **kwargs):
        if (wmanager.all_workshops_closed()):
            return HttpResponse(json.dumps({"error":"No open workshop"}))

        else:
            form = GenerateTeamCodesForm(request.POST)

            if form.is_valid():
                amount = form.cleaned_data['amount']

                # Generate 'amount' team codes
                wmanager.generate_teamcodes(amount)
                return HttpResponse(json.dumps({"success" : "Generated Team Codes"}))

            else:
                return HttpResponse(json.dumps(form.errors), status=400)



"""NON-API VIEWS FOR DASHBOARD"""

'''
Shows the home screen for the dashboard. And login screen of the dashboard if a user is not logged in.
'''
class DashboardView(LoginRequiredMixin, TemplateView):

    template_name = "dashboard.html"

    '''Add dashboard context'''
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        cur_workshop = Workshop.objects.filter(workshop_open=True).first() # Get first open workshop
        context['workshop'] = cur_workshop

        teams = Team.objects.filter(workshop=cur_workshop)
        context['teams'] = teams


        return context


