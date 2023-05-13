from django.test import TestCase
import requests
from usuarios.models import User, Publication
from rest_framework import status
from rest_framework.test import APIClient

import json

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
        
        self.assertEqual(len(response.data['results']), 2)
        self.assertEqual(response.status_code, 200)
    
        response = client.get(f'/usuarios/search/?nickname=Papai', HTTP_AUTHORIZATION=f'Bearer {token}')
        
        self.assertEqual(len(response.data['results']), 1)    
        self.assertEqual(response.status_code, 200)
        
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
        self.assertEqual(len(response.data), 2)
        
    def test_get_publication_detail(self):
        response = self.client.get(f'/publicacoes/{self.publication.id}/', HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['review'], 5)
        self.assertEqual(response.data['pub_text'], 'Ótimo filme!')
        self.assertEqual(response.data['user_id'], self.user.id)
        self.assertEqual(response.data['movie_id'], 1)
        self.assertEqual(response.data['movie_title'], 'La la land')
        
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
        
        
        
