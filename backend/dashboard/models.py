from django.core.exceptions import ValidationError

from django.db import models

from django.contrib.sessions.models import Session

import logging
logger = logging.getLogger('debugLogger')

'''Workshop Session model'''
class Workshop(models.Model):
    creation_date = models.DateTimeField(auto_now_add=True, verbose_name="Workshop Date")
    workshop_open = models.BooleanField(default=False)

    def clean(self):
        # Make sure this is the only open workshop
        open_workshops = Workshop.objects.filter(workshop_open=True).exclude(id=self.id).count()
        if open_workshops > 0:
            raise ValidationError("Can't create workshop, because another workshop is open")


'''Team Session model'''
class Team(models.Model):
    team_code = models.IntegerField(verbose_name="Team Code")
    team_name = models.CharField(max_length=20, blank=True, verbose_name="Team Name")
    # Whether someone has registered themselves to the team
    active = models.BooleanField(default=False)
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE, verbose_name="Workshop")

    def __str__(self):
        return "Team: "+str(self.team_name)


'''UserSession model'''
class UserSession(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name="User's Team")
    session = models.CharField(max_length=40, verbose_name="Session ID")

    def __str__(self):
        return "Session "+str(self.session)

