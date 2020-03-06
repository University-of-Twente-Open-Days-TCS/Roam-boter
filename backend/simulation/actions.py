from objects import Object
from bullet import Bullet

from utils import *

"""Actions are described here."""
class Action:

    def __init__(self, action_id, attributes):
        self.action_id = action_id
        self.attributes = attributes

    def execute(self, tank, state):
        # pass execution to correct function
        ACTIONS[self.action_id](tank, state, **self.attributes)

    def __repr__(self):
        return ACTIONS[self.action_id].__name__ + " " + str(self.action_id) + " " + str(self.attributes)


# The function correlated with the action of the tank moving to a nearest object.
def move_to_nearest_object(tank, state, obj):
    goal = None

    if obj == Object.TANK:
        # find nearest tank to move to.
        other_tank = get_nearest_tank(state, tank)
        if other_tank is not None:
            goal = other_tank.get_pos()
        pass

    elif obj == Object.BULLET:
        # find nearest bullet to move to.
        bullet = get_nearest_bullet(state, tank)
        if bullet is not None:
            goal = bullet.get_pos()
        pass

    else:
        # find nearest obj in state.level to move to.
        goal = state.level.get_path_to_object(tank, obj)
    if goal is not None:
        move_to_position(state, tank, goal)

    pass


# The tank moving straight back from a nearest object.
def move_from_nearest_object(tank, state, obj):
    goal = None

    if obj == Object.TANK:
        # find nearest tank to move to.
        other_tank = get_nearest_tank(state, tank)
        if other_tank is not None:
            goal = other_tank.get_pos()
        pass

    elif obj == Object.BULLET:
        # find nearest bullet to move to.
        bullet = get_nearest_bullet(state, tank)
        if bullet is not None:
            goal = bullet.get_pos()
        pass

    else:
        # find nearest obj in state.level to move to.
        goal = get_nearest_level_object(state, tank, obj)
    move_from_position(state, tank, goal)

    pass


# Let the tank aim to the nearest object.
def aim_to_nearest_object(tank, state, obj):
    aim_goal = None
    if obj == Object.TANK:
        other_tank = get_nearest_tank(state, tank)
        if other_tank is not None:
            aim_goal = other_tank.get_pos()

    elif obj == Object.BULLET:
        bullet = get_nearest_bullet(state, tank)
        if bullet is not None:
            aim_goal = bullet.get_pos()

    else:
        aim_goal = get_nearest_level_object(state, tank, obj)

    # Check if an object is found...
    if aim_goal is not None:
        aim_to_position(state, tank, aim_goal)


# Perform the shoot action.
def shoot(tank, state):
    if state.frames_passed >= tank.shoot_ready:
        bullet = Bullet(tank)
        state.bullets.append(bullet)
        tank.shoot_ready = state.frames_passed + tank.reload_time


# Do not execute any action.
def do_nothing(tank, state):
    return


def placeholder_action(tank, state):
    raise NotImplementedError("Placeholder action should never be called")


# List of possible actions that the AI can execute.
# The action ID is based on the position of the action in the list.

ACTIONS = [
    do_nothing,                             #0
    move_to_nearest_object,                 #1
    placeholder_action,                     #2
    placeholder_action,                     #3
    move_from_nearest_object,               #4
    aim_to_nearest_object,                  #5
    placeholder_action,                     #6
    placeholder_action,                     #7
    shoot,                                  #8
    placeholder_action,                     #9
    placeholder_action,                     #10
    placeholder_action,                     #11
    placeholder_action,                     #12
    placeholder_action,                     #13
    placeholder_action,                     #14
    placeholder_action,                     #15
    placeholder_action,                     #16
    placeholder_action,                     #17
    placeholder_action,                     #18
    placeholder_action,                     #19
    placeholder_action,                     #20
    placeholder_action,                     #21
]
