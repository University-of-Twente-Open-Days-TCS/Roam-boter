from rest_framework import serializers

from .models import Bot, Simulation, BotMatch, TeamMatch, Match

from AIapi.models import AI
from AIapi.serializers import AIOverviewSerializer

from dashboard.serializers import TeamOverviewSerializer


class BotSerializer(serializers.ModelSerializer):
    """
    Serializer for Bot model.
    Bot model can not be altered through API's
    """

    class Meta:

        model = Bot
        fields = ['pk', 'name', 'difficulty', 'description']
        read_only_fields = ['pk', 'name', 'difficulty', 'description']


class SimulationOverviewSerializer(serializers.ModelSerializer):
    """
    Serializer for Simulation model.
    """

    class Meta:

        model = Simulation
        fields = ['pk', 'state']
        read_only_fields = ['pk', 'state']


class SimulationSerializer(serializers.ModelSerializer):
    """
    Detailed serializer also included simulation playback data.
    """

    class Meta:

        model = Simulation
        fields = ['pk', 'state', 'simulation']
        read_only_fields = ['pk', 'state', 'simulation']


class MatchSerializer(serializers.Serializer):
    """
    Abstract class for Match serializer.
    create and update methods should be created to allow for creating new instances.
    """
    # read only fields
    pk = serializers.IntegerField(read_only=True)
    winner = serializers.PrimaryKeyRelatedField(read_only=True)
    date = serializers.DateTimeField(read_only=True)
    simulation = SimulationOverviewSerializer(read_only=True)

    # writeable fields
    gamemode = serializers.ChoiceField(choices=Match.GameModes.choices)

    class Meta:
        abstract = True


class BotMatchSerializer(MatchSerializer):
    """
    Serializer for BotMatches.
    The team playing the botmatch needs to be passed as context to this serializer.
    """

    # read only fields
    team = serializers.PrimaryKeyRelatedField(read_only=True)

    # writeable fields
    bot = serializers.PrimaryKeyRelatedField(queryset=Bot.objects.all())
    ai = serializers.PrimaryKeyRelatedField(queryset=AI.objects.all())

    def create(self, validated_data):
        """
        Creates a BotMatch object.
        Note that this is only the object. The match has not yet been simulated.
        """

        if 'team' not in self.context:
            raise Exception("Serializer was not passed required context: 'team'")

        team = self.context['team']

        simulation = Simulation.objects.create()  # create simulation object
        botmatch = BotMatch(team=team, simulation=simulation, **validated_data)
        botmatch.save()
        return botmatch


class DetailedBotMatchSerializer(BotMatchSerializer):
    """
    Detailed Serializer of a botmatch. Includes full simulation
    """

    # override simulation
    simulation = SimulationSerializer(read_only=True)


class TeamMatchSerializer(MatchSerializer):
    """
    TeamMatch serializer.
    Includes overview of opponent and used AI.
    This serializer is made for teams to see their matches.
    """

    opponent = TeamOverviewSerializer()
    initiator = TeamOverviewSerializer()
    initiator_ai = AIOverviewSerializer()


class TeamMatchPrimaryKeySerializer(MatchSerializer):
    """
    Team Match serializer for initiating matches.
    Opponents will be selected dynamically and need to be passed as extra context.
    """

    # read only fields
    opponent = serializers.PrimaryKeyRelatedField(read_only=True)
    opponent_ai = serializers.PrimaryKeyRelatedField(read_only=True)
    initiator = serializers.PrimaryKeyRelatedField(read_only=True)

    # writeable fields
    initiator_ai = serializers.PrimaryKeyRelatedField(queryset=AI.objects.all())

    def create(self, validated_data):
        """
        Creates a Team Match
        """

        required_context = ['opponent', 'initiator']
        for key in required_context:
            if key not in self.context:
                raise Exception("Serializer was not passed required context: " + key)

        opponent = self.context['opponent']
        opponent_ai = opponent.active_ai

        if opponent_ai is None:
            raise Exception("Opponent does not have an active champion")

        initiator = self.context['initiator']

        simulation = Simulation.objects.create()
        team_match = TeamMatch(opponent=opponent, opponent_ai=opponent_ai, initiator=initiator, simulation=simulation, **validated_data)
        team_match.save()
        return team_match


class DetailedTeamMatchSerializer(TeamMatchSerializer):
    """
    Includes the full simulation
    """

    # override simulation field
    simulation = SimulationSerializer(read_only=True)
