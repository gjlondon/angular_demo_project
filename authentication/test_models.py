from django.contrib.auth.models import Group
from django.test import TestCase
from rest_framework import serializers
from authentication.models import Account

__author__ = 'rogueleaderr'

class TestAccountModel(TestCase):
    """
    Tests to make sure the Account model behaves correctly.
    """

    def setUp(self):
        admin_group = Group(name="Admin")
        admin_group.save()
        self.admin_group = admin_group
        self.sample_user_credentials = {
            "email": "george.j.london@gmail.com",
            "username": "george",
            "password": "my_pass"
        }

    def test_can_create_user_with_valid_credentials(self):
        account = self.make_new_account()
        self.assertEqual(self.sample_user_credentials['email'], account.email)
        self.assertEqual(self.sample_user_credentials['username'], account.username)
        self.assertNotIn(self.admin_group, account.groups.all())

    def test_dont_create_user_with_missing_email(self):
        invalid_credentials = {
            "username": "karl",
            "password": "my_pass"
        }
        with self.assertRaises(ValueError):
            account = self.make_new_account(credentials=invalid_credentials)

    def test_dont_create_user_with_missing_username(self):
        invalid_credentials = {
            "email": "karl",
            "password": "my_pass"
        }
        with self.assertRaises(ValueError):
            account = self.make_new_account(credentials=invalid_credentials)

    def test_dont_create_user_with_missing_password(self):
        invalid_credentials = {
            "email": "karl",
            "username": "karl"
        }
        with self.assertRaises(serializers.ValidationError):
            account = self.make_new_account(credentials=invalid_credentials)

    def test_can_create_superuser(self):
        account = Account.objects.create_superuser(**self.sample_user_credentials)
        self.assertEqual(self.sample_user_credentials['email'], account.email)
        self.assertEqual(self.sample_user_credentials['username'], account.username)
        self.assertTrue(account.is_admin)
        self.assertIn(self.admin_group, account.groups.all())

    def test_can_make_account_admin(self):
        account = self.make_new_account()
        self.assertNotIn(self.admin_group, account.groups.all())
        Account.objects.make_account_admin(account)
        self.assertIn(self.admin_group, account.groups.all())

    def test_can_make_account_not_admin(self):
        account = Account.objects.create_superuser(**self.sample_user_credentials)
        self.assertIn(self.admin_group, account.groups.all())
        Account.objects.make_account_not_admin(account)
        self.assertNotIn(self.admin_group, account.groups.all())

    def test_can_check_admin_status(self):
        account = self.make_new_account()
        self.assertFalse(account.is_admin)
        Account.objects.make_account_admin(account)
        self.assertTrue(account.is_admin)

    def make_new_account(self, credentials=None):
        if credentials:
            account = Account.objects.create_user(**credentials)
        else:
            account = Account.objects.create_user(**self.sample_user_credentials)
        return account