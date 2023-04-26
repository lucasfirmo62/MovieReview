from rest_framework import serializers
from .models import User, Publication

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
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
        ]

