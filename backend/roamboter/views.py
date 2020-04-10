from django.conf import settings

from django.http import JsonResponse
from django.middleware.csrf import get_token

import logging

logger = logging.getLogger("debugLogger")

def csrf(request):
    """
    The response will make sure that the csrfcookie is set.
    """
    get_token(request) # sets the csrfcookie as a side-effect.
    return JsonResponse({'success': "OK"})

def test(request):
    return JsonResponse({'test': 'OK'})
