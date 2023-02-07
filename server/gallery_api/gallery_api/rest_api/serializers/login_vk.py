from rest_framework import serializers


class LoginVKSerializer(serializers.Serializer):
    code = serializers.CharField(write_only=True)
    network = serializers.CharField(write_only=True)
    token = serializers.CharField(read_only=True)
