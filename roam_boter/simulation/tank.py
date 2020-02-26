

class Tank:
    x = 0
    y = 0
    rotation = 0
    spawn = (0.0, 0.0)

    def __init__(self, ai):
        self.ai = ai

    def set_spawn(self, x, y):
        self.spawn = (x, y)

    def set_pos(self, x, y):
        self.x = x
        self.y = y
