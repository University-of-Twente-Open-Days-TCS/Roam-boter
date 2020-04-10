from .levelloader import LevelLoader
from .tank import Tank
from .objects import Object
from .visual_debug import *
from .AINode import ActionNode, ConditionNode
from .conditions import Condition
from .actions import Action
from .playback import PlayBack, PlayBackEncoder
from .level import Level

import simulation.settings as SETTINGS

import cProfile

import json

import os
import logging

import time

LOGGER = logging.getLogger('simulation.simulation')


class SimulationState:
    level = None
    tanks = []
    bullets = []
    frames_passed = 0
    scores = []

    def __init__(self, level, players):
        self.level = level
        self.bullets = []
        self.tanks = [Tank(x) for x in players]
        self.scores = [0 for _ in self.tanks]


class Simulation:

    def __init__(self, level, players, game_mode):
        self.ended = False
        self.state = SimulationState(level, players)
        self.set_starting_position()
        self.winner = None
        self.playback = PlayBack(level)

        # Fill the ai_path of the first frame.
        for tank in self.get_tanks():
            tank.collectActions(self.state)

        self.playback.add_frame(self.state)
        self.game_mode = game_mode

    # Put all tanks on their starting positions.
    def set_starting_position(self):
        spawns = self.get_spawns()

        for i, tank in enumerate(self.get_tanks()):
            tank.next_scout_increment = -1 + (i % 2) * 2

            tank.spawn = spawns[i]
            tank.team_id = i
            tank.set_pos(tank.spawn[0], tank.spawn[1])
            if spawns[i][1] < self.state.level.get_height() / 2:

                tank.set_rotation(180)
                tank.spawn_rotation = 180
            else:
                tank.set_rotation(0)
                tank.spawn_rotation = 0

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
        if self.check_game_end_condition():
            return

        # Execute gamemode specific stuff like king of the hill scores and bladiebla
        self.handle_game_mode()

        # Collect all actions that the tanks are going to execute according to their AI's
        for tank in self.get_tanks():
            tank.collectActions(self.state)

        # Execute all actions collected earlier, (this is separated so that every tank
        # has the exact same world data to decide their actions with.
        for tank in self.get_tanks():
            tank.executeActions(self.state)

        # Handle the possibility for a tank to be standing on a health pack.
        for tank in self.get_tanks():
            tank.handle_health_packs(self.state)

        for tank in self.get_tanks():
            tank.process_label_timers()

        # Update bullet locations.
        for bullet in self.get_bullets():
            bullet.update(self.state)

        # Check if tanks don't have any HP left.
        for tank in self.get_tanks():
            if tank.get_health() <= 0:
                self.state.scores[tank.get_team()] -= 1
                tank.destroy(self.game_mode)

        DRAW_WORLD(self.state)
        # Draw the world if VISUAL_DEBUG is True.

        self.state.frames_passed += 1

        # Add the frame to the playback.
        self.playback.add_frame(self.state)

    # Return the playback object containing the entire replay.
    def get_playback(self):
        self.playback.winner = self.get_winner()
        return self.playback

    # Retrieve the winning AI object.
    def get_winner(self):
        heighest_score = -99999999
        winner = None

        for i, s in enumerate(self.state.scores):
            if s == heighest_score:
                winner = None

            if s > heighest_score:
                heighest_score = s
                winner = i
        return winner

    def check_game_end_condition(self):
        # Check if time limit has been exceeded.
        if self.state.frames_passed > SETTINGS.MAX_FRAME_DATA * SETTINGS.FPS:
            self.ended = True
            return True

        # Check if there are still tanks alive.
        if self.game_mode == "DM":
            multiple_teams_alive = False
            for t in self.get_tanks():
                if multiple_teams_alive:
                    break

                if t.destroyed:
                    continue

                for t2 in self.get_tanks():
                    if t.get_team() == t2.get_team() or t2.destroyed:
                        continue
                    multiple_teams_alive = True
                    break
            if not multiple_teams_alive:
                self.ended = True
                return True

    def handle_game_mode(self):
        if self.game_mode == "KH":

            on_hill = []

            for t in self.get_tanks():
                if not t.destroyed and t.on_hill(self.state):
                    on_hill.append(t)  

            if len(on_hill) == 1:
                self.state.scores[on_hill[0].get_team()] += 1


        # if self.state.frames_passed > MAX_GAME_LENGTH or len(self.get_tanks()) <= 1:
        #     self.ended = True
        #     self.playback.winner = self.get_winner()
        #     return


# Run the simulation with an array of ais to be executed.
# Params: [AINode]
# Returns: PlayBack

LEVEL_LOADER = LevelLoader()

def simulate(ais, game_mode="DM", level="level1"):

    levelstate = LEVEL_LOADER.load_level(level)
    levelstate.reset()

    sim = Simulation(LEVEL_LOADER.load_level(level), ais, game_mode)
    while not sim.has_ended():
        sim.step()

    return sim.get_playback()

# Prepares caches for list of level names
def prepare_caches(levels):
    for l in levels:
        LEVEL_LOADER.load_level(l)


def test_simulation():

    false_node = ActionNode([Action(0, {})])
    true_node = ActionNode([Action(1, {'obj': 10})])

    ai = ConditionNode(Condition(1, {'obj': 10, 'distance': 1}), true_node, false_node)

    ai2 = ActionNode([Action(1, {'obj': 10})])
    playback = simulate([ai2, ai])

    print(playback.to_json([0, 1], ["Team1", "Team2"]))

    # cProfile.run("simulate([ai, ai])")
    # PlayBackEncoder.encode(a.get_playback())


if __name__ == "__main__":
    test_simulation()


