from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied


from roamboter.api.permissions import InTeamPermission
from roamboter.api.mixins import RetrieveTeamObjectMixin, DestroyTeamObjectMixin

from dashboard.models import Team


from .models import Bot, BotMatch
from .serializers import BotSerializer, BotMatchSerializer, BotMatchDetailedSerializer
from .matchplayer import SIMULATION_PLAYER

class BotListAPI(generics.ListAPIView):
    """
    API that lists all possible bots
    """
    queryset = Bot.objects.all()
    serializer_class = BotSerializer

class BotDetailAPI(generics.RetrieveAPIView):
    """
    API that retrieves a single bot
    """
    queryset = Bot.objects.all()
    serializer_class = BotSerializer


class BotMatchHistoryListAPI(APIView):
    """
    Retrieve match history.
    The bot match history related to session's the team_id.
    The list of botmatches do not include simulations.
    Use the `BotMatchHistoryRetrieveAPI` to get the simulation.
    """

    permission_classes = [InTeamPermission]

    def get(self, request):
        """
        Returns a list of played matches
        """

        team_pk = request.session['team_id']
        botmatches = BotMatch.objects.filter(team=team_pk).all()
        serializer = BotMatchSerializer(botmatches, many=True)
        return Response(serializer.data)


    def post(self, request):
        """
        Play bot match against a bot
        """

        team_pk = request.session['team_id']
        team = Team.objects.get(pk=team_pk)

        serializer = BotMatchSerializer(data=request.data, context={'team': team})

        if serializer.is_valid():
            botmatch = serializer.save()
            SIMULATION_PLAYER.run_botmatch(botmatch)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BotMatchHistoryRetrieveAPI(RetrieveTeamObjectMixin, DestroyTeamObjectMixin, generics.GenericAPIView):
    """
    API that retrieves a single match
    """

    permission_classes = [InTeamPermission]

    queryset = BotMatch.objects.all()
    serializer_class = BotMatchDetailedSerializer

    def get(self, request, *args, **kwargs):
        """
        Get Match Details
        """
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Delete match
        """
        return self.destroy(request, *args, **kwargs)



