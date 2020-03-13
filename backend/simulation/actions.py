from .objects import Object, RelDir, WindDir
from .bullet import Bullet

from .utils import *


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


# Do not execute any action.
def do_nothing(tank, state):
    return


# The function correlated with the action of the tank moving to a nearest object.
def move_to_nearest_object(tank, state, obj):
    obj = Object(obj)
    paths = filter_objects(tank, state, obj)

    nearest_path = closest_object_in_paths(tank, paths)
    if nearest_path is not None and len(nearest_path) > 0:
        tank.path = nearest_path
        move_to_position(state, tank, nearest_path[0])


def scout(tank, state):
    raise NotImplementedError("Scouting is not possible yet")


def patrol(tank, state):
    raise NotImplementedError("Patrolling is not possible yet")


# The tank moving straight back from a nearest object.
def move_from_nearest_object(tank, state, obj):
    obj = Object(obj)
    paths = filter_objects(tank, state, obj)
    nearest_path = closest_object_in_paths(tank, paths)
    if nearest_path is not None and len(nearest_path) > 0:
        move_from_position(state, tank, nearest_path[0])


# Let the tank aim to the nearest object.
def aim_to_nearest_object(tank, state, obj):
    obj = Object(obj)
    paths = filter_objects(tank, state, obj)

    nearest_path = closest_object_in_paths(tank, paths)
    if nearest_path is not None and len(nearest_path) > 0:
        aim_to_position(state, tank, nearest_path[0])


def aim_reldir(tank, state, reldir):
    reldir = RelDir(reldir)
    angle = reldir.angle()
    tank.rotate_turret_towards(angle)


def aim_winddir(tank, state, winddir):
    winddir = WindDir(winddir)
    angle = winddir.angle()
    tank.rotate_turret_towards(angle - tank.get_rotation())


def aim_to_left(tank, state, speed):
    speed = speed
    rotation = tank.get_turret_rotation()
    tank.rotate_turret_towards(rotation + speed)


def aim_to_right(tank, state, speed):
    speed = speed
    rotation = tank.get_turret_rotation()
    tank.rotate_turret_towards(rotation - speed)


# Perform the shoot action.
def shoot(tank, state):
    if tank.bullet_ready(state):
        bullet = Bullet(tank)
        state.bullets.append(bullet)
        tank.shoot_ready = state.frames_passed + tank.reload_time


EXPLOSION_RADIUS = 3


def self_destruct(tank, state):
    tanks = state.tanks
    for t in tanks:
        if distance(tank.get_pos(), t.get_pos()) < EXPLOSION_RADIUS:
            t.health -= 200


def placeholder_action(tank, state):
    raise NotImplementedError("Placeholder action should never be called")


# List of possible actions that the AI can execute.
# The action ID is based on the position of the action in the list.

def is_movement_action(action_id):
    if action_id in [1, 2, 3, 4]:
        return True
    return False


def is_aim_action(action_id):
    if action_id in [5, 6, 7, 8, 9]:
        return True
    return False


ACTIONS = [
    do_nothing,                             #0
    move_to_nearest_object,                 #1
    scout,                                  #2
    patrol,                                 #3
    move_from_nearest_object,               #4
    aim_to_nearest_object,                  #5
    aim_winddir,                            #6
    aim_reldir,                             #7
    aim_to_left,                            #8
    aim_to_right,                           #9
    shoot,                                  #13
    self_destruct,                          #14
    placeholder_action,                     #15
    placeholder_action,                     #16
    placeholder_action,                     #17
    placeholder_action,                     #18
    placeholder_action,                     #19
    placeholder_action,                     #20
    placeholder_action,                     #21
]
