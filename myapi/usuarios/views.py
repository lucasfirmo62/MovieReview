from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets

from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()