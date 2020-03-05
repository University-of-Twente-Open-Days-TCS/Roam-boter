from rest_framework import serializers

from .models import AI
from dashboard.models import Team

from .converter import is_valid_aijson

import json


class AISerializer(serializers.Serializer):

    aijson = serializers.JSONField()
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())
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
        json_string = json.dumps(validated_data['aijson'])
        return AI.objects.create(aijson=json_string, team=validated_data['team'], name=validated_data['name'])

    def update(self, instance, validated_data):
        # only allow for the name and aijson to be updated.   
        if validated_data['aijson'] is not None:
            # convert to string and update instance
            json_string = json.dumps(validated_data['aijson'])
            instance.aijson = json_string

        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

