
from rest_framework import generics
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from decouple import config
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from rest_framework import permissions
import requests
from django.contrib.auth.models import User

from gallery_api.rest_api.models.gallery_user import GalleryUser
from gallery_api.rest_api.serializers.login_vk import LoginVKSerializer
from gallery_api.rest_api.serializers.user import GalleryUserSerializer

VK_APP_SECRET = config("VK_APP_SECRET")

class LoginVK(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    serializer_class = LoginVKSerializer

    @staticmethod
    def request_access_token(code):
        access_key_url = f"https://oauth.vk.com/access_token?client_id=51536587" \
                         f"&client_secret={VK_APP_SECRET}" \
                         f"&redirect_uri=http://localhost:8080/client/index.html&code={code}"
        try:
            access_token_response = requests.get(access_key_url)
            access_token_data = access_token_response.json()
            access_token = access_token_data.get("access_token")
            if access_token:
                return access_token_data
            else:  # code was invalid, so we did not get access_token
                print(f"VK access_token was not obtained: {access_token_data['error_description']}")
                return None
        except Exception as e:
            print(f"Exception has occurred while attempting to request VK access_token: {e}")
            return None

    @staticmethod
    def request_user_data(user_social_id, access_token):
        user_data_url = f"https://api.vk.com/method/users.get?user_ids={user_social_id}&" \
                        f"fields=photo_100,screen_name&access_token={access_token}&v=5.131"
        try:
            user_response = requests.get(user_data_url)
            user_data_json = user_response.json()
            user_data = user_data_json.get("response")
            if user_data:
                return user_data[0]
            else:
                print(f"VK user_data was not obtained: {user_data['error']['error_msg']}")
                return None
        except Exception as e:
            print(f"Exception has occurred while attempting to get VK user_data: {e}")

    @staticmethod
    def retrieve_user_data(user_raw_data, token_raw_data, code_request_data):
        user_data = dict()

        user_data["social_avatar_url"] = user_raw_data["photo_100"]
        user_data["social_login_provider"] = code_request_data["network"]
        user_data["social_user_id"] = token_raw_data["user_id"]
        user_data["social_access_token"] = token_raw_data["access_token"]

        user_data["user"] = dict()
        user_data["user"]["email"] = token_raw_data["email"]
        user_data["user"]["first_name"] = f"{user_raw_data['first_name']}"
        user_data["user"]["last_name"] = user_raw_data["last_name"]
        user_data["user"]["username"] = f"{user_data['social_login_provider']}_{user_raw_data['screen_name']}"

        print(user_data)

        return user_data

    def is_existing_user(self, user_data):
        print("get_user", self.get_user(user_data))
        return True if self.get_user(user_data) is not None else False

    @staticmethod
    def get_gallery_user(user_data):
        try:
            gallery_user = GalleryUser.objects.filter(social_login_provider=user_data["social_login_provider"],
                                                      social_user_id=user_data["social_user_id"])[0]
        except:
            gallery_user = None
        return gallery_user

    def get_user(self, user_data):
        gallery_user = self.get_gallery_user(user_data)
        if gallery_user:
            user_id = gallery_user.user_id
            return User.objects.get(pk=user_id)
        return None

    @staticmethod
    def create_user(user_data):
        serializer = GalleryUserSerializer(data=user_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return user
        print("serializer.errors in create_user", serializer.errors)
        return serializer.errors

    def update_user(self, gallery_user, user_data):
        print("inside_update")
        username = user_data["user"].pop("username")
        serializer = GalleryUserSerializer(gallery_user, data=user_data, partial=True)
        print("serializer initialized", serializer)
        if serializer.is_valid(raise_exception=True):
            user = serializer.update(gallery_user, user_data)
            return user
        print("Update?", serializer.errors)
        return serializer.errors

    @staticmethod
    def generate_token(user):
        user_id = user.pk
        try:
            old_token = Token.objects.get(user_id=user_id)
            old_token.delete()
        except ObjectDoesNotExist:
            pass

        return Token.objects.create(user=user)

    @staticmethod
    def prepare_user_data_response(user):
        user_response = dict()

        user_id = user.id
        gallery_user = GalleryUser.objects.get(user_id=user_id)
        token = Token.objects.get(user_id=user_id)

        user_response["first_name"] = user.first_name
        user_response["last_name"] = user.last_name
        user_response["username"] = user.username
        user_response["user_token"] = token.key
        user_response["social_avatar_url"] = gallery_user.social_avatar_url

        return user_response


    def post(self, request):
        json_input = request.data
        serializer = LoginVKSerializer(data=json_input)
        if serializer.is_valid():  # we've got code from VK API to request access_token
            code = json_input["code"]
            access_token_data = self.request_access_token(code)
            if access_token_data:
                user_social_id = access_token_data["user_id"]
                access_token = access_token_data["access_token"]
                user_raw_data = self.request_user_data(user_social_id, access_token)
                if user_raw_data:
                    user_data = self.retrieve_user_data(user_raw_data, access_token_data, json_input)
                    print("is_existing_user", self.is_existing_user(user_data))
                    if self.is_existing_user(user_data):
                        user = self.get_user(user_data)
                        gallery_user = self.get_gallery_user(user_data)
                        self.update_user(gallery_user, user_data)
                    else:
                        user = self.create_user(user_data)
                    self.generate_token(user)
                    user_response = self.prepare_user_data_response(user)
                    return JsonResponse(user_response, status=status.HTTP_201_CREATED)
                data = {"error": "Can not request user_data from VK API"}
                return JsonResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            data = {"error": "Can not request access_token from VK API"}
            return JsonResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        data = {"error": "'code: string' and 'network: string' are obligatory in this request"}
        return JsonResponse(data, status=status.HTTP_400_BAD_REQUEST)







class LoginVKDeleteToken(generics.GenericAPIView):
    """
    Endpoint to delete API token from database (to log user out)
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user_id = user.pk
        try:
            token = Token.objects.get(user_id=user_id)
            token.delete()
            return Response({"success": "token deleted"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"token not found, {e}"}, status=status.HTTP_404_NOT_FOUND)
