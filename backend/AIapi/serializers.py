from rest_framework import serializers

from .models import AI
from dashboard.models import Team

from .grammar.converter import is_valid_aijson

import json


class AISerializer(serializers.Serializer):

    pk = serializers.IntegerField(read_only=True)
    ai = serializers.JSONField()
    team = serializers.PrimaryKeyRelatedField(read_only=True)
    name = serializers.CharField(max_length=20)

    def validate_aijson(self, value):
        # Checks whether aijson is valid
        json_string = json.dumps(value)
        valid = is_valid_aijson(json_string)
        if not valid:
            raise serializers.ValidationError("Invalid AI Json")
        return value

    def create(self, validated_data):
        """Returns an AI instance from the serializer"""
        # convert json to actual text
        json_string = json.dumps(validated_data['ai'])
        name = validated_data['name']

        team_pk = self.context['team_pk']
        return AI.objects.create(ai=json_string, name=name, team=team_pk)

    def update(self, instance, validated_data):
        # only allow for the name and ai to be updated.   
        if validated_data['ai'] is not None:
            # convert to string and update instance
            json_string = json.dumps(validated_data['ai'])
            instance.ai = json_string

        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

