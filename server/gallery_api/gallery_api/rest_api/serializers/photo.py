from gallery_api.rest_api.models import Photo
from rest_framework import serializers


class PhotoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"
        read_only_fields = [
            "user",
            "is_approved",
            "approval_date",
            "is_on_deletion",
            "on_deletion_since",
            "updated_file",
            "updated_upload_date",
        ]

    user = serializers.ReadOnlyField(source="user.username")
