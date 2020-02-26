from objects import Object
from bullet import Bullet

from utils import get_nearest_tank, get_nearest_bullet, get_nearest_level_object, move_to_position, move_from_position


class Action:
    id = 0
    params = ()

    def __init__(self, id=-1, params=()):
        self.id = id
        self.params = params
        print(self.params)
        pass

    def execute(self, tank, state):
        ACTIONS[self.id](tank, state, *self.params)

    def __repr__(self):
        return ACTIONS[self.id].__name__ + " " + str(self.id) + " " + str(self.params)


# The function correlated with the action of the tank moving to a nearest object.
def move_to_nearest_object(tank, state, obj):
    goal = None

    if obj == Object.TANK:
        # find nearest tank to move to.
        tank = get_nearest_tank(state, tank)
        if tank is not None:
            goal = tank.get_pos()
        pass

    elif obj == Object.BULLET:
        # find nearest bullet to move to.
        bullet = get_nearest_bullet(state, tank)
        if bullet is not None:
            goal = bullet.get_pos()
        pass

    else:
        # find nearest obj in state.level to move to.
        goal = get_nearest_level_object(state, obj)
    move_to_position(state, tank, goal)

    pass


# The tank moving straight back from a nearest object.
def move_from_nearest_object(tank, state, obj):
    goal = None

    if obj == Object.TANK:
        # find nearest tank to move to.
        tank = get_nearest_tank(state, tank)
        if tank is not None:
            goal = tank.get_pos()
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


def shoot(tank, state):
    if state.frames_passed >= tank.shoot_ready:
        bullet = Bullet(tank)
        state.bullets.append(bullet)
        tank.shoot_ready = state.frames_passed + tank.reload_time


# List of possible actions that the AI can execute.
ACTIONS = [
    move_to_nearest_object,
    move_from_nearest_object,
    shoot,
]
