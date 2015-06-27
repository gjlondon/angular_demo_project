from django.conf import settings
from django.contrib.auth.models import Group

from authentication.models import Account

__author__ = 'rogueleaderr'

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AccountsAPITest(APITestCase):
    """
    Functional tests to make sure your REST API behaves correctly.
    """

    def setUp(self):
        admin_group = Group(name="Admin")
        admin_group.save()
        self.admin_group = admin_group
        self.sample_password = "sample_password"
        self.sample_user_credentials = {
            "email": "george.j.london@gmail.com",
            "username": "george",
            "password": self.sample_password,
            "calorie_target": 3500,
        }
        self.sample_user_2_credentials = {'email': "j@gmail.com", 'username': "j", 'password': self.sample_password}
        self.sample_admin_credentials = {'email': "a@gmail.com", 'username': "a", 'password': self.sample_password}
        self.sample_user = Account.objects.create_user(**self.sample_user_2_credentials)
        self.sample_admin = Account.objects.create_superuser(**self.sample_admin_credentials)

    def test_create_account_with_valid_credentials(self):
        url = reverse('accounts-list', args=None)
        response = self.client.post(url, self.sample_user_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], self.sample_user_credentials['username'])
        self.assertEqual(response.data['email'], self.sample_user_credentials['email'])

    def test_reject_creating_account_with_invalid_credentials(self):
        invalid_credentials = {
            "email": "karl",
            "username": "",
            "password": ""
        }
        url = reverse('accounts-list', args=None)
        response = self.client.post(url, invalid_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data,
                         {'status': 'Bad request',
                          'message': 'Account could not be created with received data.',
                          'errors': '{"username": ["This field may not be blank."], "password": ["This field may not be blank."], "email": ["Enter a valid email address."]}'})

    def test_reject_creating_account_with_missing_credentials(self):
        invalid_credentials = {}
        url = reverse('accounts-list')
        response = self.client.post(url, invalid_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data,
                         {'status': 'Bad request', 'message': 'Account could not be created with received data.',
                          'errors': '{"username": ["This field is required."]}'})

    def test_can_delete_own_account(self):
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse('accounts-detail', args=self.sample_user.username)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_cannot_delete_another_account(self):
        self.client.login(username=self.sample_admin.username, password=self.sample_password)
        url = reverse('accounts-detail', args=self.sample_user.username)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_can_update_own_account(self):
        new_user_data = {
            "email": "george.j.london@gmail.com",
            "username": "george2",
            "calorie_target": 3700,
        }
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse('accounts-detail', args=self.sample_user.username)
        response = self.client.put(url, new_user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '{"id":1,"email":"george.j.london@gmail.com","username":"george2","calorie_target":3700,"is_admin":false}')

    def test_cannot_update_other_account(self):
        new_user_data = {
            "email": "george.j.london@gmail.com",
            "username": "george2",
            "calorie_target": 3700,
        }
        self.client.login(username=self.sample_admin.username, password=self.sample_password)
        url = reverse('accounts-detail', args=self.sample_user.username)
        response = self.client.put(url, new_user_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_can_get_own_account_detail(self):
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse('accounts-detail', args=self.sample_user.username)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '{"id":1,"email":"j@gmail.com","username":"j","calorie_target":2000,"is_admin":false}')

    def test_cannot_get_another_account_detail(self):
        self.client.login(username=self.sample_admin.username, password=self.sample_password)
        url = reverse('accounts-detail', args=self.sample_user.username)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_upgrade_account_to_admin(self):
        new_user_data = {
            "email": "george.j.london@gmail.com",
            "username": "george2",
            "calorie_target": 3700,
            "admin_password": settings.ADMIN_PASSWORD
        }
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse('accounts-detail', args=self.sample_user.username)
        response = self.client.put(url, new_user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_admin'])

    def test_downgrade_account_to_not_admin(self):
        new_user_data = {
            "email": "george.j.london@gmail.com",
            "username": "george2",
            "calorie_target": 3700,
            "admin_password": "remove"
        }
        self.client.login(username=self.sample_admin.username, password=self.sample_password)
        url = reverse('accounts-detail', args=self.sample_admin.username)
        response = self.client.put(url, new_user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_admin'])

    def test_cannot_list_other_accounts(self):
        self.client.login(username=self.sample_admin.username, password=self.sample_password)
        url = reverse('accounts-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '[{"id":2,"email":"a@gmail.com","username":"a","calorie_target":2000,"is_admin":true}]')


class LoginAPITest(APITestCase):
    def setUp(self):
        self.sample_password = "sample_password"
        self.sample_user_credentials = {
            "email": "george.j.london@gmail.com",
            "username": "george",
            "password": self.sample_password,
            "calorie_target": 3500,
        }
        self.sample_user = Account.objects.create_user(**self.sample_user_credentials)

    def test_valid_user_can_login(self):
        # can't see anything when not logged in
        detail_url = reverse('accounts-detail', args=(self.sample_user.username,))
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_403_FORBIDDEN)
        url = reverse('login')
        login_info = {
            "username": self.sample_user_credentials['username'],
            "password": self.sample_user_credentials['password']
        }
        response = self.client.post(url, data=login_info, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '{"id":1,"email":"george.j.london@gmail.com","username":"george","calorie_target":2000,"is_admin":false}')
        # can see after logging in
        detail_url = reverse('accounts-detail', args=(self.sample_user.username,))
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.content, '{"id":1,"email":"george.j.london@gmail.com","username":"george","calorie_target":2000,"is_admin":false}')

    def test_invalid_user_cant_login(self):
        url = reverse('login')
        login_info = {
            "username": "karl",
            "password": "weathers"
        }
        response = self.client.post(url, data=login_info, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_can_logout(self):
        # can see when authenticated
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        detail_url = reverse('accounts-detail', args=(self.sample_user.username,))
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.content, '{"id":1,"email":"george.j.london@gmail.com","username":"george","calorie_target":2000,"is_admin":false}')
        logout_url = reverse('logout')
        response = self.client.post(logout_url)
        # but can't see after logging out
        detail_url = reverse('accounts-detail', args=(self.sample_user.username,))
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_403_FORBIDDEN)

