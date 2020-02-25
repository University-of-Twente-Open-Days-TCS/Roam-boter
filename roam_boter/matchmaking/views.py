from django.shortcuts import render

from django.http import HttpResponse
from django.views import View

# Create your views here.
class SaveAIView(View):

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            # process AI 
            return HttpResponse('just text')
        else:
           return HttpResponse('Unauthorized')

    def get(self, request, *args, **kwargs):
        print("Hello AI VIEW!")
        return HttpResponse('<html><body>hello</body></html>')
