""" gallery_api URL Configuration """

from django.urls import include, path, re_path
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from gallery_api.rest_api import views

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)

schema_view = get_schema_view(
   openapi.Info(
      title="SnP internship. Gallery API",
      default_version='v1',
      description="API for interacting with Gallery backend",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="silentiy@list.ru"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('photos/', views.PhotoListView.as_view()),
    path("vk-login/", views.LoginVK.as_view()),
    path('api-token-auth/', obtain_auth_token),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0),
          name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

