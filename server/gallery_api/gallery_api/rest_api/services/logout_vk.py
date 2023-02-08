from django import forms

from rest_framework import status
from rest_framework.response import Response


from service_objects.services import Service

from rest_framework.authtoken.models import Token


class LogoutVKProcess(Service):

    user_id = forms.IntegerField()

    def process(self):
        user_id = self.cleaned_data["user_id"]
        try:
            token = Token.objects.get(user_id=user_id)
            token.delete()
            return Response({"success": "token deleted"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"token not found, {e}"}, status=status.HTTP_404_NOT_FOUND)
