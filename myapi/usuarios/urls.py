from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PublicationViewSet, FavoritesViewSet

router = DefaultRouter()
router.register(r'usuarios', UserViewSet)
router.register(r'publicacoes', PublicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('favoritos/', FavoritesViewSet.as_view({'post': 'create'}), name='criar_favorito'),
    path('favoritos/<int:movie_id>/', FavoritesViewSet.as_view({'delete': 'destroy_by_movie_id'}))
]