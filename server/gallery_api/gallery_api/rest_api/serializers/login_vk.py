from rest_framework import serializers


class LoginVKSerializer(serializers.Serializer):
    code = serializers.CharField()
    network = serializers.CharField()
