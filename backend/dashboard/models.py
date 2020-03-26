from django.core.exceptions import ValidationError

from django.db import models

from AIapi.models import AI

import logging
logger = logging.getLogger('debugLogger')


class Workshop(models.Model):
    """A workshop session"""
    creation_date = models.DateTimeField(auto_now_add=True, verbose_name="Workshop Date")
    workshop_open = models.BooleanField(default=False)

    def clean(self):
        # Make sure this is the only open workshop
        open_workshops = Workshop.objects.filter(workshop_open=True).exclude(id=self.id).count()
        if open_workshops > 0:
            raise ValidationError("Can't create workshop, because another workshop is open")

    def __str__(self):
        return "Workshop at: " + str(self.creation_date)


class Team(models.Model):
    """Team model"""
    team_code = models.IntegerField(verbose_name="Team Code")
    team_name = models.CharField(max_length=20, blank=True, verbose_name="Team Name")
    # Whether someone has registered themselves to the team
    active = models.BooleanField(default=False)
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE, verbose_name="Workshop")

    active_ai = models.ForeignKey(AI, on_delete=models.SET_NULL, null=True, blank=True, related_name="active_ai+")

    def __str__(self):
        return "Team: " + str(self.team_name) + "(" + str(self.id) + ")"


class UserSession(models.Model):
    """User Session"""
    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name="User's Team")
    session = models.CharField(max_length=40, verbose_name="Session ID")

    def __str__(self):
        return "Session " + str(self.session)
