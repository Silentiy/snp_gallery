from django import forms
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.response import Response

from service_objects.services import Service

from gallery_api.serializers.photo import PhotoListSerializer


class PhotoPostProcess(Service):
    user_id = forms.IntegerField()
    data = forms.JSONField()

    def process(self):
        data = self.cleaned_data["data"]
        user_id = self.cleaned_data["user_id"]
        user = User.objects.filter(pk=user_id)[0]

        serializer = PhotoListSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
