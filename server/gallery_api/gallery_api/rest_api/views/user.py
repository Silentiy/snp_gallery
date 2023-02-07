from rest_framework import permissions
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication

from rest_framework.authtoken.models import Token

from gallery_api.rest_api.serializers.gallery_user import GalleryUserSerializer
from gallery_api.rest_api.models.gallery_user import GalleryUser


class UserData(generics.GenericAPIView):
    """
    Endpoint to return user data
    """

    authentication_classes = [TokenAuthentication]
    serializer_class = GalleryUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_id = user.pk
        gallery_user = GalleryUser.objects.get(user_id=user_id)
        token = Token.objects.get(user_id=user_id)

        serializer = GalleryUserSerializer(gallery_user)
        return Response(serializer.data)
