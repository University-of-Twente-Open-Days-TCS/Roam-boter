from rest_framework import serializers
from AIapi.models import AI

import logging
logger = logging.getLogger("debugLogger")


class TeamSerializer(serializers.Serializer):
    # read-only fields
    pk = serializers.IntegerField(read_only=True)
    team_code = serializers.IntegerField(read_only=True)
    active = serializers.BooleanField(read_only=True)
    team_name = serializers.CharField(read_only=True)

    # writeable fields
    active_ai = serializers.PrimaryKeyRelatedField(queryset=AI.objects.all())

    def validate(self, data):
        # An update will be done
        if self.instance is not None:
            # check that ai belongs to the team
            ai = data['active_ai']

            if ai is not None:
                if ai.team is None:
                    raise serializers.ValidationError("The given active_ai does not belong to this team")
                elif not ai.team.pk == self.instance.pk:
                    raise serializers.ValidationError("The given active_ai does not belong to this team")

        return data

    def update(self, instance, validated_data):
        """
        Updates an existing team active champion.
        """
        instance.active_ai = validated_data.get('active_ai', instance.active_ai)
        instance.save()
        return instance


class TeamCodeSerializer(serializers.Serializer):
    # TODO: VALIDATE
    team_code = serializers.IntegerField()
