from django.db import models
from django.contrib.auth.models import User


class Photo(models.Model):
    user = models.ForeignKey(User, related_name="photos", on_delete=models.DO_NOTHING)

    name = models.CharField(max_length=120)
    description = models.CharField(max_length=1200)
    file = models.ImageField()

    upload_date = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    approval_date = models.DateTimeField(blank=True, null=True)
    is_on_deletion = models.BooleanField(default=False)
    on_deletion_since = models.DateTimeField(blank=True, null=True)

    updated_file = models.ImageField(blank=True, null=True)
    updated_upload_date = models.DateTimeField(blank=True, null=True)
