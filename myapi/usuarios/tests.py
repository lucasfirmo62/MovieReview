from django.test import TestCase
from usuarios.models import User
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
        print(json.dumps(response.data, indent=4))
        
        self.assertContains(response, user1.full_name)
        self.assertContains(response, user2.full_name)
        
        response = client.get('/usuarios/')
        self.assertEqual(response.status_code, 401)
        
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
        