from rest_framework.response import Response

from service_objects.services import Service

from gallery_api.rest_api.models import Photo
from gallery_api.rest_api.serializers.photo import PhotoListSerializer


class PhotoGetProcess(Service):

    def process(self):
        photos = Photo.objects.all()
        serializer = PhotoListSerializer(photos, many=True)
        return Response(serializer.data)
