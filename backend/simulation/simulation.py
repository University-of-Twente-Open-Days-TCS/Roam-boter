from .levelloader import LevelLoader
from .tank import Tank
from .objects import Object
from .visual_debug import *
from .AINode import ActionNode, ConditionNode
from .conditions import Condition
from .actions import Action
from .playback import PlayBack, PlayBackEncoder
from .level import Level

import cProfile

import json

import os

import time

MAX_GAME_LENGTH = 10000000


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
        self.winner = None
        self.playback = PlayBack(level)
        self.playback.add_frame(self.state)

    # Put all tanks on their starting positions.
    def set_starting_position(self):
        spawns = self.get_spawns()
        for i, tank in enumerate(self.get_tanks()):
            tank.spawn = spawns[i]
            tank.team_id = i
            tank.set_pos(tank.spawn[0], tank.spawn[1])
            if spawns[i][1] < self.state.level.get_height() / 2:
                tank.set_rotation(180)
            else:
                tank.set_rotation(0)

    # Collect all spawns on the map.
    def get_spawns(self):
        result = []

        for obj, x, y in self.state.level.iterate():
            if obj == Object.SPAWN:
                result.append((float(x) + 0.5, float(y) + 0.5))
        return result

    # Return whether the game has ended or not.
    def has_ended(self):
        return self.ended

    # Return the tanks on the board.
    def get_tanks(self):
        return self.state.tanks

    # Return all bullets on the board.
    def get_bullets(self):
        return self.state.bullets

    # Step through one frame of the simulation
    def step(self):
        # Check if the simulation has ended
        if self.state.frames_passed > MAX_GAME_LENGTH or len(self.get_tanks()) <= 1:
            self.ended = True
            self.playback.winner = self.get_winner()
            return

        # Collect all actions that the tanks are going to execute according to their AI's
        for tank in self.get_tanks():
            tank.collectActions(self.state)

        # Execute all actions collected earlier, (this is separated so that every tank
        # has the exact same world data to decide their actions with.
        for tank in self.get_tanks():
            tank.executeActions(self.state)

        # Update bullet locations.
        for bullet in self.get_bullets():
            bullet.update(self.state)

        # Check if tanks don't have any HP left.
        for tank in self.get_tanks():
            if tank.get_health() <= 0:
                self.state.tanks.remove(tank)

        DRAW_WORLD(self.state)
        # Draw the world if VISUAL_DEBUG is True.

        self.state.frames_passed += 1

        # Add the frame to the playback.
        self.playback.add_frame(self.state)

    # Return the playback object containing the entire replay.
    def get_playback(self):
        return self.playback

    # Retrieve the winning AI object.
    def get_winner(self):
        if len(self.get_tanks()) == 1:
            return self.get_tanks()[0].ai
        else:
            return None


# Run the simulation with an array of ais to be executed.
# Params: [AINode]
# Returns: PlayBack
def simulate(ais):
    level_loader = LevelLoader()

    this_dir = os.path.dirname(os.path.realpath(__file__))
    level_file = os.path.join(this_dir, "levels/level2.png")

    sim = Simulation(level_loader.load_level(level_file), ais)
    while not sim.has_ended():
        sim.step()

    if sim.get_winner() is not None:
        ai = sim.get_winner()
        sim.winner = -1
        for i, x in enumerate(ais):
            if x == ai:
                sim.winner = i
                break
    else:
        sim.winner = -1

    return sim.get_playback()


def test_simulation():

    false_node = ActionNode([Action(10, {})])
    true_node = ActionNode([Action(1, {'obj': 10}), Action(10, {}), Action(5, {'obj': 2})])

    ai = ConditionNode(Condition(1, {'obj': 10, 'distance': 10}), true_node, false_node)
    simulate([ai, ai])

    # cProfile.run("simulate([ai, ai])")
    # PlayBackEncoder.encode(a.get_playback())


if __name__ == "__main__":
    test_simulation()
