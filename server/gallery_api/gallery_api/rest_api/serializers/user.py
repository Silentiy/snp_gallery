from django.contrib.auth.models import User
from rest_framework import serializers
from gallery_api.rest_api.models.gallery_user import GalleryUser
from rest_framework.authtoken.models import Token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "username", "email"]

    def create(self, validated_data):
        print("inside UserSerializer create() method")
        user, created = User.objects.update_or_create(
            username=validated_data.get('username', None),
            defaults={'pk': validated_data.get('user_id', None)})
        return user


class GalleryUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = GalleryUser
        fields = ["user", "social_avatar_url", "social_login_provider",
                  "social_access_token", "social_user_id"]
        depth = 1

    def create(self, validated_data):
        print("inside create in GalleryUserSerializer")
        user_data = validated_data.pop('user')
        user_data["password"] = ""
        try:
            user = User.objects.get_by_natural_key(username=user_data["username"])
        except:
            pass
        if not user:
            user = User.objects.create(**user_data)
        gallery_user = GalleryUser.objects.create(user=user, **validated_data)
        return user

    def update(self, instance, validated_data):
        print("inside update in GalleryUserSerializer")
        user_data = validated_data.pop('user')
        # Unless the application properly enforces that this field is
        # always set, the following could raise a `DoesNotExist`, which
        # would need to be handled.
        user = instance.user  # we can do it because of the line above: user = UserSerializer()

        user.email = user_data.get("email", user.email)
        user.first_name = user_data.get("first_name", user.first_name)
        user.last_name = user_data.get("last_name", user.last_name)
        user.username = user_data.get("username", user.username)
        user.save()

        # instance = GalleryUserSerializer
        instance.social_access_token = validated_data.get("social_access_token", instance.social_access_token)
        instance.social_avatar_url = validated_data.get("social_avatar_url", instance.social_avatar_url)
        instance.save()

        return instance


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["key"]
        depth = 1








