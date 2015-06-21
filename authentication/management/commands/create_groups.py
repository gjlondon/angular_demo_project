from django.contrib.auth.models import Group

__author__ = 'rogueleaderr'

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        groups = ["Regular", "User Manager", "Admin"]
        for group in groups:
            Group.objects.create(name=group)
