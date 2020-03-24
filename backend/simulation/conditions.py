from enum import Enum
from .objects import Object
from .utils import distance_squared, filter_objects, vector_angle, distance

import math


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
    obj = Object(obj)
    # Collect the closest tank and compare to distance.
    paths = filter_objects(tank, state, obj)
    nearest_dist = float('inf')
    distance = (distance + 1) * 5

    for p in paths:
        # p[-1] is last element of path, this indicates the actual position of the object.
        dist = math.sqrt(distance_squared(tank.get_pos(), p[-1]))
        if dist < nearest_dist:
            nearest_dist = dist

    return nearest_dist > distance


def object_visible(tank, state, obj):
    obj = Object(obj)
    paths = filter_objects(tank, state, obj)
    for p in paths:
        # If any of the possible paths has an end node that is visible, there exists an object of type obj that is.
        if state.level.line_of_sight(tank.get_pos(), p[-1]):
            return True
    return False


def aimed_at_object(tank, state, obj):
    obj = Object(obj)
    paths = filter_objects(tank, state, obj)
    for p in paths:
        location = p[-1]
        if 0.5 > vector_angle(tank.get_pos(), location) > 359.5:
            return True
    return False


def object_exists(tank, state, obj):
    obj = Object(obj)
    paths = filter_objects(tank, state, obj)
    return len(paths) > 0


def bullet_ready(tank, state):
    return tank.bullet_ready(state)


def label_set(tank, state, label):
    return tank.get_label(label)


def health_greater_than(tank, state, health):
    return tank.health > health


def placeholder_condition(tank, state):
    raise NotImplementedError("Placeholder condition should never be called")


# List of possible conditions that the AI can evaluate.
# The condition ID is based on the position of the condition in the list.
CONDITIONS = [
    placeholder_condition,                          #0
    distance_to_nearest_object_greater_than,        #1
    object_visible,                                 #2
    aimed_at_object,                                #3
    object_exists,                                  #4
    bullet_ready,                                   #5
    label_set,                                      #6
    health_greater_than,                            #7
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

