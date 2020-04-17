from django.db import models

from .grammar.converter import is_valid_aijson

# Create your models here.
class AI(models.Model):
    """AI Model"""
    ai = models.TextField()

    team = models.ForeignKey('dashboard.Team', on_delete=models.CASCADE, null=True, blank=True) # an AI might not belong to a bot, but to a team
    name = models.CharField(max_length=20, blank=False)

    # Whether the AI should show up in lists.
    listed = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # only save if the aijson is valid
        if is_valid_aijson(self.ai):
            super().save(*args, **kwargs)
        else:
            raise Exception("Invalid AI Json")

