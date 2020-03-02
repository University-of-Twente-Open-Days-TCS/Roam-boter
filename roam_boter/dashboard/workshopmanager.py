from django.core.exceptions import ValidationError

from random import randint

from .models import *

import logging
logger = logging.getLogger("debugLogger")


def generate_teamcodes(amount):
    """
    Creates 'amount' teams and generates corresponding team codes.
    team code generation is done randomly. A random number is generated and if this number does not yet exist in another team it is used as a team code.
    Note that team codes do not uniquely identify a team. It is possible that two teams from two different workshops have the same team code.
    """
    workshop = get_cur_workshop()

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


def link_user_session_to_team(team_code, session):
    """Links a user session to team specified by the team code"""
    if session.session_key is None:
        raise ValidationError("Session does not exist")

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
            session['team_id'] = team.id
            return True

        user_session = UserSession(team=team, session=session_id)
        user_session.save()

        # make sure that the session is registered as active
        session['team_id'] = team.id

        return True

    # Code was invalid
    return False


def remove_user_session(session):
    """Removes a user session ID. Including the related UserSession"""
    session_id = session.session_key

    # Delete UserSession object related to the key
    userSession = UserSession.objects.filter(session=session_id)

    if userSession.exists():
        # Delete all sessions related to the key
        userSession.delete()

    # Delete the session
    session.clear()


def open_workshop():
    """Opens a workshop. Returns whether successful."""
    if not all_workshops_closed():
        return False

    # open workshop
    workshop = Workshop(workshop_open=True)
    workshop.save()
    return True

def close_workshop():
    """Closes a workshop. Returns whether successful."""
    if all_workshops_closed():
        # Workshops already closed
        return False

    else:
        cur_workshop = get_cur_workshop()
        cur_workshop.workshop_open = False
        cur_workshop.save()
        return True


# UTILITIES
def get_cur_workshop():
    """Gets current open workshop"""
    return Workshop.objects.filter(workshop_open=True).first()



def all_workshops_closed():
    """Returns whether all workshops are closed"""
    open_workshops = Workshop.objects.filter(workshop_open=True).count()
    return open_workshops == 0



if __name__ == "__main__":
    print(sys.path)
