from rest_framework import permissions

"""Custom permissions for rest_framework"""

class InTeamPermission(permissions.BasePermission):
    """
    Only allow users that are in a team.
    """
    message = "You need to be in a team"

    def has_permission(self, request, view):
        session = request.session

        if session is None:
            return False

        if 'team_id' not in session:
            return False

        return True

