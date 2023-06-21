from rest_framework import serializers

from .models import User, Publication, FavoritesList, Comment, Likes, WatchList, Connection

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
            'password',
            'profile_image',
        ]
        extra_kwargs = {'password': {'write_only': True}}
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        user_id = request.user.id
        data['is_followed'] = Connection.objects.filter(usuario_alpha=user_id, usuario_beta=instance).exists()
        return data

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
        
class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchList
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

