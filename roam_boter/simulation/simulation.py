from ai import AI
from levelloader import LevelLoader
from tank import Tank
import visual_debug

MAX_GAME_LENGTH = 256


class SimulationState:
    level = None
    tanks = []
    frames_passed = 0

    def __init__(self, level, players):
        self.level = level
        self.tanks = [Tank(x) for x in players]


class Simulation:

    def __init__(self, level, players):
        self.ended = False
        self.state = SimulationState(level, players)

        

        pass

    def has_ended(self):
        return self.ended

    def get_tanks(self):
        return self.state.tanks

    def step(self):
        if self.state.frames_passed > MAX_GAME_LENGTH:
            self.ended = True
            return

        visual_debug.DRAW_WORLD(self.state)
        self.state.frames_passed += 1

        pass


level_loader = LevelLoader()

a = Simulation(level_loader.load_level("levels/level0.png"), [1, 1])

while not a.has_ended():
    print(a.step())

