from service_objects.services import Service
from django import forms
from django.core.exceptions import ObjectDoesNotExist
import requests
from decouple import config
from rest_framework import permissions
from django.contrib.auth.models import User

from gallery_api.rest_api.models.gallery_user import GalleryUser
from gallery_api.rest_api.serializers.login_vk import LoginVKSerializer
from gallery_api.rest_api.serializers.user import GalleryUserSerializer


VK_APP_SECRET = config("VK_APP_SECRET")


class LoginVKProcess(Service):

    email = forms.EmailField()
    password = forms.CharField(max_length=255)
    subscribe_to_newsletter = forms.BooleanField(required=False)



    def process(self):
        email = self.cleaned_data['email']
        password = self.cleaned_data['password']
        subscribe_to_newsletter = self.cleaned_data['subscribe_to_newsletter']

        self.user = User.objects.create_user(username=email, email=email, password=password)
        self.subscribe_to_newsletter = subscribe_to_newsletter

        if self.subscribe_to_newsletter:
            newsletter = Newsletter.objects.get()
            newsletter.subscribers.add(self.user)
            newsletter.save()

        return self.user


