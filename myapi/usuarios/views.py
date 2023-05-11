import tempfile
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from .models import User, Publication, FavoritesList
from .serializers import UserSerializer, PublicationSerializer, FavoritesListSerializer

from .authentication import MyJWTAuthentication

from imgurpython import ImgurClient

import os

from dotenv import load_dotenv

load_dotenv()

client_id = os.environ.get('IMGUR_CLIENT_ID')
client_secret = os.environ.get('IMGUR_CLIENT_SECRET')

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [MyJWTAuthentication]

    def get_authenticators(self):
        if self.request.method == 'POST':
            return []
        return super().get_authenticators()
    
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
        

def upload_to_imgur(file_path):
    client = ImgurClient(client_id, client_secret)

    image = client.upload_from_path(file_path)

    return image['link']
    
class PublicationViewSet(viewsets.ModelViewSet):
    serializer_class = PublicationSerializer
    queryset = Publication.objects.all()
    authentication_classes = [MyJWTAuthentication]
    
    def create(self, request, *args, **kwargs):
        image = request.data.get('image')
        
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
    