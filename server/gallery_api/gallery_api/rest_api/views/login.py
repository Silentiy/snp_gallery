from allauth.socialaccount.providers.vk.views import VKOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LoginView
from rest_framework import status
from rest_framework.exceptions import APIException


class BadCodeException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Social authentication provider did not return access token: code is invalid or expired."
    default_code = "service_unavailable"


class CustomSocialLoginView(SocialLoginView):
    def __init__(self, **kwargs):
        super().__init__()
        self.callback_url = None
        self.request = None

    def post(self, request, *args, **kwargs):
        self.request = request
        self.callback_url = request.data["callback_url"]
        print(self.callback_url)
        return LoginView.post(self, request, *args, **kwargs)


class SaferOAuth2Client(OAuth2Client, object):
    def get_access_token(self, code, pkce_code_verifier=None):
        try:
            return OAuth2Client.get_access_token(self, code, pkce_code_verifier=None)
        except Exception as e:
            raise BadCodeException(e)


class LoginVK(CustomSocialLoginView):
    adapter_class = VKOAuth2Adapter
    client_class = SaferOAuth2Client  # SaferOAuth2Client


class LoginGoogle(CustomSocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = SaferOAuth2Client  # OAuth2Client
