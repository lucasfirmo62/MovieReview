# Generated by Django 4.1.7 on 2023-06-07 22:37

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0005_watchlist_movie_title_watchlist_poster_img'),
    ]

    operations = [
        migrations.AddField(
            model_name='watchlist',
            name='date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
