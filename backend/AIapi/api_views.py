from rest_framework.views import APIView
from rest_framework.response import Response

from roamboter.api_permission import InTeamPermission

from .serializers import AISerializer
from .models import AI


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
        # will be a json dict
        aijson = request.data['root']
        name = request.data['name']
        team_pk = request.session['team_id']

        serializer = AISerializer(data={"aijson":aijson, "team":team_pk, 'name':name})

        if serializer.is_valid():
            # save new AI 
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)






