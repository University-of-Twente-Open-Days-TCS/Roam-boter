from rest_framework import serializers

from .models import Team

class TeamSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    team_code = serializers.IntegerField(read_only=True)
    team_name = serializers.CharField(max_length=20, required=False, allow_blank=True)
    active = serializers.BooleanField(read_only=True)
