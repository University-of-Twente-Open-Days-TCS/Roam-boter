from enum import Enum
from .objects import Object
from .utils import distance_squared

from math import sqrt


# A condition has an id and a tuple of arguments. VERY IMPORTANT THAT IT IS ACTUALLY A TUPLE
# hint: tuples of 1 size can be made with (x, )
# id indicates which condition in the CONDITIONS list.
class Condition:

    def __init__(self, condition_id, attributes):
        self.condition_id = condition_id
        self.attributes = attributes

    def evaluate(self, tank, state):
        return CONDITIONS[self.condition_id](tank, state, **self.attributes)


def distance_to_nearest_object_greater_than(tank, state, obj, distance):

    if obj == Object.TANK:
        for t in tank.visible_tanks(state):

            if sqrt(distance_squared(t.get_pos(), tank.get_pos())) > distance:
                return True
            else:
                return False
        return True

    # TODO: finish implementation

    if obj == Object.BULLET:
        # look through state.bullets
        pass

    # search through objects on state.level
    pass


def placeholder_condition(tank, state):
    raise NotImplementedError("Placeholder condition should never be called")


# List of possible conditions that the AI can evaluate.
# The condition ID is based on the position of the condition in the list.
CONDITIONS = [
    placeholder_condition,                          #0
    distance_to_nearest_object_greater_than,        #1
    placeholder_condition,                          #2
    placeholder_condition,                          #3
    placeholder_condition,                          #4
    placeholder_condition,                          #5
    placeholder_condition,                          #6
    placeholder_condition,                          #7
    placeholder_condition,                          #8
    placeholder_condition,                          #9
    placeholder_condition,                          #10
    placeholder_condition,                          #11
    placeholder_condition,                          #12
    placeholder_condition,                          #13
    placeholder_condition,                          #14
    placeholder_condition,                          #15
    placeholder_condition,                          #16
    placeholder_condition,                          #17
    placeholder_condition,                          #18
]

