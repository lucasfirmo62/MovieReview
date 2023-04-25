from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        
        return None

class MyJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if auth_header is None:
            raise AuthenticationFailed('Token não encontrado na header de autorização')

        try:
            token = self.get_validated_token(auth_header.split()[1])
        
        except AuthenticationFailed:
            raise
        
        except Exception as e:
            raise AuthenticationFailed('Token Inválido')

        user = self.get_user(token)
        
        return (user, token)