from rest_framework import status

from rest_framework.decorators import action

from rest_framework.response import Response
from rest_framework import viewsets

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from .models import User, Publication, Connection
from .serializers import UserSerializer, PublicationSerializer
from rest_framework.pagination import PageNumberPagination

from .authentication import MyJWTAuthentication

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [MyJWTAuthentication]

    def get_authenticators(self):
        if self.request.method == 'POST' and not self.request.path.endswith('/follow/') and not self.request.path.endswith('/unfollow/'):
            return []
        return super().get_authenticators()
    
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
    def followers(self, request):
        connections = Connection.objects.filter(usuario_beta=request.user)
        
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
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class PublicationViewSet(viewsets.ModelViewSet):
    serializer_class = PublicationSerializer
    queryset = Publication.objects.all()
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