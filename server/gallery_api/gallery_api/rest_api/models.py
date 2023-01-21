from django.db import models


class Photo(models.Model):
    photo_name = models.CharField(max_length=120)
    photo_description = models.CharField(max_length=120)
