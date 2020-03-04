from .objects import Object

import math

TANK_TURN_SPEED = 3
TURRET_TURN_SPEED = 4


class Tank:
    x = 0
    y = 0

    rotation = 0
    turret_rotation = 0

    degrees_visibility = 30
    hacked = True
    spawn = (0.0, 0.0)

    health = 100

    shoot_ready = 0
    reload_time = 60

    bullet_speed = 0.5
    speed = 0.1

    width = 1
    height = 1

    path = None

    def __init__(self, ai):
        self.ai = ai
        self.actions = []

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

    def move_forward(self, state):
        dx = -math.sin(math.radians(self.rotation)) * self.speed
        dy = -math.cos(math.radians(self.rotation)) * self.speed
        # if not self.check_collision(state, dx, dy):
        #     self.move(dx, dy)
        self.move(dx, dy)

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

    def collectActions(self, state):
        self.actions = self.ai.evaluate(self, state)

    def executeActions(self, state):
        for action in self.actions:
            action.execute(self, state)

    def check_collision(self, state, dx=0, dy=0):
        x, y = self.get_pos()
        x += dx
        y += dy
        x = int(round(x))
        y = int(round(y))

        for a in range(y - 1, y + 1):
            for b in range(x - 1, x + 1):
                if not 0 <= a < state.level.get_height():
                    return True
                if not 0 <= b < state.level.get_width():
                    return True

                if state.level.get_object(b, a) == Object.WALL:
                    return True
        return False

    def hit(self, bullet):
        self.health -= 20

    def get_health(self):
        return self.health

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

            inproduct = ((ax * bx) + (ay * by)) / (len_a * len_b)
            if inproduct > 1:
                inproduct = 1

            angle = math.degrees(math.acos(inproduct))

            if angle < 20 or angle > 340:
                if state.level.line_of_sight(self.get_pos(), other.get_pos()):
                    visible_tanks.append(other)

        return visible_tanks

    def visible_bullets(self, state):
        pass



