# Generated by Django 4.1.7 on 2023-06-07 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0004_favoriteslist_movie_title_favoriteslist_poster_img'),
    ]

    operations = [
        migrations.AddField(
            model_name='watchlist',
            name='movie_title',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AddField(
            model_name='watchlist',
            name='poster_img',
            field=models.URLField(default=''),
        ),
    ]