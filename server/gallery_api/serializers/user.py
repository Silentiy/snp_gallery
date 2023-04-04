from django.contrib.auth.models import User
from rest_framework import serializers
from allauth.socialaccount.models import SocialAccount
from gallery_api.models import GalleryUser


class GalleryUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryUser
        exclude = ["id", "user"]


class SocialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAccount
        fields = ["provider", "avatar"]

    avatar = serializers.SerializerMethodField(method_name="get_avatar_url")

    def get_avatar_url(self, obj):
        provider = obj.provider
        if provider is not None:
            extra_data = obj.extra_data  # json.load(
            if provider == "vk":
                avatar_url = extra_data["photo_medium"]
            elif provider == "google":
                avatar_url = extra_data["picture"]
        else:
            avatar_url = None

        return avatar_url


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "pk",
            "first_name",
            "last_name",
            "email",
            "gallery_user",
            "social_user",
        ]

    gallery_user = serializers.SerializerMethodField(
        method_name="get_gallery_user_data"
    )
    social_user = serializers.SerializerMethodField(method_name="get_social_user_data")

    def get_gallery_user_data(self, user_obj):
        user_id = user_obj.pk
        try:
            gallery_user = GalleryUser.objects.get(user_id=user_id)
        except GalleryUser.DoesNotExist:
            gallery_user = GalleryUser.objects.none()
        serializer = GalleryUserSerializer(gallery_user)
        return serializer.data

    def get_social_user_data(self, user_obj):
        user_id = user_obj.pk
        try:
            social_user = SocialAccount.objects.get(user_id=user_id)
        except SocialAccount.DoesNotExist:
            social_user = SocialAccount.objects.get(user_id=user_id)
        serializer = SocialAccountSerializer(social_user)
        return serializer.data
