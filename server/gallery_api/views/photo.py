from rest_framework import generics
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework import permissions

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from gallery_api.serializers.photo import PhotoListSerializer
from gallery_api.services.photo_get import PhotoGetProcess
from gallery_api.services.photo_post import PhotoPostProcess

photo_list_201_response = openapi.Response("CREATED", PhotoListSerializer)


class PhotoListView(generics.GenericAPIView):
    """
    API endpoint that allows photos to be viewed or posted.
    """

    # authentication_classes = [TokenAuthentication, BasicAuthentication]
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [FormParser, MultiPartParser]

    serializer_class = PhotoListSerializer

    def get(self, request):
        return PhotoGetProcess.execute({})

    @swagger_auto_schema(
        responses={
            201: photo_list_201_response,
            400: "BAD_REQUEST",
            401: "NOT_AUTHORIZED",
        }
    )
    def post(self, request):
        return PhotoPostProcess.execute(
            {"user_id": request.user.pk, "data": request.data}
        )
