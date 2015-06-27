from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, Group, AbstractUser
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.contrib.auth.models import BaseUserManager
from rest_framework import serializers


class AccountManager(BaseUserManager):
    """
    Manager to handle creation of accounts and superuser accounts for a custom User model
    """
    def create_user(self, **kwargs):

        """
        Creates a regular user.

        :param kwargs: kwargs should contain a valid email, username, and password
        :return: :raise serializers.ValidationError:
        """
        email = kwargs.get('email')
        if not email:
            raise ValueError('Users must have a valid email address.')

        username = kwargs.get('username')
        if not username:
            raise ValueError('Users must have a valid username.')

        password = kwargs.get('password')
        if not password or len(password) < 6:
            # DRF refuses to allow custom field validation on ModelSerializers on fields that aren't explicitly on
            # the model, so we do it here instead
            raise serializers.ValidationError("Password must be at least 6 characters")

        account = self.model(
            email=self.normalize_email(email), username=username
        )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, **kwargs):

        """
        Create a superuser.

        :param kwargs: should contain valid password, email, and username
        :return:
        """
        account = self.create_user(**kwargs)
        self.make_account_admin(account)

        return account

    def make_account_admin(self, account):
        admin_group = Group.objects.get(name="Admin")
        account.groups.add(admin_group)

    def make_account_not_admin(self, account):
        admin_group = Group.objects.get(name="Admin")
        account.groups.remove(admin_group)


class Account(AbstractUser):
    """
    Our core user model. Modified from the default to store creation/modification dates and to let us
    store calorie target on the user model instead of needing to create a related model to store one value.

    also provides helpers for handling promotion to admin and checking of admin permissions to satisfied
    'multiple access levels' requirement.
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    calorie_target = models.IntegerField(default=2000)

    objects = AccountManager()

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

    @staticmethod
    def check_admin_password(password):
        return password == settings.ADMIN_PASSWORD

    @property
    def is_admin(self):
        try:
            self.groups.get(name="Admin")
            return True
        except ObjectDoesNotExist:
            return False

