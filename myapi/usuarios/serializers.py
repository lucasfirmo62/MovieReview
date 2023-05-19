from rest_framework import serializers
from .models import User, Publication, FavoritesList

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'nickname',
            'bio_text',
            'birth_date',
            'email',
            'super_reviewer',
            'password'
        ]
        extra_kwargs = {'password': {'write_only': True}}

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = [
            'review',
            'pub_text',
            'user_id',
            'date',
            'movie_id',
            'movie_title',
            'imgur_link',
        ]

class FavoritesListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoritesList
        fields = '__all__'
