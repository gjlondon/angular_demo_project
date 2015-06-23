# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0002_auto_20150621_0912'),
    ]

    operations = [
        migrations.AddField(
            model_name='meal',
            name='meal_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='meal',
            name='meal_time',
            field=models.TimeField(default=django.utils.timezone.now),
        ),
    ]
