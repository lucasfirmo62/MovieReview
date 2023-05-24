from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PublicationViewSet, FavoritesViewSet

router = DefaultRouter()
router.register(r'usuarios', UserViewSet)
router.register(r'publicacoes', PublicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('feed/', PublicationViewSet.as_view({ 'get': 'feed' })),
    path('pubusuario/<int:user_id>/', PublicationViewSet.as_view({ 'get': 'get_publications_by_user' })),
    path('favoritos/', FavoritesViewSet.as_view({'post': 'create', 'get': 'list'}), name='criar_favorito'),
    path('favoritos/<int:movie_id>/', FavoritesViewSet.as_view({'delete': 'destroy_by_movie_id'})),
    path('favoritos/<int:movie_id>/is_movie_favorite/', FavoritesViewSet.as_view({'get': 'is_movie_favorite'})),
    path('following/<int:user_id>/', UserViewSet.as_view({'get': 'following_by_id'}), name='following'),
    path('followers/<int:user_id>/', UserViewSet.as_view({'get': 'followers_by_id'}), name='followers'),
    path('usuarios/search/', UserViewSet.as_view({'get': 'search'}), name='user-search'),
]