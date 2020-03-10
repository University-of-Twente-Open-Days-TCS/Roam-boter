from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status

class RetrieveTeamObjectMixin(object):
    """
    Retrieve a model instance which belongs to a team.
    Requires that the retrieved model has a field named 'team', which refers to the Team that owns the model.
    """
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # check that the object belongs to the team
        team_pk = request.session['team_id']
        if team_pk == instance.team.pk:
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            raise PermissionDenied("Your team does not own this object")


class DestroyTeamObjectMixin(object):
    """
    Destroys a team object
    """

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # check that instance belongs to team
        team_pk = request.session['team_id']
        if team_pk == instance.team.pk:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied("Your team does not own this object")
