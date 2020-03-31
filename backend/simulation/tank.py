from .objects import Object
from .actions import is_movement_action, is_aim_action
from .utils import distance

import math
import numpy

TANK_TURN_SPEED = 2.5
TURRET_TURN_SPEED = 3

VISION_RANGE = 30


class Tank:
    x = 0
    y = 0

    rotation = 0
    turret_rotation = 0

    degrees_visibility = 30
    hacked = True
    spawn = (0.0, 0.0)
    spawn_rotation = 0
    destroyed = False

    health = 100

    shoot_ready = 0
    reload_time = 60

    bullet_speed = 1
    max_speed = 0.1
    speed = 0.1

    width = 1
    height = 1

    team_id = 0

    current_path = None
    scout_target = None

    path = None

    def __init__(self, ai):
        self.ai = ai
        self.actions = []
        self.ai_path = []
        self.labels = [False] * 9
        self.label_timers = [-1, -1, -1, -1, -1, -1, -1, -1, -1]

    def get_label(self, index):
        return self.labels[index]

    def set_label(self, index):
        self.labels[index] = True

    def unset_label(self, index):
        self.labels[index] = False

    def set_label_timer(self, index, seconds):
        self.label_timers[index] = seconds * 60
        self.labels[index] = True

    def process_label_timers(self):
        for i, x in enumerate(self.label_timers):
            if x == 0:
                self.labels[i] = False
            self.label_timers[i] -= 1

    def set_spawn(self, x, y):
        self.spawn = (x, y)

    def set_pos(self, x, y):
        self.x = x
        self.y = y

    def get_pos(self):
        return self.x, self.y

    def move(self, x, y):
        self.x += x
        self.y += y

    def move_forward(self, state, max_dist=99999):
        dx = -math.sin(math.radians(self.rotation)) * min(self.speed, max_dist)
        dy = -math.cos(math.radians(self.rotation)) * min(self.speed, max_dist)
        if not self.check_collision(state, dx, dy):
            self.move(dx, dy)
        # self.move(dx, dy)

    def set_rotation(self, angle):
        self.rotation = angle

    def get_rotation(self):
        return self.rotation

    def get_turret_rotation(self):
        return self.turret_rotation

    def rotate_tank_towards(self, angle):

        self.rotation %= 360
        angle %= 360

        difference = angle - self.rotation

        # self.speed = self.max_speed * min(((90 - min(difference, 90)) / 90), 1)

        if abs(difference) > 180:
            self.rotation -= max(min(difference, TANK_TURN_SPEED), -TANK_TURN_SPEED)
        else:
            self.rotation += max(min(difference, TANK_TURN_SPEED), -TANK_TURN_SPEED)

    def rotate_turret_towards(self, angle):
        # self.turret_rotation = angle
        self.turret_rotation %= 360
        angle %= 360

        difference = angle - self.turret_rotation

        if abs(difference) > 180:
            self.turret_rotation -= max(min(difference, TURRET_TURN_SPEED), -TURRET_TURN_SPEED)
        else:
            self.turret_rotation += max(min(difference, TURRET_TURN_SPEED), -TURRET_TURN_SPEED)

    # Collect the actions that the ai would execute within the current game state
    def collectActions(self, state):
        self.actions, self.ai_path = self.ai.evaluate(self, state)

    # Execute the movement actions that have been captured before by collectActions()
    def executeActions(self, state):
        if self.destroyed:
            return

        executed_move = False
        executed_aim = False

        for action in self.actions:
            # Track whether a movement action has already been executed, if so cancel it.
            if is_movement_action(action.action_id):
                if executed_move:
                    continue
                executed_move = True

            # Track whether an aim action has already been executed, if so cancel it.
            if is_aim_action(action.action_id):
                if executed_aim:
                    continue
                executed_aim = True

            # Execute the action.
            action.execute(self, state)

    # Check for wall collisions.
    def check_collision(self, state, dx=0.0, dy=0.0):
        x, y = self.get_pos()
        x += dx
        y += dy
        # x = int(round(x))
        # y = int(round(y))

        # if state.level.get_object(math.floor(x), math.floor(y)) == Object.WALL:
        #     return True

        for t in state.tanks:
            if t == self:
                continue

            if distance(t.get_pos(), (x, y)) < 1.8:
                return True

        for a in numpy.arange(y - 0.8, y + 0.8, 0.2):
            for b in numpy.arange(x - 0.8, x + 0.8, 0.2):
                if not 0 <= a < state.level.get_height():
                    return True
                if not 0 <= b < state.level.get_width():
                    return True

                if state.level.get_object(int(math.floor(b)), int(math.floor(a))) == Object.WALL:
                    return True
        return False

    def hit(self, bullet):
        self.health -= 20

    def get_health(self):
        return self.health

    def bullet_ready(self, state):
        return state.frames_passed >= self.shoot_ready

    def visible_tanks(self, state):
        visible_tanks = []

        for other in state.tanks:
            if other == self:
                continue

            vision_angle = self.get_rotation() + self.get_turret_rotation()

            ax = -math.sin(math.radians(vision_angle))
            ay = -math.cos(math.radians(vision_angle))

            x, y = self.get_pos()

            other_x, other_y = other.get_pos()
            bx, by = other_x - x, other_y - y

            len_a = 1
            len_b = math.sqrt(bx ** 2 + by ** 2)

            if len_b == 0:
                continue

            inproduct = ((ax * bx) + (ay * by)) / (len_a * len_b)
            if inproduct > 1:
                inproduct = 1

            angle = math.degrees(math.acos(inproduct))

            if angle < VISION_RANGE or angle > 360 - VISION_RANGE:
                if state.level.direct_line_of_sight(self.get_pos(), other.get_pos()):
                    visible_tanks.append(other)

        return visible_tanks

    def visible_bullets(self, state):
        visible_bullets = []

        for other in state.bullets:
            if other == self:
                continue

            vision_angle = self.get_rotation() + self.get_turret_rotation()

            ax = -math.sin(math.radians(vision_angle))
            ay = -math.cos(math.radians(vision_angle))

            x, y = self.get_pos()

            other_x, other_y = other.get_pos()
            bx, by = other_x - x, other_y - y

            len_a = 1
            len_b = math.sqrt(bx ** 2 + by ** 2)
            if len_b == 0:
                continue

            inproduct = ((ax * bx) + (ay * by)) / (len_a * len_b)
            if inproduct > 1:
                inproduct = 1

            angle = math.degrees(math.acos(inproduct))

            if angle < VISION_RANGE or angle > 360 - VISION_RANGE:
                if state.level.direct_line_of_sight(self.get_pos(), other.get_pos()):
                    visible_bullets.append(other)

        return visible_bullets

    def destroy(self, game_mode):

        if game_mode == "KH":
            x, y = self.spawn
            self.set_pos(x, y)
            self.health = 100
            self.rotation = self.spawn_rotation
            self.turret_rotation = 0
            self.shoot_ready = 0
        else:
            self.destroyed = True

    def on_hill(self, state):
        p = state.level.get_path_to_object(self, Object.HILL)
        if p is not None and len(p) > 0:
            d = distance(self.get_pos(), p[-1])
            return d < 5

    def get_team(self):
        return self.team_id

    def handle_health_packs(self, state):
        if state.level.pickup_health_pack(state, self.get_pos()):
            self.health = 100

    def get_health(self):
        return self.health
