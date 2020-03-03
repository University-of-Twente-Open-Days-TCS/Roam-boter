from .objects import Object

import math


class Bullet:
    x = 0
    y = 0

    owner = None

    angle_dir = 0

    def __init__(self, tank):
        self.angle_dir = tank.rotation + tank.turret_rotation
        self.x = tank.x
        self.y = tank.y
        self.speed = tank.bullet_speed
        self.owner = tank

        pass

    def set_pos(self, x, y):
        self.x = x
        self.y = y

    def get_pos(self):
        return self.x, self.y

    def check_collision_wall(self, state):
        if state.level[round(self.y)][round(self.x)] == Object.WALL:
            return True
        return False

    def check_collision_tank(self, state):
        for tank in state.tanks:
            if tank == self.owner:
                continue

            tx, ty = tank.get_pos()
            if tx - 1 < self.x < tx + 1 and ty - 1 < self.y < ty + 1:
                return tank
        return None

    def update(self, state):
        if self.check_collision_wall(state):
            state.bullets.remove(self)
            return

        tank = self.check_collision_tank(state)
        if tank is not None:
            state.bullets.remove(self)
            tank.hit(self)
            return

        self.x -= self.speed * math.sin(math.radians(self.angle_dir))
        self.y -= self.speed * math.cos(math.radians(self.angle_dir))

