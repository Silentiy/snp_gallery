from django.db import models
from django.contrib.auth.models import User


class Vote(models.Model):
    user = models.ForeignKey(User, related_name="votes", on_delete=models.DO_NOTHING)
    photo = models.ForeignKey("Photo", related_name="votes", on_delete=models.DO_NOTHING)
    vote = models.SmallIntegerField()
