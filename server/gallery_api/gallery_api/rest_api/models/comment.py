from django.db import models
from django.contrib.auth.models import User


class Comment(models.Model):
    user = models.ForeignKey(User, related_name="comments", on_delete=models.DO_NOTHING)
    photo = models.ForeignKey("Photo", related_name="comments", on_delete=models.DO_NOTHING)
    date = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=1200)
    leading_comment = models.ForeignKey("self", on_delete=models.DO_NOTHING)
