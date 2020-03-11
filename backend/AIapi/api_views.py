from django.http import Http404

from rest_framework import status, generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response

from roamboter.api.permissions import InTeamPermission
from roamboter.api.mixins import RetrieveTeamObjectMixin, DestroyTeamObjectMixin, UpdateTeamObjectMixin

from .serializers import AISerializer
from .models import AI
from dashboard.models import Team


import logging
logger = logging.getLogger("debugLogger")

class AIList(APIView):

    permission_classes = [InTeamPermission]

    def get(self, request):
        """Get list of AI's"""
        team_pk = request.session['team_id']
        ai_list = AI.objects.filter(team=team_pk).all()
        serializer = AISerializer(ai_list, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new AI"""
        team_pk = request.session['team_id']
        team = Team.objects.get(pk=team_pk)

        serializer = AISerializer(data=request.data, context={'team': team})

        if serializer.is_valid():
            # save new AI 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AIDetail(RetrieveTeamObjectMixin, DestroyTeamObjectMixin, UpdateTeamObjectMixin, generics.GenericAPIView):

    permission_classes = [InTeamPermission]

    queryset = AI.objects.all()
    serializer_class = AISerializer


    def get(self, request, *args, **kwargs):
        """
        Get a single AI
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Update an existing AI
        """
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """
        Partially update an existing AI
        """
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Delete Existing AI
        """
        return self.destroy(request, *args, **kwargs)

