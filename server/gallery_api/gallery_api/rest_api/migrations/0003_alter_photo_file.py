# Generated by Django 4.1.5 on 2023-01-24 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0002_alter_photo_updated_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='file',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
