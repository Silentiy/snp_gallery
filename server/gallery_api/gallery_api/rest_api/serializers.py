from django.contrib.auth.models import User
from .models import Photo
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class PhotoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"
        read_only_fields = ["user"]

    user = serializers.ReadOnlyField(source='user.username')


class LoginVKSerializer(serializers.Serializer):
    code = serializers.CharField()
    network = serializers.CharField()

