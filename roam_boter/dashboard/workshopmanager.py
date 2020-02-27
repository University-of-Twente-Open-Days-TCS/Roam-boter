from django.core.exceptions import ValidationError

from random import randint

from .models import *

import logging
logger = logging.getLogger("debugLogger")


'''
Creates 'amount' teams and generates corresponding team codes.
team code generation is done randomly. A random number is generated and if this number does not yet exist in another team it is used as a team code.
Note that team codes do not uniquely identify a team. It is possible that two teams from two different workshops have the same team code.
'''
def generate_teamcodes(workshop, amount):

    # get list of team codes
    team_codes = list(Team.objects.filter(workshop=workshop).values('team_code'))
    team_codes = list(map(lambda x: x['team_code'], team_codes))


    for i in range(amount):

        generated_code = False

        while not generated_code:
            # generate team code
            candidate_team_code = randint(0,999999)

            if candidate_team_code not in team_codes:
                #Valid team code
                team_codes.append(candidate_team_code)

                new_team = Team(team_code=candidate_team_code, workshop=workshop)
                new_team.save()
                # End loop
                generated_code = True


'''
Links a session to a team. This way users can enter a team with just a team code.
'''
def link_session_to_team(team_code, session):
    session_id = session.session_key
    if all_workshops_closed():
        raise ValidationError("No workshop is open")

    cur_workshop = get_cur_workshop()
    teams = Team.objects.filter(workshop=cur_workshop, team_code=team_code)
    if teams.exists():
        # valid code. Link session to team.
        team = teams.first()

        if UserSession.objects.filter(team=team, session=session_id).exists():
            # session already exists
            session['in_team'] = True
            return True


        user_session = UserSession(team=team, session=session_id)
        user_session.save()

        # make sure that the session is registered as active
        session['in_team'] = True

        return True

    # Code was invalid
    return False




# Gets the current open workshop.
def get_cur_workshop():
    return Workshop.objects.filter(workshop_open=True).first()


# Checks whether all workshops are closed
def all_workshops_closed():
    open_workshops = Workshop.objects.filter(workshop_open=True).count()
    return open_workshops == 0



