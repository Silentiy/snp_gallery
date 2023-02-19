from django.db import models

# from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField


class AdminMessage(models.Model):
    content = RichTextUploadingField()

    class Meta:
        db_table = "rest_api_admin_message"
