# Generated by Django 5.0.2 on 2024-03-07 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vocabulary', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dictionaryentry',
            name='entry',
            field=models.CharField(db_index=True, max_length=512, unique=True),
        ),
    ]
