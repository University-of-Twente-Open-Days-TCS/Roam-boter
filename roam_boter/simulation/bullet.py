from math import sin, cos

class Bullet:
    x = 0
    y = 0

    angle_dir = 0

    def __init__(self, tank):
        self.angle_dir = tank.rotation + tank.turret_rotation
        self.x = tank.x
        self.y = tank.y
        self.speed = tank.bullet_speed

        pass

    def set_pos(self, x, y):
        self.x = x
        self.y = y

    def get_pos(self):
        return self.x, self.y

    def update(self):
        self.x -= self.speed * sin(self.angle_dir)
        self.y += self.speed * cos(self.angle_dir)

