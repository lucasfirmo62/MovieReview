from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from .models import User, Publication
from .serializers import UserSerializer, PublicationSerializer

from rest_framework.pagination import PageNumberPagination
from .authentication import MyJWTAuthentication
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [MyJWTAuthentication]
    pagination_class = PageNumberPagination

    def get_authenticators(self):
        if self.request.method == 'POST':
            return []
        return super().get_authenticators()

    @action(detail=False, methods=['get'])
    def search(self, request):
        nickname = request.query_params.get('nickname', None)
        queryset = self.filter_queryset(self.get_queryset())
        
        if nickname is not None:
            queryset = queryset.filter(nickname__icontains=nickname)
        
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)

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
    
class PublicationViewSet(viewsets.ModelViewSet):
    serializer_class = PublicationSerializer
    queryset = Publication.objects.all()
    authentication_classes = [MyJWTAuthentication]
