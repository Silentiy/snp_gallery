# Generated by Django 4.1.5 on 2023-01-21 09:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo_name', models.CharField(max_length=120)),
                ('photo_description', models.CharField(max_length=120)),
            ],
        ),
    ]
