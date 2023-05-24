from rest_framework.decorators import action
import tempfile
from rest_framework import status

from rest_framework.decorators import action

from rest_framework.response import Response
from rest_framework import viewsets

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from rest_framework.pagination import PageNumberPagination
from .models import User, Publication, Connection, FavoritesList
from .serializers import UserSerializer, PublicationSerializer, FavoritesListSerializer

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

class FavoritesViewSet(viewsets.ModelViewSet):
    serializer_class = FavoritesListSerializer
    authentication_classes = [MyJWTAuthentication]
    queryset = FavoritesList.objects.all()

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
        user_id = request.user.id
        
        queryset = FavoritesList.objects.filter(user_id=user_id)
        serializer = FavoritesListSerializer(queryset, many=True)
        
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
    
