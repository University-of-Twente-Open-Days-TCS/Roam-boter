from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework import status

from roamboter.api.permissions import InTeamPermission

from .models import Team
from .serializers import TeamSerializer



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

        team_id = session['team_id']
        team = self.get_team(team_id)

        serializer = TeamSerializer(team)
        return Response(serializer.data)



