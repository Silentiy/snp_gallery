from django import forms
from rest_framework import status
from rest_framework.response import Response
from service_objects.services import Service

from gallery_api.rest_api.models import GalleryUser
from gallery_api.rest_api.serializers.gallery_user import GalleryUserSerializer


class GalleryUserPutProcess(Service):
    user_id = forms.IntegerField()

    def process(self):
        raise NotImplementedError
