from django import forms

from django.core.validators import MinValueValidator

class GenerateTeamCodesForm(forms.Form):
    amount = forms.IntegerField(label="Amount", required=True, validators=[MinValueValidator(0)])
