from rest_framework import viewsets
from rest_framework import permissions
from django.contrib.auth.models import User
from gallery_api.rest_api.serializers.user import UserSerializer, TokenSerializer, GalleryUserSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics
from rest_framework.response import Response
from gallery_api.rest_api.models.gallery_user import GalleryUser
from rest_framework.authtoken.models import Token


# class UserViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows users to be viewed or edited.
#     """
#     queryset = User.objects.all().order_by('-date_joined')
#     serializer_class = UserSerializer
#     permission_classes = [permissions.IsAuthenticated]


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
        print(user_id)
        gallery_user = GalleryUser.objects.get(user_id=user_id)
        token = Token.objects.get(user_id=user_id)

        serializer = GalleryUserSerializer(gallery_user)  # UserSerializer()
        return Response(serializer.data)
