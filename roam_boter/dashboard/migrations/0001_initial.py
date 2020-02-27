# Generated by Django 3.0.3 on 2020-02-26 14:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('sessions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('team_code', models.IntegerField(verbose_name='Team Code')),
                ('team_name', models.CharField(blank=True, max_length=20, verbose_name='Team Name')),
            ],
        ),
        migrations.CreateModel(
            name='Workshop',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation_date', models.DateTimeField(auto_now_add=True, verbose_name='Workshop Date')),
                ('workshop_open', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='UserSession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='sessions.Session', verbose_name="User's Session")),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.Team', verbose_name="User's Team")),
            ],
        ),
        migrations.AddField(
            model_name='team',
            name='workshop',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.Workshop', verbose_name='Workshop'),
        ),
    ]
