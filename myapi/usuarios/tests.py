from django.test import TestCase
from usuarios.models import User, Publication, Connection
from rest_framework import status
from rest_framework.test import APIClient

import json

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