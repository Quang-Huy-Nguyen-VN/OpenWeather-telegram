# Generated by Django 4.2.1 on 2023-05-17 00:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_project_host'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='project',
            options={'ordering': ['-updated', '-created']},
        ),
    ]
