__author__ = 'rogueleaderr'

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.core.urlresolvers import get_resolver

class AccountsAPITest(APITestCase):

    def test_create_account(self):
        """
        Test user can create a new account
        :return:
        """
        print get_resolver(None).reverse_dict.keys()
        url = reverse('index', args=None)
        data = {'username': 'DabApps'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, data)

    def test_delete_account(self):
        """
        Test user can delete her account
        :return:
        """
        self.assertTrue(False)

    def test_update_account(self):
        """
        Test user can change email, self.assertTrue(False)word, calorie target
        :return:
        """
        self.assertTrue(False)

    def test_upgrade_account_to_admin(self):
        self.assertTrue(False)

    def test_downgrade_account_to_not_admin(self):
        self.assertTrue(False)

    def test_only_owner_can_see_account_info(self):
        self.assertTrue(False)


class LoginAPITest(APITestCase):

    def test_user_can_login(self):
        self.assertTrue(False)

    def test_user_can_logout(self):
        self.assertTrue(False)