from django import forms

from django.core.validators import MinValueValidator

class GenerateTeamCodesForm(forms.Form):
    """Generates Team Codes"""
    amount = forms.IntegerField(label="Amount", required=True, validators=[MinValueValidator(0)])


class EnterTeamForm(forms.Form):
    """Form for entering team code"""
    team_code_validator = MinValueValidator(0)
    team_code = forms.IntegerField(label="Team Code", required=True, validators=[team_code_validator])

