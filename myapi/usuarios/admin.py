from django.contrib import admin
from .models import User, Publication

admin.site.register([User, Publication])