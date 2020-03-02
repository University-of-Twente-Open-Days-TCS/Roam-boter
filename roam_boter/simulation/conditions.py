from enum import Enum
from objects import Object
from utils import distance_squared

from math import sqrt


# A condition has an id and a tuple of arguments. VERY IMPORTANT THAT IT IS ACTUALLY A TUPLE
# hint: tuples of 1 size can be made with (x, )
# id indicates which condition in the CONDITIONS list.
class Condition:
    id = -1
    params = ()

    def __init__(self, id, params):
        self.id = id
        self.params = params

    def evaluate(self, tank, state):
        return CONDITIONS[self.id](tank, state, *self.params)


def distance_to_nearest_object_greater_than(tank, state, obj, distance):

    if obj == Object.TANK:
        for t in state.tanks:
            if t == tank:
                continue
            if sqrt(distance_squared(t.get_pos(), tank.get_pos())) > distance:
                return True
            else:
                return False
        pass

    # TODO: finish implementation

    if obj == Object.BULLET:
        # look through state.bullets
        pass

    # search through objects on state.level
    pass


def distance_to_nearest_object_smaller_than(tank, state, obj, distance):
    # check if object is tank:
    if obj == Object.TANK:
        for t in state.tanks:
            if sqrt(distance_squared(t.get_pos(), tank.get_pos())) < distance:
                return True
            else:
                return False
    pass
    # TODO: finish implementation


# The CONDITIONS list where the index corresponds with a certain condition.
CONDITIONS = [
    distance_to_nearest_object_greater_than,  # 0
    distance_to_nearest_object_smaller_than,  # 1
]

