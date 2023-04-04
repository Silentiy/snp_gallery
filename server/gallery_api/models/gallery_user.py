from django.db import models
from django.contrib.auth.models import User


class GalleryUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=32, blank=True, null=True, unique=True)
    about = models.CharField(max_length=2048, blank=True, null=True)
    avatar = models.ImageField(blank=True, null=True)

    class Meta:
        db_table = "rest_api_gallery_user"
