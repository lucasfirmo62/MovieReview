from django.contrib import admin
from .models import User, Publication, FavoritesList, Connection

admin.site.register([User, Publication, FavoritesList, Connection])