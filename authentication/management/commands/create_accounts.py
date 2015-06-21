from django.core.management.base import BaseCommand
from authentication.models import Account


class Command(BaseCommand):
    def handle(self, *args, **options):
        users = ['Bob', 'Sally', 'Joe', 'Rachel']
        for user in users:
            username = user.lower()
            Account.objects.create(username=username, email="{}@example.com".format(username), first_name=user)
