# Generated by Django 3.2.6 on 2021-08-29 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Scrape', '0010_auto_20210829_0459'),
    ]

    operations = [
        migrations.AlterField(
            model_name='config',
            name='timeDelay',
            field=models.IntegerField(default=4, null=True),
        ),
    ]
