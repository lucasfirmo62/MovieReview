from django.contrib import admin
from django.urls import path, include
from usuarios import views

urlpatterns = [
    path('', include('usuarios.urls')),
    path("admin/", admin.site.urls),
    #path('registro/', include('usuarios.urls'))
    path('index/', views.index, name = 'index')
]
