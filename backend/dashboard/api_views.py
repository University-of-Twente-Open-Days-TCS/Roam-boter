from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status

from roamboter.api.permissions import InTeamPermission

from .models import Team
from .serializers import TeamSerializer, TeamCodeSerializer

import dashboard.workshopmanager as wmanager


class TeamDetailAPI(APIView):
    """
    Returns a team detail
    """

    permission_classes = [InTeamPermission]

    def _get_team(self, request):
        pk = request.session['team_id']
        return Team.objects.filter(id=pk).first()

    def get(self, request):
        """
        Return the details of team associated with this request
        """
        team = self._get_team(request)

        serializer = TeamSerializer(team)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        """
        Partial update
        """
        team = self._get_team(request)

        serializer = TeamSerializer(team, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
