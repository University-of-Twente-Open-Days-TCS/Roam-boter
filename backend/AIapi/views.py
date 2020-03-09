from django.shortcuts import render

from django.http import HttpResponse
from django.views import View

import json


# Create your views here.

# This is an example view. It shows how to process a API request from the client. 
class SaveAIView(View):

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            post_data = json.loads(request.body)
            # Do something with the data 

            # Send a response
            response = {"responsedata" : "todo" }
            return HttpResponse(json.dumps(response), content_type='application/json')
        else:
           return HttpResponse('Unauthorized')

