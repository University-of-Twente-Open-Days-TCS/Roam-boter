from tank import Tank
from bullet import Bullet
from objects import Object
from conditions import Condition
from actions import Action
from AINode import AINode
from level import Level

from copy import deepcopy

from json import JSONEncoder
import json


class PlayBack:

    def __init__(self, level):
        self.level = level
        self.frames = []
        self.winner = None

    def add_frame(self, state):
        self.frames.append(Frame(state))


class Frame:
    tanks = []
    bullets = []

    def __init__(self, state):
        self.tanks = deepcopy(state.tanks)
        self.bullets = deepcopy(state.bullets)


class PlayBackEncoder(JSONEncoder):

    def default(self, obj):
        if isinstance(obj, PlayBack):
            return obj.__dict__
        elif isinstance(obj, Frame):
            return obj.__dict__
        elif isinstance(obj, Tank):
            return obj.__dict__
        elif isinstance(obj, Bullet):
            return obj.__dict__
        elif isinstance(obj, Object):
            return obj.__str__()
        elif isinstance(obj, AINode):
            return obj.__dict__
        elif isinstance(obj, Action):
            return obj.__dict__
        elif isinstance(obj, Condition):
            return obj.__dict__
        elif isinstance(obj, Level):
            return None
        else:
            print(obj)
            return json.JSONEncoder.default(self, object)

