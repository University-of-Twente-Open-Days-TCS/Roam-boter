from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework import status

from roamboter.api.permissions import InTeamPermission

from .models import Team
from .serializers import TeamSerializer, TeamCodeSerializer
from .forms import EnterTeamForm

import dashboard.workshopmanager as wmanager


class TeamDetailAPI(APIView):
    """
    Returns a team detail
    """

    permission_classes = [InTeamPermission]

    def get_team(self, pk):
        return Team.objects.filter(id=pk).first()

    def get(self, request):
        """
        Return the details of team associated with this request
        """
        team_id = request.session['team_id']
        team = self.get_team(team_id)

        serializer = TeamSerializer(team)
        return Response(serializer.data)


class EnterTeamAPI(APIView):
    """
    Enter and leave a team.
    """

    def post(self, request, *args, **kwargs):
        """
        Enter a team using a team code.
        """
        serializer = TeamCodeSerializer(data=request.data)

        if serializer.is_valid():
            team_code = serializer.validated_data['team_code']
            successfully_linked = wmanager.link_user_session_to_team(team_code, request.session)

            if successfully_linked:
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        """
        Leave a team.
        """
        wmanager.remove_user_session(request.session)
        return Response(status=status.HTTP_204_NO_CONTENT)
