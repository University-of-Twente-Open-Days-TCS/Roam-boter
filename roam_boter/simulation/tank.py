

class Tank:
    x = 0
    y = 0

    rotation = 0
    turret_rotation = 0

    degrees_visibility = 30
    hacked = True
    spawn = (0.0, 0.0)

    shoot_ready = 0
    reload_time = 60

    bullet_speed = 1

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

    def collectActions(self, state):
        self.actions = self.ai.evaluate(self, state)

    def executeActions(self, state):
        for action in self.actions:
            action.execute(self, state)



