from rest_framework import serializers

from AIapi.models import AI
from AIapi.serializers import AIOverviewSerializer

import logging
logger = logging.getLogger("debugLogger")


class TeamSerializer(serializers.Serializer):
    # read-only fields
    pk = serializers.IntegerField(read_only=True)
    team_code = serializers.IntegerField(read_only=True)
    active = serializers.BooleanField(read_only=True)
    team_name = serializers.CharField(read_only=True)
    active_ai = AIOverviewSerializer()


class TeamCodeSerializer(serializers.Serializer):
    # TODO: VALIDATE
    team_code = serializers.IntegerField()
