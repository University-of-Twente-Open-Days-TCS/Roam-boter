from django.contrib import admin
from .models import Bot, BotMatch, TeamMatch, Simulation

# Register your models here.
admin.site.register(Bot)
admin.site.register(BotMatch)
admin.site.register(Simulation)
admin.site.register(TeamMatch)
