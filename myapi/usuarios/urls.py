from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PublicationViewSet, FavoritesViewSet, WatchlistViewset, NotificationViewSet

router = DefaultRouter()
router.register(r'usuarios', UserViewSet)
router.register(r'publicacoes', PublicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    path('notificacoes/', NotificationViewSet.as_view({ 'get': 'list' })),
    path('notificacoes/mark_as_read/<int:notification_id>/', NotificationViewSet.as_view({'post': 'mark_as_read'}), name='mark-as-read'),
    path('notificacoes/mark_as_read/', NotificationViewSet.as_view({'post': 'mark_all_as_read' }), name='mark-as-read'),
    
    path('feed/', PublicationViewSet.as_view({ 'get': 'feed' })),
    path('supercriticos/', UserViewSet.as_view({ 'get': 'super_reviewers' })),
    path('pubusuario/<int:user_id>/', PublicationViewSet.as_view({ 'get': 'get_publications_by_user' })),
    
    path('watchlist/', WatchlistViewset.as_view({'post': 'create' })),
    path('watchlist/user/<int:user_id>/', WatchlistViewset.as_view({'get': 'list'})),
    path('watchlist/movie/<int:movie_id>/', WatchlistViewset.as_view({'delete': 'destroy_by_movie_id'})),
    path('watchlist/<int:movie_id>/is_movie_on_watchlist/', WatchlistViewset.as_view({'get': 'is_movie_on_watchlist'})),
    
    path('favoritos/', FavoritesViewSet.as_view({'post': 'create', 'get': 'list'}), name='criar_favorito'),
    path('likes/<int:publication_id>/', PublicationViewSet.as_view({ 'post': 'like', 'get': 'likes_by_publication' })),
    path('deslikes/<int:publication_id>/', PublicationViewSet.as_view({ 'post': 'deslike', 'get': 'deslikes_by_publication' })),
    path('comentarios/<int:publication_id>/', PublicationViewSet.as_view({ 'post': 'add_comment', 'get': 'get_comments_by_pub_id' })),
    path('criticas/<int:movie_id>/', PublicationViewSet.as_view({ 'get': 'get_publications_by_movie' })),
    path('movies/favoritos/<int:user_id>/', FavoritesViewSet.as_view({'get': 'list_by_id' }), name='listar_favoritos'),
    path('favoritos/<int:movie_id>/', FavoritesViewSet.as_view({'delete': 'destroy_by_movie_id'})),
    path('favoritos/<int:movie_id>/is_movie_favorite/', FavoritesViewSet.as_view({'get': 'is_movie_favorite'})),
    path('following/<int:user_id>/', UserViewSet.as_view({'get': 'following_by_id'}), name='following'),
    path('followers/<int:user_id>/', UserViewSet.as_view({'get': 'followers_by_id'}), name='followers'),
    path('usuarios/search/', UserViewSet.as_view({'get': 'search'}), name='user-search'),

    path('is_liked/<int:publication_id>/', PublicationViewSet.as_view({'get': 'is_liked'})),
    path('is_desliked/<int:publication_id>/', PublicationViewSet.as_view({'get': 'is_disliked'})),

]