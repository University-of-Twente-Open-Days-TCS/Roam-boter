from rest_framework import serializers
from AIapi.models import AI


class TeamSerializer(serializers.Serializer):
    # read-only fields
    id = serializers.IntegerField(read_only=True)
    team_code = serializers.IntegerField(read_only=True)
    active = serializers.BooleanField(read_only=True)
    team_name = serializers.CharField(read_only=True)

    # writeable fields
    active_ai = serializers.PrimaryKeyRelatedField(queryset=AI.objects.all(), required=False)

    def update(self, instance, validated_data):
        """
        Updates an existing team
        """
        instance.active_ai = validated_data.get('active_ai', instance.active_ai)
        instance.save()
        return instance


class TeamCodeSerializer(serializers.Serializer):
    # TODO: VALIDATE
    team_code = serializers.IntegerField()
