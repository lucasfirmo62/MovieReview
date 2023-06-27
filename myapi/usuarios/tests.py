from django.test import TestCase

import requests

from usuarios.models import User, Publication, FavoritesList, Connection, WatchList, Notification

from rest_framework import status
from rest_framework.test import APIClient

from io import BytesIO
from PIL import Image

class SignalsTestCase(TestCase):
    
    def test_create_user_profile_signal(self):
        user = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        self.assertEqual(user.email, 'steph@example.com')
        self.assertEqual(user.full_name, 'Steph Curry')
        self.assertEqual(user.nickname, 'jararaca')
        self.assertEqual(user.bio_text, 'Chef Curry cozinhando os defensores')
        self.assertEqual(user.birth_date, '2001-05-11')
        
    def test_login_success(self):
        user = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        response = self.client.post('/api/token/', {'email': user.email, 'password': '123mudar'})
                
        self.assertEqual(response.status_code, 200)
        
    def test_login_failed(self):
        user = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        response = self.client.post('/api/token/', {'email': user.email, 'password': '1234mudar'})
        self.assertEqual(response.status_code, 401)
    
    def test_get_usuarios(self):
        client = APIClient()
        
        user1 = User.objects.create_user(
            email='lebron@example.com',
            full_name='Lebron James',
            nickname='Papai Lebron',
            bio_text='Nunca desista! (3-1)',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        user2 = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        response = self.client.post('/api/token/', {'email': user1.email, 'password': '123mudar'})
        token = response.data['access']
        response = client.get('/usuarios/', HTTP_AUTHORIZATION=f'Bearer {token}')
        
        self.assertContains(response, user1.full_name)
        self.assertContains(response, user2.full_name)
        
        response = client.get('/usuarios/')
        self.assertEqual(response.status_code, 401)
        
    def test_follow_and_unfollow(self):
        client = APIClient()
    
        user1 = User.objects.create_user(
            email='lebron@example.com',
            full_name='Lebron James',
            nickname='Papai Lebron',
            bio_text='Nunca desista! (3-1)',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        user2 = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        response = self.client.post('/api/token/', {'email': user1.email, 'password': '123mudar'})
        token = response.data['access']

        response = client.post(f'/usuarios/{user2.pk}/follow/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'status': 'ok'})

        connection_exists = Connection.objects.filter(usuario_alpha=user1, usuario_beta=user2).exists()
        self.assertTrue(connection_exists)

        response = client.post(f'/usuarios/{user2.pk}/follow/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'error': 'Você já segue este usuário'})

        response = client.post(f'/usuarios/{user2.pk}/unfollow/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(response.status_code, 200)
        
        response = client.post(f'/usuarios/{user2.pk}/unfollow/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(response.data, {'error': 'Você não segue este usuário'})

    def test_pesquisa_usuarios(self):
        client = APIClient()
    
        user1 = User.objects.create_user(
            email='lebron@example.com',
            full_name='Lebron James',
            nickname='Papai Lebron',
            bio_text='Nunca desista! (3-1)',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        user2 = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        user3 = User.objects.create_user(
            email='icetrae@example.com',
            full_name=' Trae Young',
            nickname='jararaca2',
            bio_text='Terror de Nova york',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        response = self.client.post('/api/token/', {'email': user1.email, 'password': '123mudar'})
        token = response.data['access']
        
        response = client.get(f'/usuarios/search/?nickname=jararaca', HTTP_AUTHORIZATION=f'Bearer {token}')
        
        self.assertEqual(len(response.data['results']['results']), 2)
        self.assertEqual(response.status_code, 200)
    
        response = client.get(f'/usuarios/search/?nickname=Papai', HTTP_AUTHORIZATION=f'Bearer {token}')
        
        self.assertEqual(len(response.data['results']['results']), 1)  
        self.assertEqual(response.status_code, 200)
        
    def test_followers_list(self):
        client = APIClient()

        user1 = User.objects.create_user(
            email='lebron@example.com',
            full_name='Lebron James',
            nickname='Papai Lebron',
            bio_text='Nunca desista! (3-1)',
            birth_date='2001-05-11',
            password='123mudar'
        )

        user2 = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )

        response = self.client.post('/api/token/', {'email': user2.email, 'password': '123mudar'})
        token_follower = response.data['access']

        response = self.client.post('/api/token/', {'email': user1.email, 'password': '123mudar'})
        token_following = response.data['access']

        response = client.get(f'/usuarios/followers/', HTTP_AUTHORIZATION=f'Bearer {token_follower}')
        self.assertEqual(len(response.data), 0)

        response = client.post(f'/usuarios/{user2.pk}/follow/', HTTP_AUTHORIZATION=f'Bearer {token_following}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'status': 'ok'})

        response = client.get(f'/usuarios/followers/', HTTP_AUTHORIZATION=f'Bearer {token_follower}')
        self.assertEqual(len(response.data), 1)

        response = client.post(f'/usuarios/{user2.pk}/unfollow/', HTTP_AUTHORIZATION=f'Bearer {token_following}')
        self.assertEqual(response.status_code, 200)

        response = client.get(f'/usuarios/followers/', HTTP_AUTHORIZATION=f'Bearer {token_follower}')
        self.assertEqual(len(response.data), 0)
        
    def test_following_list(self):
        client = APIClient()

        user1 = User.objects.create_user(
            email='lebron@example.com',
            full_name='Lebron James',
            nickname='Papai Lebron',
            bio_text='Nunca desista! (3-1)',
            birth_date='2001-05-11',
            password='123mudar'
        )

        user2 = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )

        response = self.client.post('/api/token/', {'email': user1.email, 'password': '123mudar'})
        token = response.data['access']
        
        response = client.get(f'/usuarios/following/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(len(response.data), 0)

        response = client.post(f'/usuarios/{user2.pk}/follow/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'status': 'ok'})
        
        response = client.get(f'/usuarios/following/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(len(response.data), 1)
        
        response = client.post(f'/usuarios/{user2.pk}/unfollow/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(response.status_code, 200)
        
        response = client.get(f'/usuarios/following/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(len(response.data), 0)
        
    def test_super_reviewers(self):
        client = APIClient()

        user1 = User.objects.create_user(
            email='lebron@example.com',
            full_name='Lebron James',
            nickname='Papai Lebron',
            bio_text='Nunca desista! (3-1)',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        user2 = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        response = self.client.post('/api/token/', {'email': user1.email, 'password': '123mudar'})
        token = response.data['access']
        
        for _ in range(5):
            publication = Publication.objects.create(
                review=5,
                pub_text='Ótimo filme!',
                user_id=user1,
                movie_id=1,
                movie_title='La la land',
            )
            
        for _ in range(3):
            publication = Publication.objects.create(
                review=5,
                pub_text='Ótimo filme!',
                user_id=user2,
                movie_id=1,
                movie_title='La la land',
            )
            
        response = client.get(f'/supercriticos/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(response.data['count'], 1)
        
class LogoutTestCase(TestCase):
    
    def setUp(self):
        client = APIClient()
        
        self.user1 = User.objects.create_user(
            email='lebron@example.com',
            full_name='Lebron James',
            nickname='Papai Lebron',
            bio_text='Nunca desista! (3-1)',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        response = self.client.post('/api/token/', {'email': self.user1.email, 'password': '123mudar'})
        self.token = response.data['access']
    
    def test_logout_success(self):
        response = self.client.post('/logout/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, 204)
    
    def test_logout_failed_invalid_token(self):
        response = self.client.post('/logout/', HTTP_AUTHORIZATION='Bearer invalidtoken')
        self.assertEqual(response.status_code, 401)
        
    def test_logout_failed_missing_token(self):
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, 401)


class PublicationTestCase(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )
        self.publication = Publication.objects.create(
            review=5,
            pub_text='Ótimo filme!',
            user_id=self.user,
            movie_id=1,
            movie_title='La la land',
        )
        
        self.connection = Connection.objects.create(
            usuario_alpha=self.user,
            usuario_beta=User.objects.create_user(
                email='user@example.com',
                full_name='User Test',
                nickname='usertest',
                bio_text='Test bio',
                birth_date='1999-01-01',
                password='testpass'
            )
        )
        
        response = self.client.post('/api/token/', {'email': 'steph@example.com', 'password': '123mudar'})
        self.token = response.data['access']
    
    def test_like_publication(self):
        response = self.client.post('/api/token/', {'email': 'steph@example.com', 'password': '123mudar'})
        self.assertEqual(response.status_code, 200)
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        response = self.client.post(f'/likes/{self.publication.id}/')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'success': 'Like feito com sucesso!', 'is_liked': True})
        
        response = self.client.get(f'/likes/{self.publication.id}/')
        self.assertEqual(response.data['count'], 1)
        
        response = self.client.post(f'/likes/{self.publication.id}/')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'success': 'Deixando de dar o like!', 'is_liked': False})
        
        response = self.client.get(f'/likes/{self.publication.id}/')
        self.assertEqual(response.data['count'], 0)
        
    def test_deslike_publication(self):
        response = self.client.post('/api/token/', {'email': 'steph@example.com', 'password': '123mudar'})
        self.assertEqual(response.status_code, 200)
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        response = self.client.post(f'/deslikes/{self.publication.id}/')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'success': 'Deslike feito com sucesso!', 'is_desliked': True})
        
        response = self.client.get(f'/deslikes/{self.publication.id}/')
        self.assertEqual(response.data['count'], 1)
        
        response = self.client.post(f'/deslikes/{self.publication.id}/')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'success': 'Deixando de dar o deslike.', 'is_desliked': False})
        
        response = self.client.get(f'/deslikes/{self.publication.id}/')
        self.assertEqual(response.data['count'], 0)
        
    def test_comment(self):
        response = self.client.post(f'/comentarios/5/', {
            'comment_text': 'Concordo com a sua crítica',
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        response = self.client.post(f'/comentarios/1/', {
            'comment_text': 'Concordo com a sua crítica',
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        response = self.client.get(f'/comentarios/1/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.data['count'], 1)
        
        response = self.client.post(f'/comentarios/1/', {
            'comment_text': 'Discordo de alguns pontos',
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        response = self.client.get(f'/comentarios/1/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.data['count'], 2)
        
    def test_get_movie_publications(self):
        publication2 = Publication.objects.create(
            review=2,
            pub_text='Bom filme!',
            user_id=self.user,
            movie_id=2,
            movie_title='The godfather',
        )
    
        response = self.client.get(f'/criticas/1/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.data['count'], 1)
        
        response = self.client.get(f'/criticas/2/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.data['count'], 1)
        
        response = self.client.get(f'/criticas/3/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.data['count'], 0)
    
    def test_create_publication(self):
        response = self.client.post('/publicacoes/', {
            'review': 4,
            'pub_text': 'Gostei bastante do filme!',
            'user_id': self.user.id,
            'movie_id': 2,
            'movie_title': 'Avatar',
            'movie_director': 'James Cameron'
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Publication.objects.count(), 2)
        
    def test_create_publication_with_image(self):
        image = Image.new('RGB', (100, 100), (255, 255, 255))

        image_file = BytesIO()
        image.save(image_file, 'jpeg')
        image_file.seek(0)

        response = self.client.post('/publicacoes/', {
            'review': 4,
            'pub_text': 'Gostei bastante do filme!',
            'user_id': self.user.id,
            'movie_id': 2,
            'movie_title': 'Avatar',
            'movie_director': 'James Cameron',
            'image': image_file,
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Publication.objects.count(), 2)

        imgur_link = Publication.objects.latest('id').imgur_link
        self.assertTrue(imgur_link)
        self.assertTrue(requests.get(imgur_link).ok)
        
    def test_get_publication_list(self):
        response = self.client.post('/publicacoes/', {
            'review': 4,
            'pub_text': 'Gostei bastante do filme!',
            'user_id': self.user.id,
            'movie_id': 2,
            'movie_title': 'Avatar',
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
          
        response = self.client.get('/publicacoes/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        
    def test_get_publication_detail(self):
        response = self.client.get(f'/publicacoes/{self.publication.id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['review'], 5)
        self.assertEqual(response.data['pub_text'], 'Ótimo filme!')
        self.assertEqual(response.data['user_id'], self.user.id)
        self.assertEqual(response.data['movie_id'], 1)
        self.assertEqual(response.data['movie_title'], 'La la land')
        
    def test_feed(self):
        response = self.client.get('/feed/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

        user2 = User.objects.create_user(
            email='test@example.com',
            full_name='Test User',
            nickname='testuser',
            bio_text='Test bio',
            birth_date='2000-01-01',
            password='testpass'
        )
        
        Publication.objects.create(
            review=4,
            pub_text='Novo filme!',
            user_id=user2,
            movie_id=2,
            movie_title='Avengers',
        )
        
        Connection.objects.create(
            usuario_alpha=self.user,
            usuario_beta=user2
        )

        response = self.client.get('/feed/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        
    def test_update_publication(self):
        response = self.client.put(f'/publicacoes/{self.publication.id}/', {
            'review': 3,
            'pub_text': 'Filme mediano.',
            'user_id': self.user.id,
            'movie_id': 1,
            'movie_title': 'Titanic',
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['review'], 3)
        self.assertEqual(response.data['pub_text'], 'Filme mediano.')
        
    def test_delete_publication(self):
        response = self.client.delete(f'/publicacoes/{self.publication.id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Publication.objects.count(), 0)
        
    def test_super_reviewer(self):
        response = self.client.post('/publicacoes/', {
            'review': 4,
            'pub_text': 'Gostei bastante do filme!',
            'user_id': self.user.id,
            'movie_id': 3,
            'movie_title': 'The Shawshank Redemption',
            'movie_director': 'Frank Darabont'
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')

        response = self.client.post('/publicacoes/', {
            'review': 5,
            'pub_text': 'Esse filme é incrível!',
            'user_id': self.user.id,
            'movie_id': 4,
            'movie_title': 'The Godfather',
            'movie_director': 'Francis Ford Coppola'
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        response = self.client.get(f'/usuarios/{self.user.id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.data['super_reviewer'], False)

        response = self.client.post('/publicacoes/', {
            'review': 3,
            'pub_text': 'Não achei tão bom assim...',
            'user_id': self.user.id,
            'movie_id': 5,
            'movie_title': 'The Dark Knight',
            'movie_director': 'Christopher Nolan'
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')

        response = self.client.post('/publicacoes/', {
            'review': 4,
            'pub_text': 'Muito bom, recomendo!',
            'user_id': self.user.id,
            'movie_id': 6,
            'movie_title': 'Pulp Fiction',
            'movie_director': 'Quentin Tarantino'
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        response = self.client.get(f'/usuarios/{self.user.id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.data['super_reviewer'], True)
        
    def test_get_publications_by_user(self):
        response = self.client.get('/pubusuario/1/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
class FavoritesTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )

        response = self.client.post('/api/token/', {'email': 'steph@example.com', 'password': '123mudar'})
        self.token = response.data['access']
        
        response = self.client.post('/favoritos/', {
            "user_id": 1,
            "movie_id": 238,
            "poster_img": "https://image.tmdb.org/t/p/w500/qjiskwlV1qQzRCjpV0cL9pEMF9a.jpg",
            "movie_title": "The Godfather"
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(FavoritesList.objects.count(), 1)

    def test_add_favorite(self):
        response = self.client.post('/favoritos/', {
            "user_id": 1,
            "movie_id": 550,
            "poster_img": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            "movie_title": "Fight Club"
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(FavoritesList.objects.count(), 2)
        
        response = self.client.post('/favoritos/', {
            "user_id": 1,
            "movie_id": 550,
            "poster_img": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            "movie_title": "Fight Club"
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(FavoritesList.objects.count(), 2)
        
    def test_delete_favorite(self):
        
        self.assertEqual(FavoritesList.objects.count(), 1)

        movie_id = 238
        response = self.client.delete(f'/favoritos/{movie_id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(FavoritesList.objects.count(), 0)
        
        response = self.client.delete(f'/favoritos/{movie_id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, 404)
        
    def test_get_favorite_list(self):
        response = self.client.get('/favoritos/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(len(response.data), 1)
        
        response = self.client.post('/favoritos/', {
            "user_id": 1,
            "movie_id": 550,
            "poster_img": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            "movie_title": "Fight Club"
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
          
        response = self.client.get('/favoritos/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        def test_get_favorite_list_users(self):
            response = self.client.get('/movies/favoritos/1/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
            self.assertEqual(response.data['count'], 1)

            response = self.client.post('/favoritos/', {
                "movie_id": 550,
                "poster_img": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                "movie_title": "Fight Club"
            }, HTTP_AUTHORIZATION=f'Bearer {self.token}')

            response = self.client.get('/movies/favoritos/1/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['count'], 2)

class NotificationViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.user = User.objects.create_user(
            email='lebron@example.com',
            full_name='Lebron James',
            nickname='Papai Lebron',
            bio_text='Nunca desista! (3-1)',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        self.user2 = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )
        
        self.publication = Publication.objects.create(
            review=5,
            pub_text='Ótimo filme!',
            user_id=self.user,
            movie_id=1,
            movie_title='La la land',
        )
        
        response = self.client.post('/api/token/', {'email': 'steph@example.com', 'password': '123mudar'})
        self.assertEqual(response.status_code, 200)
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
            
    def test_notification_comment(self):
        response = self.client.post(f'/comentarios/{self.publication.id}/', { 'comment_text': 'Melhor filme de todos', }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        response = self.client.post('/api/token/', {'email': 'lebron@example.com', 'password': '123mudar'})
        self.assertEqual(response.status_code, 200)
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        response = self.client.get(f'/notificacoes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)  
        
    def test_notification_like(self):
        response = self.client.post(f'/likes/{self.publication.id}/')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'success': 'Like feito com sucesso!'})
        
        response = self.client.post('/api/token/', {'email': 'lebron@example.com', 'password': '123mudar'})
        self.assertEqual(response.status_code, 200)
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        response = self.client.get(f'/notificacoes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)  
        
    def test_notification_follow(self): 
        response = self.client.post(f'/usuarios/{self.user.pk}/follow/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'status': 'ok'})
        
        response = self.client.post('/api/token/', {'email': 'lebron@example.com', 'password': '123mudar'})
        self.assertEqual(response.status_code, 200)
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        response = self.client.get(f'/notificacoes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)  

    def test_mark_notification_as_read(self):
        response = self.client.post(f'/usuarios/{self.user.pk}/follow/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'status': 'ok'})        
        
        response = self.client.post('/api/token/', {'email': 'lebron@example.com', 'password': '123mudar'})
        self.assertEqual(response.status_code, 200)
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        response = self.client.post(f'/notificacoes/mark_as_read/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post('/api/token/', {'email': 'steph@example.com', 'password': '123mudar'})
        self.token = response.data['access']
        
        response = self.client.post('/watchlist/', {
            "movie_id": 238,
            "poster_img": "https://image.tmdb.org/t/p/w500/qjiskwlV1qQzRCjpV0cL9pEMF9a.jpg",
            "movie_title": "The Godfather"
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(WatchList.objects.count(), 1)
            
class WatchlistTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='steph@example.com',
            full_name='Steph Curry',
            nickname='jararaca',
            bio_text='Chef Curry cozinhando os defensores',
            birth_date='2001-05-11',
            password='123mudar'
        )

        response = self.client.post('/api/token/', {'email': 'steph@example.com', 'password': '123mudar'})
        self.token = response.data['access']

        response = self.client.post('/watchlist/', {
            "movie_id": 238,
            "poster_img": "https://image.tmdb.org/t/p/w500/qjiskwlV1qQzRCjpV0cL9pEMF9a.jpg",
            "movie_title": "The Godfather"
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(WatchList.objects.count(), 1)

    def test_add_watchlist(self):
        response = self.client.post('/watchlist/', {
            "movie_id": 550,
            "poster_img": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            "movie_title": "Fight Club"
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(WatchList.objects.count(), 2)

        response = self.client.post('/watchlist/', {
            "movie_id": 550,
            "poster_img": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            "movie_title": "Fight Club"
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(WatchList.objects.count(), 2)

    def test_delete_watchlist(self):
        self.assertEqual(WatchList.objects.count(), 1)

        movie_id = 238
        response = self.client.delete(f'/watchlist/movie/{movie_id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(WatchList.objects.count(), 0)

        response = self.client.delete(f'/watchlist/movie/{movie_id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, 404)

    def test_get_watchlist_list(self):
        response = self.client.get(f'/watchlist/user/{self.user.id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.data['count'], 1)

        response = self.client.post('/watchlist/', {
            "movie_id": 550,
            "poster_img": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            "movie_title": "Fight Club"
        }, HTTP_AUTHORIZATION=f'Bearer {self.token}')

        response = self.client.get(f'/watchlist/user/{self.user.id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
