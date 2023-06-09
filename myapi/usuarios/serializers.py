from rest_framework import serializers
from .models import User, Publication, FavoritesList, Comment, Likes, Notification

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
        
class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = '__all__'

class DeslikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = '__all__'
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

