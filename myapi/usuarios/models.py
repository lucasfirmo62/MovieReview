from django.db import models

from django.contrib.auth.hashers import make_password

class Usuario(models.Model):

    nome_completo = models.CharField(max_length=240)
    nome_apelido = models.CharField(max_length=55)
    texto_bio = models.CharField(max_length=220)
    data_nascimento = models.DateField('Data de nascimento')
    email = models.EmailField(max_length=100)
    senha = models.CharField(max_length=100)
    super_critico = models.BooleanField(default=False)

AVALIACOES = [
    (1,'1 - Horrível'),
    (2,'2 - Ruim'),
    (3,'3 - Mediano'),
    (4,'4 - Bom'),
    (5,'5 - Excelente')
]


class Publicacao(models.Model):

    avaliacao = models.PositiveSmallIntegerField(choices=AVALIACOES)
    text_pub = models.CharField(max_length=400)
    usuario_cod_user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    curtidas = models.PositiveIntegerField(default=0)
    descurtidas = models.PositiveIntegerField(default=0)
    comentario = models.CharField(max_length=200)
