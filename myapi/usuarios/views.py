from rest_framework.decorators import action
import tempfile
from rest_framework import status
from django.utils import timezone

from django.shortcuts import get_object_or_404

from rest_framework.decorators import action

from rest_framework.response import Response
from django.db.models import Count
from rest_framework import viewsets

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from rest_framework.pagination import PageNumberPagination

from .models import User, Publication, Connection, FavoritesList, Comment, Likes, Deslikes, WatchList, Notification
from .serializers import UserSerializer, PublicationSerializer, FavoritesListSerializer, CommentSerializer, DeslikesSerializer, WatchlistSerializer, NotificationSerializer

from rest_framework.pagination import PageNumberPagination
from .authentication import MyJWTAuthentication

class UserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
from imgurpython import ImgurClient

import os

from dotenv import load_dotenv

load_dotenv()

client_id = os.environ.get('IMGUR_CLIENT_ID')
client_secret = os.environ.get('IMGUR_CLIENT_SECRET')

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = [MyJWTAuthentication]
    pagination_class = UserPagination
    queryset = User.objects.order_by('nickname')

    def get_authenticators(self):
        if self.request.method == 'POST' and not self.request.path.endswith('/follow/') and not self.request.path.endswith('/unfollow/'):
            return []
        return super().get_authenticators()

    @action(detail=False, methods=['get'])
    def search(self, request):
        nickname = request.query_params.get('nickname', None)
        queryset = self.filter_queryset(self.get_queryset())
        
        if nickname is not None:
            queryset = queryset.filter(nickname__icontains=nickname)
        
        page = self.paginate_queryset(queryset)
        
        total_itens = queryset.count()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            tamanho_pagina = self.paginator.page_size
            num_paginas = total_itens // tamanho_pagina + (1 if total_itens % tamanho_pagina > 0 else 0)
            response_data = {
                'results': serializer.data,
                'num_paginas': num_paginas
            }
            return self.get_paginated_response(response_data)
        
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='follow', url_name='user-follow')
    def follow(self, request, pk=None):
        user_to_follow = self.get_object()
        user = request.user

        if user == user_to_follow:
            return Response({'error': 'Você não pode seguir a si mesmo'}, status=status.HTTP_400_BAD_REQUEST)

        connection_exists = Connection.objects.filter(usuario_alpha=user, usuario_beta=user_to_follow).exists()

        if connection_exists:
            return Response({'error': 'Você já segue este usuário'}, status=status.HTTP_400_BAD_REQUEST)
    
        connection = Connection(usuario_alpha=user, usuario_beta=user_to_follow)
        connection.save()
        
        message = f'{user.nickname} seguiu você'
        
        Notification.objects.create(
            sender=user,  
            recipient=user_to_follow,  
            notification_type='follow',
            is_read=False,
            message=message
        )
        
        return Response({'status': 'ok'})
    
    @action(detail=True, methods=['post'], url_path='unfollow', url_name='user-unfollow')
    def unfollow(self, request, pk=None):
        user_to_unfollow = self.get_object()
        user = request.user

        if user == user_to_unfollow:
            return Response({'error': 'Você não pode deixar de seguir a si mesmo'}, status=status.HTTP_400_BAD_REQUEST)

        connection = Connection.objects.filter(usuario_alpha=user, usuario_beta=user_to_unfollow).first()

        if not connection:
            return Response({'error': 'Você não segue este usuário'}, status=status.HTTP_400_BAD_REQUEST)

        connection.delete()
            
        return Response({'status': 'ok'})
    
    @action(detail=False, methods=['get'])
    def following(self, request):
        connections = Connection.objects.filter(usuario_alpha=request.user)

        following = [connection.usuario_beta for connection in connections]
        serializer = self.get_serializer(following, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def followers(self, request):
        connections = Connection.objects.filter(usuario_beta=request.user)
        
        followers = [connection.usuario_alpha for connection in connections]
        serializer = self.get_serializer(followers, many=True)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def following_by_id(self, request, user_id):
        connections = Connection.objects.filter(usuario_alpha=user_id)
        following = [connection.usuario_beta for connection in connections]
        serializer = self.get_serializer(following, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def followers_by_id(self, request, user_id):
        connections = Connection.objects.filter(usuario_beta=user_id)
        followers = [connection.usuario_alpha for connection in connections]
        serializer = self.get_serializer(followers, many=True)
        return Response(serializer.data)
    
    def super_reviewers(self, request):
        super_reviewers = User.objects.annotate(num_publications=Count('publication')).filter(num_publications__gte=5, super_reviewer=True).order_by('-num_publications')
        paginator = UserPagination()
        paginated_super_reviewers = paginator.paginate_queryset(super_reviewers, request)
        
        serializer = self.get_serializer(paginated_super_reviewers, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        profile_image = request.data.get('profile_image')
        nickname = request.data.get('nickname')
        full_name = request.data.get('full_name')
        bio_text = request.data.get('bio_text')

        if not profile_image and not any([nickname, full_name, bio_text]):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

        if profile_image == 'null':
            profile_image = None

        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            if profile_image:
                temp_file.write(profile_image.read())
                temp_file.flush()
                imgur_link = upload_to_imgur(temp_file.name)
            else:
                imgur_link = request.user.profile_image 

            user_data = {
                "nickname": nickname or request.user.nickname,  
                "full_name": full_name or request.user.full_name,  
                "bio_text": bio_text or request.user.bio_text, 
                "profile_image": imgur_link
            }

            serializer = self.get_serializer(instance=request.user, data=user_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        os.unlink(temp_file.name)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
    
class LogoutView(APIView):
    authentication_classes = [MyJWTAuthentication]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({"success": "Logout feito com sucesso."}, status=204)
        except Exception as e:
            return Response({"Erro": str(e)}, status=400)

class PublicationPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

def upload_to_imgur(file_path):
    client = ImgurClient(client_id, client_secret)

    image = client.upload_from_path(file_path)

    return image['link']
    
class PublicationViewSet(viewsets.ModelViewSet):
    serializer_class = PublicationSerializer
    queryset = Publication.objects.all().order_by('-date')
    authentication_classes = [MyJWTAuthentication]
    pagination_class = PublicationPagination
    
    def like(self, request, publication_id=None):        
        user = request.user
        
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response({'error': 'Publicacao nao existe!'}, status=status.HTTP_404_NOT_FOUND)
        
        publication = Publication.objects.filter(id=publication_id).first()
        
        if Likes.objects.filter(user_id=user, publication_id=publication_id).exists():
            Likes.objects.filter(user_id=user, publication_id=publication_id).delete()
            return Response({'success': 'Deixando de dar o like!'}, status=status.HTTP_201_CREATED)

        like = Likes.objects.create(
            user_id=user,
            publication_id=publication,
            date=timezone.now()
        )
        
        if publication.user_id != user:
            message = f'{user.nickname} curtiu sua publicação'
            
            Notification.objects.create(
                sender=user,  
                recipient=publication.user_id,  
                publication=publication,
                notification_type='like',
                is_read=False,
                message=message
            )

        return Response({'success': 'Like feito com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def add_comment(self, request, publication_id=None):
        user = request.user
                
        if not(user):
            return Response({'error': 'Usuário nao existe!'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response({'error': 'Publicacao nao existe!'}, status=status.HTTP_404_NOT_FOUND)
        
        comment_text = request.data.get('comment_text')
        
        comment = Comment.objects.create(
            user_id=user,
            publication_id=publication,
            comment_text=comment_text
        )
        
        if publication.user_id != user:
            message = f'{user.nickname} comentou sua publicação'
            
            Notification.objects.create(
                sender=user,  
                recipient=publication.user_id,  
                publication=publication,
                notification_type='comment',
                is_read=False,
                message=message
            )

        return Response({'success': 'Comentário feito com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def get_comments_by_pub_id(self, request, publication_id=None):
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response({'error': 'Publicacao nao existe!'}, status=status.HTTP_404_NOT_FOUND)
        
        comments = Comment.objects.filter(publication_id=publication_id).order_by('-date')

        page = self.paginate_queryset(comments)  

        serializer = CommentSerializer(page, many=True)
        
        return self.get_paginated_response(serializer.data)
    
    def deslike(self, request, publication_id=None):                
        user = request.user
        
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response({'error': 'Publicacao nao existe!'}, status=status.HTTP_404_NOT_FOUND)

        publication = Publication.objects.filter(id=publication_id).first()
        
        if Deslikes.objects.filter(user_id=user, publication_id=publication_id).exists():
            Deslikes.objects.filter(user_id=user, publication_id=publication_id).delete()
            return Response({'success': 'Deixando de dar o deslike.'}, status=status.HTTP_201_CREATED)
        
        deslike = Deslikes.objects.create(
            user_id=user,
            publication_id=publication,
            date=timezone.now()
        )

        return Response({'success': 'Deslike feito com sucesso!'}, status=status.HTTP_201_CREATED)

    def likes_by_publication(self, request, publication_id=None):
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response({'error': 'Publicacao nao existe!'}, status=status.HTTP_404_NOT_FOUND)
        
        likes = Likes.objects.filter(publication_id=publication_id)
        user_ids = likes.values_list('user_id', flat=True)
        users = User.objects.filter(id__in=user_ids).order_by('-likes__date')
        
        page = self.paginate_queryset(users)  
        
        serializer = UserSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)
    
    def deslikes_by_publication(self, request, publication_id=None):
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response({'error': 'Publicacao nao existe!'}, status=status.HTTP_404_NOT_FOUND)
        
        deslikes = Deslikes.objects.filter(publication_id=publication_id)
        user_ids = deslikes.values_list('user_id', flat=True)  
        users = User.objects.filter(id__in=user_ids).order_by('-deslikes__date')
        
        page = self.paginate_queryset(users)  

        serializer = UserSerializer(page, many=True)  

        return self.get_paginated_response(serializer.data)
    
    def feed(self, request):
        following = Connection.objects.filter(usuario_alpha=request.user).values_list('usuario_beta', flat=True)
        
        following = list(following) + [request.user.id]
        
        queryset = Publication.objects.filter(user_id__in=following).order_by('-date')
        
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        image = request.data.get('image')
        
        if image == 'null':
            image = None
        
        if not image:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user_id=request.user)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(image.read())
            temp_file.flush()

            imgur_link = upload_to_imgur(temp_file.name)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user_id=request.user, imgur_link=imgur_link)

        os.unlink(temp_file.name)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_publications_by_user(self, request, user_id=None):
        user = User.objects.get(pk=user_id)
        publications = Publication.objects.filter(user_id=user).order_by('-date')

        page = self.paginate_queryset(publications)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(publications, many=True)
        
        return Response(serializer.data)
    
    def get_publications_by_movie(self, request, movie_id=None):
        publications = Publication.objects.filter(movie_id=movie_id).order_by('-date')

        page = self.paginate_queryset(publications)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(publications, many=True)
        
        return Response(serializer.data)
    
class FavoritesPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class FavoritesViewSet(viewsets.ModelViewSet):
    serializer_class = FavoritesListSerializer
    authentication_classes = [MyJWTAuthentication]
    queryset = FavoritesList.objects.all()
    pagination_class = FavoritesPagination

    def create(self, request):
        user = request.user
        movie_id = request.data.get('movie_id')
        poster_img = request.data.get('poster_img')
        movie_title = request.data.get('movie_title')
        
        if FavoritesList.objects.filter(user_id=user, movie_id=movie_id).exists():
            return Response({'error': 'Esse filme já foi adicionado à lista de favoritos.'}, status=status.HTTP_400_BAD_REQUEST)

        favorite = FavoritesList.objects.create(
            user_id=user,
            movie_id=movie_id,
            poster_img=poster_img,
            movie_title=movie_title
        )
        
        serializer = FavoritesListSerializer(favorite)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def list(self, request):
        user_id = request.user
        
        queryset = FavoritesList.objects.filter(user_id=user_id)
        serializer = FavoritesListSerializer(queryset, many=True)
        
        return Response(serializer.data)
    
    def list_by_id(self, request, user_id=None):
        queryset = FavoritesList.objects.filter(user_id=user_id).order_by('-date')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def destroy_by_movie_id(self, request, movie_id=None):
        user_id = request.user.id

        favorites = FavoritesList.objects.filter(user_id=user_id, movie_id=movie_id)

        if not favorites:
            return Response({'error': 'Este filme não está na lista de favoritos.'}, status=status.HTTP_404_NOT_FOUND)

        favorites.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get'])
    def is_movie_favorite(self, request, pk=None, movie_id=None):
        user_id = request.user.id
        
        if FavoritesList.objects.filter(user_id=user_id, movie_id=movie_id).exists():
            return Response({'is_favorite': True})
        else:
            return Response({'is_favorite': False}) 
        
class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class WatchlistPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
        
class WatchlistViewset(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    authentication_classes = [MyJWTAuthentication]
    queryset = WatchList.objects.all()
    pagination_class = WatchlistPagination

    def create(self, request):
        user = request.user
        movie_id = request.data.get('movie_id')
        poster_img = request.data.get('poster_img')
        movie_title = request.data.get('movie_title')
        
        if WatchList.objects.filter(user_id=user, movie_id=movie_id).exists():
            return Response({'error': 'Esse filme já foi adicionado à watchlist.'}, status=status.HTTP_400_BAD_REQUEST)

        watchlist = WatchList.objects.create(
            user_id=user,
            movie_id=movie_id,
            poster_img=poster_img,
            movie_title=movie_title
        )
        
        serializer = WatchlistSerializer(watchlist, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def list(self, request, user_id=None):
        queryset = WatchList.objects.filter(user_id=user_id).order_by('-date')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def destroy_by_movie_id(self, request, movie_id=None):
        user_id = request.user.id

        watchlist = WatchList.objects.filter(user_id=user_id, movie_id=movie_id)

        if not watchlist:
            return Response({'error': 'Este filme não está na watchlist.'}, status=status.HTTP_404_NOT_FOUND)

        watchlist.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get'])
    def is_movie_on_watchlist(self, request, pk=None, movie_id=None):
        user_id = request.user.id
        
        if WatchList.objects.filter(user_id=user_id, movie_id=movie_id).exists():
            return Response({'is_movie_on_watchlist': True})
        else:
            return Response({'is_movie_on_watchlist': False}) 
    
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()
    pagination_class = NotificationPagination
    
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset().filter(recipient=request.user)).order_by('-created_at')
        
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, context={'request': request}, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, context={'request': request}, many=True)
        
        return Response(serializer.data)

    def mark_as_read(self, request, notification_id=None):
        notification = get_object_or_404(Notification, id=notification_id)
        notification.is_read = True
        notification.save()
    
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    def mark_all_as_read(self, request):
        queryset = self.get_queryset().filter(recipient=request.user, is_read=False)
        queryset.update(is_read=True)
        
        return Response("Notificações marcadas como lida.")