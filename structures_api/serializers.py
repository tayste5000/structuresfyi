from rest_framework import serializers
from structures_api.models import Presentation


class PresentationSerializer(serializers.ModelSerializer):
    ''' Serializer class for the presentation model '''

    class Meta:
        model = Presentation
        fields = ('id', 'presentation', 'created_at')