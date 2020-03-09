from .objects import Object

import math


# The bullet class keeping track of every thing a bullet has/does.
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

    # Set the absolute position of the bullet.
    def set_pos(self, x, y):
        self.x = x
        self.y = y

    # Get the absolute position of the bullet.
    def get_pos(self):
        return self.x, self.y

    # Check if a bullet has a collision with a wall.
    def check_collision_wall(self, state):
        if self.x < 0 or self.y < 0 or self.x > state.level.get_width() - 1 or self.y > state.level.get_height() - 1:
            return True

        if state.level.get_object(round(self.x), round(self.y)) == Object.WALL:
            return True
        return False

    # Check if a bullet has a collision with a tank.
    # TODO: This is now a rectangle collision, do we want it to stay that way?
    def check_collision_tank(self, state):
        for tank in state.tanks:
            if tank == self.owner:
                continue

            tx, ty = tank.get_pos()
            if tx - 1 < self.x < tx + 1 and ty - 1 < self.y < ty + 1:
                return tank
        return None

    # Process all bullet events.
    def update(self, state):
        # Check if there are wall collisions.
        if self.check_collision_wall(state):
            state.bullets.remove(self)
            return

        # Tank collisions.
        tank = self.check_collision_tank(state)
        if tank is not None:
            state.bullets.remove(self)
            tank.hit(self)
            return

        # Update position based on speed.
        self.x -= self.speed * math.sin(math.radians(self.angle_dir))
        self.y -= self.speed * math.cos(math.radians(self.angle_dir))

