from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from datetime import date
from django.utils import timezone

from django.utils import timezone

REVIEWS = [
    (1,'1 - Horrível'),
    (2,'2 - Ruim'),
    (3,'3 - Mediano'),
    (4,'4 - Bom'),
    (5,'5 - Excelente')
]

from django.contrib.auth.hashers import make_password

def validate_birth_date(value):
    if value >= date.today():
        raise ValidationError('Data de nascimento deve ser anterior a hoje.')

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O campo do email é obrigatório')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        
        if password:
            user.password = make_password(password)
        else:
            raise ValueError('O campo Senha é obrigatório')
        
        user.save(using=self._db)
        
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=240)
    nickname = models.CharField(max_length=55)
    bio_text = models.CharField(max_length=220)
    birth_date = models.DateField('Birth date', validators=[validate_birth_date])
    email = models.EmailField(max_length=100, unique=True)
    super_reviewer = models.BooleanField(default=False)
    profile_image = models.URLField(blank=True)
    
    USERNAME_FIELD = 'email'
    
    REQUIRED_FIELDS = ['full_name', 'nickname', 'birth_date', 'password']

    objects = UserManager()
    is_staff = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def __str__(self):
        return self.full_name

    def get_full_name(self):
        return self.full_name

    def get_short_name(self):
        return self.nickname
    
    def get_password_field_name(self):
        return self.PASSWORD_FIELD

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.password and not self.password.startswith('pbkdf2_sha256'):
            self.password = make_password(self.password)
            self.save(update_fields=['password'])

class Publication(models.Model):
    review = models.PositiveSmallIntegerField(choices=REVIEWS)
    pub_text = models.CharField(max_length=400)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    movie_id = models.IntegerField()
    movie_title = models.CharField(max_length=200)
    imgur_link = models.URLField(blank=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        min_publications = 5
        
        publications_count = Publication.objects.filter(user_id=self.user_id).count()
        
        if publications_count >= min_publications:
            self.user_id.super_reviewer = True
        else:
            self.user_id.super_reviewer = False
        
        self.user_id.save(update_fields=['super_reviewer'])

class Likes(models.Model):
    publication_id = models.ForeignKey(Publication, on_delete=models.CASCADE)  
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    
class Deslikes(models.Model):
    publication_id = models.ForeignKey(Publication, on_delete=models.CASCADE)  
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    
class Connection(models.Model):
    usuario_alpha = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conexao_alpha')
    usuario_beta = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conexao_beta')

class Comment(models.Model):
    publication_id = models.ForeignKey(Publication, on_delete=models.CASCADE)  
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)   
    comment_text = models.CharField(max_length=500)
    date = models.DateTimeField(default=timezone.now)

class WatchList(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.CharField(max_length=300)
    poster_img = models.URLField(blank=False, default='')
    movie_title = models.CharField(max_length=200, blank=False, default='')
    date = models.DateTimeField(default=timezone.now)

class FavoritesList(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.CharField(max_length=300, blank=False)
    poster_img = models.URLField(blank=False, default='')
    movie_title = models.CharField(max_length=200, blank=False, default='')
    date = models.DateTimeField(default=timezone.now)
    
class Notification(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_notifications')
    publication = models.ForeignKey('usuarios.Publication', on_delete=models.CASCADE, null=True, blank=True)
    notification_type = models.CharField(max_length=20)  # Exemplo: 'like', 'comment'
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=300)

    def __str__(self):
        return f'{self.sender.username} - {self.notification_type}'
