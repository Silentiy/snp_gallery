from django.db import models
from django.contrib.auth.models import User


class GalleryUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    social_login_provider = models.CharField(max_length=64)
    social_access_token = models.CharField(max_length=264)
    social_user_id = models.PositiveIntegerField()
    social_avatar_url = models.URLField(blank=True, null=True)

    class Meta:
        db_table = "gallery_user"


class Photo(models.Model):
    user = models.ForeignKey(User, related_name="photos", on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=120)
    description = models.CharField(max_length=1200)

    file = models.ImageField(blank=True, null=True)

    upload_date = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    approval_date = models.DateTimeField(blank=True, null=True)
    is_on_deletion = models.BooleanField(default=False)
    on_deletion_since = models.DateTimeField(blank=True, null=True)
    updated_file = models.ImageField(blank=True, null=True)
    updated_upload_date = models.DateTimeField(blank=True, null=True)


class Vote(models.Model):
    user = models.ForeignKey(User, related_name="votes", on_delete=models.DO_NOTHING)
    photo = models.ForeignKey("Photo", related_name="votes", on_delete=models.DO_NOTHING)
    vote = models.SmallIntegerField()


class Comment(models.Model):
    user = models.ForeignKey(User, related_name="comments", on_delete=models.DO_NOTHING)
    photo = models.ForeignKey("Photo", related_name="comments", on_delete=models.DO_NOTHING)
    date = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=1200)
    leading_comment = models.ForeignKey("self", on_delete=models.DO_NOTHING)


class TrailingComments(models.Model):
    parent_comment = models.ForeignKey("Comment", related_name="parent_comments", on_delete=models.DO_NOTHING)
    trailing_comment = models.ForeignKey("Comment", related_name="trailing_comments", on_delete=models.DO_NOTHING)
