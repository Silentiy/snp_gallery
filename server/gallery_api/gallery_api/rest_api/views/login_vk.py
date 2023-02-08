from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions

from gallery_api.rest_api.serializers.login_vk import LoginVKSerializer
from gallery_api.rest_api.services.login_vk import LoginVKProcess
from gallery_api.rest_api.services.logout_vk import LogoutVKProcess


class LoginVK(generics.GenericAPIView):
    """
    Endpoint to post code given by VK API,
    retrieve VK API token, user data and create new user in DB
    If login successful, returns token to get user data
    """

    authentication_classes = [TokenAuthentication]
    serializer_class = LoginVKSerializer

    def post(self, request):
        return LoginVKProcess.execute({
             'code': request.data["code"],
             'network': request.data["network"],
        })


class LoginVKDeleteToken(generics.GenericAPIView):
    """
    Endpoint to delete API token from database (to log user out)
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        return LogoutVKProcess.execute({
            "user_id": user.pk,
        })
