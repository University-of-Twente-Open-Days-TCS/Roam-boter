from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from django.core.exceptions import PermissionDenied
from django.http import Http404

from roamboter.api.permissions import InTeamPermission
from roamboter.api.mixins import RetrieveTeamObjectMixin, DestroyTeamObjectMixin

from dashboard import workshopmanager as wmanager
from dashboard.models import Team


from .models import Bot, Simulation, BotMatch, TeamMatch
from .serializers import BotSerializer, BotMatchSerializer, TeamMatchPrimaryKeySerializer, TeamMatchSerializer, DetailedTeamMatchSerializer, SimulationSerializer
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


class SimulationRetrieveAPI(generics.RetrieveAPIView):
    """
    API that retrieves an simulation.
    A simulation is anonymous so anyone can access.
    """
    queryset = Simulation.objects.all()
    serializer_class = SimulationSerializer


class BotMatchHistoryListAPI(APIView):
    """
    Retrieve match history.
    The bot match history related to session's the team_id.
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

            # Copy AI for match replay, so that when the AI is altered, this one will still show up next to replay.
            ai = botmatch.ai
            ai.listed = False
            ai.pk = None
            ai.save()

            botmatch.ai = ai
            botmatch.save()

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
    serializer_class = BotMatchSerializer

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


class TeamMatchHistoryListAPI(APIView):
    """
    Retrieves a list of team matches related to the team.
    NOTE: post uses a different serializer than get.
    """

    permission_classes = [InTeamPermission]

    def get(self, request):
        """
        Returns a list of played team matches
        """

        team_pk = request.session['team_id']
        team_matches = TeamMatch.objects.filter(initiator_id=team_pk).all()
        serializer = TeamMatchSerializer(team_matches, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Play a team match.
        opponent team is randomly selected
        TODO: PREVENT SPAM
        """

        # get relevant context
        team_pk = request.session['team_id']
        initiator = Team.objects.get(pk=team_pk)

        try:
            opponent = self._match_against_opponent(initiator)
        except Exception:
            return Response({"error": "Could not find an appropriate opponent, please try again later."}, status=status.HTTP_423_LOCKED)

        context = {'opponent': opponent, 'initiator': initiator}

        serializer = TeamMatchPrimaryKeySerializer(data=request.data, context=context)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _match_against_opponent(self, initiator):
        """
        Finds an opponent to play against
        """
        cur_workshop = wmanager.get_cur_workshop()
        potential_opponents = Team.objects.exclude(pk=initiator.id).filter(active_ai__isnull=False)
        if potential_opponents.exists():
            # select a random opponent
            opponent = potential_opponents.order_by("?").first()
            return opponent
        else:
            raise Exception("Could not find appropriate opponent")


class TeamMatchHistoryRetrieveAPI(APIView):
    """
    Gets a detailed overview of the match including simulation
    """

    permission_classes = [InTeamPermission]

    def _get_object(self, request, **kwargs):
        team_pk = request.session['team_id']

        match_pk = kwargs['pk']
        match = TeamMatch.objects.get(pk=match_pk)

        # make sure match exists
        if match is None:
            raise Http404("Match does not exist")

        # make sure match belongs to this team
        if not match.initiator.pk == team_pk:
            raise PermissionDenied("Your team did not initiate this match")

        return match

    def get(self, request, *args, **kwargs):
        """
        Gets a detailed match
        """
        match = self._get_object(request, **kwargs)
        serializer = DetailedTeamMatchSerializer(match)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a match
        """
        match = self._get_object(request, **kwargs)
        match.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
