from .tank import Tank
from .bullet import Bullet
from .objects import Object
from .conditions import Condition
from .actions import Action
from .AINode import AINode
from .level import Level

from copy import deepcopy

from json import JSONEncoder
import json


class PlayBack:

    def __init__(self, level):
        self.level = level
        self.frames = []
        self.team_names = []

        # index of the winning ai
        self.winner = None
        self.player_ids = []

    def add_frame(self, state):
        self.frames.append(Frame(state))

    def to_json(self, player_ids, team_names):
        self.player_ids = player_ids
        self.team_names = team_names
        encoder = PlayBackEncoder()
        return encoder.encode(self)


class Frame:
    # Extract a frame from state data.
    def __init__(self, state):
        self.tanks = deepcopy(state.tanks)
        self.bullets = deepcopy(state.bullets)
        self.health_packs = Frame.convert_health_packs(deepcopy(state.level.health_packs))
        self.visibility = [{'tanks': t.visible_tanks(state), 'bullets': t.visible_bullets(state)} for t in self.tanks]
        self.events = []
        self.scores = deepcopy(state.scores)

    @staticmethod
    def convert_health_packs(health_packs):
        new_list = []
        for pos in health_packs:
            x, y = pos
            new_list.append({'pos': (x + 0.5, y + 0.5), 'respawn_timer': health_packs[pos]})
        return new_list


class PlayBackEncoder(JSONEncoder):

    def default(self, obj):
        if isinstance(obj, PlayBack):
            return obj.__dict__
        elif isinstance(obj, Frame):
            return obj.__dict__
        elif isinstance(obj, Tank):
            return {'pos': obj.get_pos(), 'rotation': obj.get_rotation(), 'turret_rotation': obj.get_turret_rotation(), 'health': obj.get_health(), 'labels': obj.labels, 'timers': obj.label_timers, 'ai_path': obj.ai_path}
        elif isinstance(obj, Bullet):
            return {'pos': obj.get_pos()}
        elif isinstance(obj, Object):
            return int(obj)
        elif isinstance(obj, Level):
            return obj.objects
        else:
            print(obj)
            #return json.JSONEncoder.default(self, object)
