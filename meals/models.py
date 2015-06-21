from django.db import models

# Create your models here.
from authentication.models import Account


class Meal(models.Model):
    eater = models.ForeignKey(Account)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    calories = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '{0}'.format(self.name)