from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework import status

from django.shortcuts import get_object_or_404

from roamboter.api.permissions import InTeamPermission
from AIapi.models import AI

from .models import Team
from .serializers import TeamSerializer, TeamCodeSerializer

import dashboard.workshopmanager as wmanager


class TeamDetailAPI(APIView):
    """
    Returns a team detail
    Note that the put method is slighlty different than normal usage of APIView.
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

    def put(self, request, *args, **kwargs):
        """
        Update active champion.
        """
        team = self._get_team(request)
        active_ai_pk = request.data['active_ai_pk']

        try:
            ai = get_object_or_404(AI, pk=active_ai_pk)

            # check whether ai is valid
            if ai.team is None:
                raise PermissionDenied('You do not own this AI')

            if not ai.team.pk == team.pk:
                raise PermissionDenied('You do not own this AI')

            team.active_ai = ai
            team.save()

            serializer = TeamSerializer(team)
            return Response(serializer.data)

        except (TypeError, ValueError):
            err = ValidationError("Incorrect type. Expected a primary key but was: {}".format(str(type(active_ai_pk))))
            raise ValidationError(detail={'active_ai_pk': err.detail})


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
