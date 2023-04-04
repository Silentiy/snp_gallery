from gallery_api.models import GalleryUser
from rest_framework import serializers


class GalleryUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    about = serializers.CharField(
        max_length=2400, allow_blank=True, allow_null=True, required=False
    )
    nickname = serializers.CharField(
        max_length=32, allow_blank=True, allow_null=True, required=False
    )
    avatar = serializers.ImageField(required=False)

    def create(self, validated_data):
        """
        Create and return a new `GalleryUser` instance, given the validated data.
        """
        return GalleryUser.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `GalleryUser` instance, given the validated data.
        """
        instance.about = validated_data.get("about", instance.about)
        instance.nickname = validated_data.get("nickname", instance.nickname)
        instance.avatar = validated_data.get("avatar", instance.avatar)
        instance.save()
        return instance

    def to_representation(self, instance):
        gallery_user = GalleryUser.objects.filter(user_id=instance["user_id"]).first()
        return {
            "user_id": gallery_user.user_id,
            "about": gallery_user.about,
            "nickname": gallery_user.nickname,
            "avatar": gallery_user.avatar.url,
        }
