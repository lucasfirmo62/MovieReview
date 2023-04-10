from django.db import models

from django.contrib.auth.hashers import make_password

class Usuario(models.Model):

    nome_completo = models.CharField(max_length=240)
    nome_apelido = models.CharField(max_length=55)
    texto_bio = models.CharField(max_length=220)
    data_nascimento = models.DateField('Data de nascimento')
    email = models.EmailField(max_length=100)
    senha = models.CharField(max_length=100)