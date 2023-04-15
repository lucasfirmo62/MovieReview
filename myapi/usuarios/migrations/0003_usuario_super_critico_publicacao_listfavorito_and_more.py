# Generated by Django 4.1.7 on 2023-04-15 23:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0002_usuario_delete_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='super_critico',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Publicacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('avaliacao', models.PositiveSmallIntegerField(choices=[(1, '1 - Horrível'), (2, '2 - Ruim'), (3, '3 - Mediano'), (4, '4 - Bom'), (5, '5 - Excelente')])),
                ('text_pub', models.CharField(max_length=400)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('usuario_cod', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
            ],
        ),
        migrations.CreateModel(
            name='ListFavorito',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filme_id', models.CharField(max_length=300)),
                ('usuario_cod', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
            ],
        ),
        migrations.CreateModel(
            name='ListAssistir',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filme_id', models.CharField(max_length=300)),
                ('usuario_cod', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
            ],
        ),
        migrations.CreateModel(
            name='Curtidas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('publicacao_cod', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.publicacao')),
                ('usuario_cod', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
            ],
        ),
        migrations.CreateModel(
            name='Comentario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comentario', models.CharField(max_length=500)),
                ('publicacao_cod', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.publicacao')),
                ('usuario_cod', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
            ],
        ),
    ]
