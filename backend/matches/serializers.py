from rest_framework import serializers

from .models import Bot, Simulation, BotMatch, Match
from AIapi.models import AI


class BotSerializer(serializers.ModelSerializer):
    """
    Serializer for Bot model.
    Bot model can not be altered through API's
    """

    class Meta:

        model = Bot
        fields = ['pk', 'name', 'difficulty', 'description']
        read_only_fields = ['pk', 'name', 'difficulty', 'description']

class SimulationSerializer(serializers.ModelSerializer):
    """
    Serializer for Simulation model.
    """

    class Meta:

        model = Simulation
        fields = ['pk', 'state']

class SimulationDetailSerializer(SimulationSerializer):
    """
    Detailed serializer also included simulation playback data.
    """

    simulation = serializers.JSONField()


class BotMatchSerializer(serializers.Serializer):
    """
    Serializer for BotMatches.
    The team pk needs to be passed as context to this serializer.
    The serializer excludes simulation field.
    To get the simulation field use `BotMatchDetailedSerializer`.
    """

    pk = serializers.IntegerField(read_only=True)
    winner = serializers.PrimaryKeyRelatedField(read_only=True)
    date = serializers.DateTimeField(read_only=True)
    team = serializers.PrimaryKeyRelatedField(read_only=True)
    simulation = SimulationSerializer(read_only=True)

    #non read-only fields
    gamemode = serializers.ChoiceField(choices=Match.GameModes.choices)
    bot = serializers.PrimaryKeyRelatedField(queryset=Bot.objects.all())
    ai = serializers.PrimaryKeyRelatedField(queryset=AI.objects.all())

    def create(self, validated_data):
        """
        Creates a BotMatch object.
        Note that this is only the object. The match has not yet been simulated.
        """

        # get team pk from context
        team = self.context['team']

        gamemode = validated_data['gamemode']
        bot = validated_data['bot']
        ai = validated_data['ai']

        simulation = Simulation.objects.create() #create simulation object
        botmatch = BotMatch(team=team, simulation=simulation, **validated_data)
        botmatch.save()
        return botmatch
