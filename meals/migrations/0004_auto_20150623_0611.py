# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0003_auto_20150623_0023'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='meal',
            name='meal_date',
        ),
        migrations.AlterField(
            model_name='meal',
            name='meal_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
