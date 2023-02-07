from django.db import models
from django.contrib.auth.models import User
from gallery_api.rest_api.models.photo import Photo

class Vote(models.Model):
    user = models.ForeignKey(User, related_name="votes", on_delete=models.DO_NOTHING)
    photo = models.ForeignKey(Photo, related_name="votes", on_delete=models.DO_NOTHING)
    vote = models.SmallIntegerField()
