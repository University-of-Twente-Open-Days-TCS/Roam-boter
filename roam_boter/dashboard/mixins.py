from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect

class EnteredTeamRequired(object):
    """Mixin that will automatically ensure a user can only access a view if he entered a team"""
    # Url to redirect user to
    redirect_url = None

    def dispatch(self, request, *args, **kwargs):
        """Check whether user entered a team"""
        if 'team_id' in request.session:
            # User has access
            return super().dispatch(request, *args, **kwargs)

        if self.redirect_url is None:
            raise PermissionDenied("You are not in a team")
        else:
            return HttpResponseRedirect(self.redirect_url)

