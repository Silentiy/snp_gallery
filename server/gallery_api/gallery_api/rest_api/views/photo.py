from rest_framework import generics
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from gallery_api.rest_api.models.photo import Photo
from gallery_api.rest_api.serializers.photo import PhotoListSerializer


photo_list_201_response = openapi.Response("CREATED", PhotoListSerializer)


class PhotoListView(generics.GenericAPIView):
    """
    API endpoint that allows photos to be viewed or edited.
    """
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [FormParser, MultiPartParser]

    serializer_class = PhotoListSerializer

    def get(self, request):
        photos = Photo.objects.all()
        serializer = PhotoListSerializer(photos, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(responses={201: photo_list_201_response, 400: "BAD_REQUEST", 401: "NOT_AUTHORIZED"})
    def post(self, request):
        user = request.user
        data = request.data

        serializer = PhotoListSerializer(data=data)

        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
