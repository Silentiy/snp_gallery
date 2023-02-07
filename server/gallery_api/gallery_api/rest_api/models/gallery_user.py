from django.db import models
from django.contrib.auth.models import User


class GalleryUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    social_login_provider = models.CharField(max_length=64)
    social_access_token = models.CharField(max_length=264)
    social_user_id = models.PositiveIntegerField()
    social_avatar_url = models.URLField(blank=True, null=True)

    class Meta:
        db_table = "rest_api_gallery_user"
