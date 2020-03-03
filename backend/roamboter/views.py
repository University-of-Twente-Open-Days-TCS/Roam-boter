from django.conf import settings

from django.http import JsonResponse
from django.middleware.csrf import get_token

import logging

logger = logging.getLogger("debugLogger")

def csrf(request):
    """Does nothing, but as a side effect the csrf token cookie will be set."""
    get_token(request) # sets the csrfcookie as a side-effect.
    return JsonResponse({'success': "OK"})

def test(request):
    return JsonResponse({'test': 'OK'})
