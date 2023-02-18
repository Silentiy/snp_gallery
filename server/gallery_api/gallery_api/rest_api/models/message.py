from django.db import models
from ckeditor.fields import RichTextField


class AdminMessage(models.Model):
    content = RichTextField()

    class Meta:
        db_table = "rest_api_admin_message"
