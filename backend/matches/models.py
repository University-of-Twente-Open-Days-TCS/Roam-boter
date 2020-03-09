from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from AIapi.models import AI
from dashboard.models import Team

# Create your models here.
"""
NOTE:
Currently an AI does not get copied when a match gets played.
In the future the AI should be a copy, because a Team can alter an AI at a later time step.
"""
class Bot(models.Model):
    """
    A predefined bot. Can be played against. Got a single consistent AI.
    """

    class BotDifficulty(models.IntegerChoices):
        """
        The difficulty of the bot
        """
        VERY_EASY = 1
        EASY = 2
        NORMAL = 3
        HARD = 4
        VERY_HARD = 5

    ais = models.ManyToManyField(AI) # at least one AI is required
    difficulty = models.IntegerField(choices=BotDifficulty.choices)
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
        """
        Possible Gamemodes
        """
        DEATHMATCH = 'DM', 'Deathmatch'
        KING_OF_THE_HILL = 'KH', 'King of the hill'
        CAPTURE_THE_FLAG = 'CF', 'Capture the flag'

    class SimulationState(models.TextChoices):
        """
        Possible Simulation States
        """
        PENDING = 'PEND', 'Pending'
        BUSY = 'BUSY', 'Busy'
        DONE = 'DONE', 'Done'

    winner = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name="winner")
    date = models.DateTimeField(auto_now_add=True)
    gamemode = models.CharField(max_length=2, choices=GameModes.choices, blank=False)
    simulation = models.TextField(blank=True)
    simulation_state = models.CharField(max_length=4, choices=SimulationState.choices, blank=False)

    class Meta:
        abstract = True


class BotMatch(Match):
    """
    A Match played between a SINGLE team and a bot.
    If the winner of a bot match is null, then the bot has won the match.
    """
    #TODO: SUPPORT MULTIPLE AI's
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    ai = models.ForeignKey(AI, on_delete=models.CASCADE)

