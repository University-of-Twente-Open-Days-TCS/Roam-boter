from django.db import models

from AIapi.models import AI
from dashboard.models import Team

# Create your models here.
class Bot(models.Model):
    """
    A predefined bot. Can be played against. Got a single consistent AI.
    """
    ai = models.ForeignKey(AI, on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    description = models.TextField(blank=True)

class Match(models.Model):
    """
    Represents a played match.
    The teams of the match can be retrieved through MatchTeam.
    AI's are not included because the AI's could have been changed after the match.
    To actually contain an AI of the match. The AI should be copied and stored.
    """

    class GameModes(models.TextChoices):
        DEATHMATCH = 'DM', 'Deathmatch'
        KING_OF_THE_HILL = 'KH', 'King of the hill'
        CAPTURE_THE_FLAG = 'CF', 'Capture the flag'

    winner = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True)
    gamemode = models.CharField(max_length=2, GameModes.choices)
    simulation = models.TextField(null=True)



class MatchTeam(models.Model):
    """
    Links a team to a match.
    """
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
