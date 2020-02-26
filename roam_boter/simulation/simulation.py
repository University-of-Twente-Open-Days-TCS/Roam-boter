from ai import AI
from levelloader import LevelLoader
from tank import Tank
from objects import Object
import visual_debug

MAX_GAME_LENGTH = 256


class SimulationState:
    level = None
    tanks = []
    bullets = []
    frames_passed = 0

    def __init__(self, level, players):
        self.level = level
        self.tanks = [Tank(x) for x in players]


class Simulation:

    def __init__(self, level, players):
        self.ended = False
        self.state = SimulationState(level, players)
        self.set_starting_position()

    def set_starting_position(self):
        spawns = self.get_spawns()
        for i, tank in enumerate(self.get_tanks()):
            tank.spawn = spawns[i] + (0.5, 0.5)
            tank.set_pos(tank.spawn[0], tank.spawn[1])

    def get_spawns(self):
        result = []
        for y, row in enumerate(self.state.level):
            for x, cell in enumerate(row):
                if cell == Object.SPAWN:
                    result.append((x, y))
        return result

    def has_ended(self):
        return self.ended

    def get_tanks(self):
        return self.state.tanks

    def step(self):
        if self.state.frames_passed > MAX_GAME_LENGTH:
            self.ended = True
            return

        for tank in self.get_tanks():
            tank.collectActions(self.state)

        for tank in self.get_tanks():
            tank.executeActions(self.state)

        visual_debug.DRAW_WORLD(self.state)
        self.state.frames_passed += 1

        pass


if __name__ == "__main__":
    level_loader = LevelLoader()

    a = Simulation(level_loader.load_level("levels/level0.png"), [1, 1])

    while not a.has_ended():
        print(a.step())

