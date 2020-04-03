from rest_framework import serializers

from .models import AI

from .grammar.converter import is_valid_aijson

import json

import logging
logger = logging.getLogger("debugLogger")


class AIOverviewSerializer(serializers.Serializer):

    pk = serializers.IntegerField(read_only=True)
    team = serializers.PrimaryKeyRelatedField(read_only=True)
    name = serializers.CharField(max_length=20)


class AISerializer(AIOverviewSerializer):

    ai = serializers.JSONField()

    def validate_ai(self, value):
        # Checks whether aijson is valid
        json_string = json.dumps(value)
        valid = is_valid_aijson(json_string)
        if not valid:
            logger.debug(json_string)
            raise serializers.ValidationError("Invalid AI Json")
        return value

    def validate_name(self, value):
        # Only validate name on creation of new AI
        if self.instance is None and self.initial_data is not None:
            # On creation of object
            name = self.initial_data['name']
            team = self.context['team']
            if AI.objects.filter(team=team, name=name).exists():
                raise serializers.ValidationError("Duplicate Name")
        return value

    def create(self, validated_data):
        """Returns an AI instance from the serializer"""
        # convert json to actual text

        json_string = json.dumps(validated_data['ai'])
        name = validated_data['name']

        team = self.context['team']
        return AI.objects.create(ai=json_string, name=name, team=team)

    def update(self, instance, validated_data):
        # update name and ai
        if 'ai' in validated_data:
            # convert to string and update instance
            json_string = json.dumps(validated_data['ai'])
            instance.ai = json_string

        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance
