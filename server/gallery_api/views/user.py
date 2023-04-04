from rest_framework import permissions
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication

from gallery_api.serializers.user import UserSerializer


class UserData(generics.GenericAPIView):
    """
    Endpoint to return user data
    """

    authentication_classes = [TokenAuthentication]
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
