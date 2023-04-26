from django.urls import path, include
from django.contrib import admin

from .views import CustomTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from usuarios import views
from usuarios.views import LogoutView

urlpatterns = [
    path('', include('usuarios.urls')),
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', LogoutView.as_view(), name='logout')
]