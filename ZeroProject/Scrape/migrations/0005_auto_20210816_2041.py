# Generated by Django 3.2.6 on 2021-08-16 20:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Scrape', '0004_alter_connection_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='connection',
            old_name='target_name',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='connection',
            old_name='profile_url',
            new_name='url',
        ),
    ]
