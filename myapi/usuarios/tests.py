from django.test import TestCase
from usuarios.models import User
from rest_framework import status

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
        