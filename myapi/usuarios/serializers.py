from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'nome_completo',
            'nome_apelido',
            'texto_bio',
            'data_nascimento',
            'email',
            'senha',
            'super_critico'
        ]