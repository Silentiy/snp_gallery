from rest_framework import permissions
from rest_framework import generics
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework import status

from gallery_api.models import GalleryUser
from gallery_api.permissions import IsOwnerOrReadOnly
from gallery_api.serializers.gallery_user import GalleryUserSerializer


class GalleryUserView(generics.GenericAPIView):
    """
    Endpoint to create or change user data specific for gallery app
    (nickname, avatar and about me)
    """

    authentication_classes = [TokenAuthentication]
    serializer_class = GalleryUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [FormParser, MultiPartParser]

    def put(self, request):
        user = request.user
        user_id = user.pk
        data_query_dict = request.data
        data = data_query_dict.copy()
        data.setdefault("user_id", user_id)
        print(data)
        serializer = GalleryUserSerializer(data=data)

        if serializer.is_valid():
            try:
                gallery_user = GalleryUser.objects.get(user_id=user_id)
                serializer.update(gallery_user, data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except GalleryUser.DoesNotExist:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        raise NotImplementedError
