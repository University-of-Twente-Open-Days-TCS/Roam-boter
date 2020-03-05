from django.db import models
from dashboard.models import Team

from .converter import is_valid_aijson

# Create your models here.
class AI(models.Model):
    """AI Model"""
    ai = models.TextField()

    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    name = models.CharField(max_length=20, blank=False)

    def save(self, *args, **kwargs):
        # only save if the aijson is valid
        if is_valid_aijson(self.ai):
            super().save(*args, **kwargs)
        else:
            raise Exception("Invalid AI Json")

