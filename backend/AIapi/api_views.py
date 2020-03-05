from django.http import Http404

from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response

from roamboter.api_permission import InTeamPermission

from .serializers import AISerializer
from .models import AI
from dashboard.models import Team


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

        serializer = AISerializer(data=request.data, context={'team_pk': team})

        if serializer.is_valid():
            # save new AI 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AIDetail(APIView):

    permission_classes = [InTeamPermission]

    def get_object(self, pk, team_pk):
        """
        Returns the AI object. Only returns the AI if the AI belongs to the users team.
        """
        try:
            ai = AI.objects.get(pk=pk)
            if ai.team.pk == team_pk:
                return ai
            else:
                raise PermissionDenied(detail="AI does not belong to your team")
        except AI.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        """
        Get a single AI
        """
        ai = self.get_object(pk, request.session['team_id'])
        serializer = AISerializer(ai)
        return Response(serializer.data)


    def put(self, request, pk):
        """
        Update an existing AI
        """
        ai = self.get_object(pk, request.session['team_id'])
        serializer = AISerializer(ai, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        ai = self.get_object(pk, request.session['team_id'])
        ai.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


