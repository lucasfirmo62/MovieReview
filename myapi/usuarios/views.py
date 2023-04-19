from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets

from .models import User
from .serializers import UserSerializer

from .authentication import MyJWTAuthentication

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [MyJWTAuthentication]

    def get_authenticators(self):
        if self.request.method == 'POST':
            return []
        return super().get_authenticators()