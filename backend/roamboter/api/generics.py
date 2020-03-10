from rest_framework.generics import GenericAPIView

from . import mixins

class RetrieveTeamObjectAPIView(mixins.RetrieveTeamObjectMixin, GenericAPIView):
    """
    Retrieve an object.
    And checks that the object's team field is the request's team.
    Make sure to add `permission_classes = [InTeamPermission]` to your class.
    """


    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
