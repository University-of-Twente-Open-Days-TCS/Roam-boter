# TODO: 
#   1. Open Workshop Session
#   2. Close Workshop Session
#   3. Generate Team Codes

from django.views import View
from django.views.generic import TemplateView

from django.contrib.auth.mixins import LoginRequiredMixin

from django.http import HttpResponse, HttpResponseRedirect

from .models import Workshop, Team

from .forms import GenerateTeamCodesForm
from .workshopmanager import get_cur_workshop, all_workshops_closed, generate_teamcodes

import json


import logging
logger = logging.getLogger('debugLogger')


''' This view will open a new workshop '''
class OpenWorkshopView(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):
            if not all_workshops_closed():
                return HttpResponse(json.dumps({ "error" : "Close older workshop first" }), content_type="application/json", status=405)
            else:
                # Create new open workshop
                workshop = Workshop(workshop_open=True)
                workshop.save()
                return HttpResponse(json.dumps({ "success" : "Workshop created" }), content_type="application/json")


'''This will close the current opened workshop'''
class CloseWorkshopView(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):
        # Get open workshops
        open_workshops = Workshop.objects.filter(workshop_open=True)

        # Check whether there is an open workshop
        if (open_workshops.count() == 0):
            return HttpResponse(json.dumps({ "error" : "No open workshop" }), content_type="application/json")

        # Close the current workshop
        else:
            cur_workshop = open_workshops.first() # Get first open workshop
            cur_workshop.workshop_open = False
            cur_workshop.save()
            return HttpResponse(json.dumps({ "success" : "Workshop closed"}), content_type="application/json")

"""
Will generate team codes for the current open workshop
"""
class GenerateTeamCodes(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):
        if (all_workshops_closed()):
            return HttpResponse("No open workshop", status=403)

        else:
            form = GenerateTeamCodesForm(request.POST)

            if form.is_valid():
                amount = form.cleaned_data['amount']

                # Generate 'amount' team codes
                cur_workshop = get_cur_workshop()
                generate_teamcodes(cur_workshop, amount)
                return HttpResponse(json.dumps({"success" : "Generated Team Codes"}))

            else:
                return HttpResponse(json.dumps(form.errors), status=400)




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


