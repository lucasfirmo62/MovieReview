# Generated by Django 4.1.7 on 2023-06-08 19:31

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0007_merge_0005_comment_date_0006_deslikes_date_likes_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='favoriteslist',
            name='date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]