# Generated by Django 4.1.5 on 2023-01-31 11:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('rest_api', '0003_alter_photo_file'),
    ]

    operations = [
        migrations.CreateModel(
            name='GalleryUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('social_login_provider', models.CharField(max_length=64)),
                ('social_access_token', models.CharField(max_length=264)),
                ('social_user_id', models.PositiveIntegerField()),
                ('social_avatar_url', models.URLField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'gallery_user',
            },
        ),
        migrations.DeleteModel(
            name='UserAPI',
        ),
    ]