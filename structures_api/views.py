from rest_framework import viewsets
from structures_api.models import Presentation
from structures_api.serializers import PresentationSerializer
from rest_framework import mixins


class CreateListRetrieveViewSet(mixins.CreateModelMixin,
                                mixins.ListModelMixin,
                                mixins.RetrieveModelMixin,
                                viewsets.GenericViewSet):
    """
    A viewset that provides `retrieve`, `create`, and `list` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.
    """
    pass


class PresentationViewSet(CreateListRetrieveViewSet):
    ''' ViewSet object for the Presentation Model '''

    queryset = Presentation.objects.all()

    serializer_class = PresentationSerializer
