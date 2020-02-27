from objects import Object


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

    def set_rotation(self, angle):
        self.rotation = angle

    def get_rotation(self):
        return self.rotation

    def get_turret_rotation(self):
        return self.turret_rotation

    def rotate_turret_towards(self, angle):
        # self.turret_rotation = angle

        if angle - self.turret_rotation < 180:
            self.turret_rotation += min(angle - self.turret_rotation, 0.1)
        else:
            self.turret_rotation -= min(self.turret_rotation - angle, 0.1)

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
                if not 0 <= a < len(state.level):
                    return True
                if not 0 <= b < len(state.level[a]):
                    return True

                if state.level[a][b] == Object.WALL:
                    return True
        return False

    def hit(self, bullet):
        self.health -= 20

    def get_health(self):
        return self.health



