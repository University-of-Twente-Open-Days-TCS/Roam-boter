from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
"""
These mixins are designed to work with generic.GenericAPIView
All these mixins are related to working on models which have a team field.
The request's session team's id is compared to the object. 
And the action is completed if the session owns the object.
"""

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

class UpdateTeamObjectMixin(object):
    """
    Update a team object
    """

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if instance.team.pk != request.session['team_id']:
            raise PermissionDenied("Your team does not own this object")

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

