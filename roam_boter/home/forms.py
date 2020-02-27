from django import forms

from django.core.validators import MinValueValidator

class EnterTeamForm(forms.Form):
    team_code_validator = MinValueValidator(0)
    team_code = forms.IntegerField(label="Team Code", required=True, validators=[team_code_validator])
