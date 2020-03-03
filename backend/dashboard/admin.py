from django.contrib import admin

from .models import Workshop, Team, UserSession


class WorkshopAdmin(admin.ModelAdmin):
    readonly_fields = ('creation_date',)
    list_display = ('id', 'creation_date', 'workshop_open',)

class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'team_code', 'team_name', 'workshop')


admin.site.register(Workshop, WorkshopAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(UserSession)
