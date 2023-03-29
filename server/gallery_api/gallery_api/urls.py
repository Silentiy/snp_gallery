""" gallery_api URL Configuration """
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from gallery_api.rest_api.views import photo
from gallery_api.rest_api.views import login
from gallery_api.rest_api.views import user
from gallery_api.rest_api.views import gallery_user
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LogoutView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


router = routers.DefaultRouter()

schema_view = get_schema_view(
    openapi.Info(
        title="SnP internship. Gallery API",
        default_version="v1",
        description="API for interacting with Gallery backend",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="silentiy@list.ru"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("api-token-auth/", obtain_auth_token),
    path("photos/", photo.PhotoListView.as_view()),
    path("user/", user.UserData.as_view()),
    path("gallery-user/", gallery_user.GalleryUserView.as_view()),
    path("accounts/", include("allauth.urls")),
    path("dj-rest-auth/registration/", RegisterView.as_view(), name="reg"),
    path("dj-rest-auth/vk/", login.LoginVK.as_view(), name="vk_login"),
    path("dj-rest-auth/google/", login.LoginGoogle.as_view(), name="google_login"),
    path("dj-rest-auth/logout/", LogoutView.as_view(), name="rest_logout"),
    re_path(r"^ckeditor/", include("ckeditor_uploader.urls"), name="ckeditor_uploader"),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

handler500 = "rest_framework.exceptions.server_error"
