# Generated by Django 5.1.6 on 2025-04-24 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jalwiki_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='technique',
            name='benefits',
            field=models.TextField(blank=True, help_text='Benefits of using this technique.', null=True),
        ),
        migrations.AddField(
            model_name='technique',
            name='impact',
            field=models.TextField(blank=True, help_text="Description of the technique's impact.", null=True),
        ),
        migrations.AddField(
            model_name='technique',
            name='materials',
            field=models.TextField(blank=True, help_text='Materials required for this technique.', null=True),
        ),
        migrations.AddField(
            model_name='technique',
            name='steps',
            field=models.TextField(blank=True, help_text='Step-by-step guide for the technique.', null=True),
        ),
        migrations.AddField(
            model_name='technique',
            name='regions',
            field=models.ManyToManyField(blank=True, help_text='Regions where the technique is applicable.', related_name='techniques', to='jalwiki_app.region'),
        ),
    ]
