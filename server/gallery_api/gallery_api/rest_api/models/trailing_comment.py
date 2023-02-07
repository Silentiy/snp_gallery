from django.db import models
from gallery_api.rest_api.models.comment import Comment


class TrailingComment(models.Model):
    parent_comment = models.ForeignKey(Comment, related_name="parent_comments", on_delete=models.DO_NOTHING)
    trailing_comment = models.ForeignKey(Comment, related_name="trailing_comments", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "rest_api_trailing_comment"
