import time


from django.db import transaction

from matches.models import BotMatch, TeamMatch, Simulation
from dashboard.models import Team

from django.db.models import Q
from multiprocessing import Process

from multiprocessing import Queue
from enum import Enum

import traceback

import logging
logger = logging.getLogger('debugLogger')


class WorkerPool:

    num_workers = 8
    match_queue = Queue()
    result_queue = Queue()

    class MatchKind(Enum):
        BotMatch = 0
        TeamMatch = 1

    class SimulationObject:
        success = False
        match_id = None
        kind = None
        players = None
        playback = None
        winner = None

    def __init__(self):
        self.reset_unfinished_matches()
        self.init_workers()

        while True:
            self.collect_matches()
            self.handle_results()
            time.sleep(1)

    # Reset lost matches.
    @staticmethod
    def reset_unfinished_matches():
        unplayed_matches = BotMatch.objects.filter(~Q(simulation__state=Simulation.SimulationState.DONE),
                                                   ~Q(simulation__state=Simulation.SimulationState.IDLE))
        for x in unplayed_matches:
            x.simulation.state = Simulation.SimulationState.PENDING
            x.simulation.save()

    # Initialise workers
    def init_workers(self):
        for _ in range(self.num_workers):
            t = Process(target=WorkerPool.worker_task, args=(self.match_queue, self.result_queue))
            t.start()

    @staticmethod
    def worker_task(in_queue, out_queue):
        from AIapi.grammar import converter
        from simulation.simulation import simulate

        while True:
            sim = in_queue.get()

            try:
                eval_trees = []
                team_ids = []
                for team_id, ai in sim.players:
                    eval_trees.append(converter.convert_aijson(ai))
                    team_ids.append(team_id)

                playback_object = simulate(eval_trees)

                # Check for a tie.
                if playback_object.winner is None:
                    sim.winner = None
                else:
                    sim.winner = team_ids[playback_object.winner]

                sim.playback = simulate(eval_trees).to_json(team_ids)
                sim.success = True

            except Exception:
                logger.debug(traceback.format_exc())

            # If anything goes wrong with the simulation, still return the object, because success is false by default.
            finally:
                out_queue.put(sim)

    # Collect matches and distribute them over workers.
    def collect_matches(self):
        # Fill queue of matches up to a maximum that will be processed at the same time.
        queue_left = self.num_workers * 2 - self.match_queue.qsize()

        # Optional status print every second
        # print("queue length: ", self.match_queue.qsize(), "result length: ", self.result_queue.qsize())
        if queue_left > 0:

            unplayed_matches = BotMatch.objects.filter(simulation__state=Simulation.SimulationState.PENDING)[0:queue_left]
            with transaction.atomic():
                for bot_match in unplayed_matches:
                    bot_match.simulation.state = Simulation.SimulationState.BUSY
                    bot_match.simulation.save()

                    sim = self.SimulationObject()
                    sim.match_id = bot_match.pk
                    sim.kind = self.MatchKind.BotMatch
                    sim.players = [(bot_match.team_id, bot_match.ai.ai), (None, bot_match.bot.ais.first().ai)]

                    self.match_queue.put(sim)

        queue_left = self.num_workers * 2 - self.match_queue.qsize()
        if queue_left > 0:
            unplayed_matches = TeamMatch.objects.filter(simulation__state=Simulation.SimulationState.PENDING)[0:queue_left]
            with transaction.atomic():
                for team_match in unplayed_matches:
                    team_match.simulation.state = Simulation.SimulationState.BUSY
                    team_match.simulation.save()

                    sim = self.SimulationObject()
                    sim.match_id = team_match.pk
                    sim.kind = self.MatchKind.TeamMatch
                    sim.players = [(team_match.initiator_id, team_match.initiator_ai.ai),
                                   (team_match.opponent_id, team_match.opponent_ai.ai)]

    # Process the results from the workers.
    def handle_results(self):
        bot_results = {}
        team_results = {}
        while self.result_queue.qsize() > 0:
            sim = self.result_queue.get()

            if sim.kind == self.MatchKind.BotMatch:
                bot_results[sim.match_id] = sim

            if sim.kind == self.MatchKind.TeamMatch:
                team_results[sim.match_id] = sim

        # Request all botmatches within results
        bot_matches = BotMatch.objects.filter(pk__in=bot_results.keys())
        for bot_match in bot_matches:
            sim = bot_results[bot_match.pk]

            if sim.success:
                winner = Team.objects.filter(pk=sim.winner).first()
                bot_match.winner = winner
                bot_match.simulation.simulation = sim.playback
                bot_match.simulation.state = Simulation.SimulationState.DONE
                bot_match.simulation.save()
            else:
                bot_match.simulation.state = Simulation.SimulationState.IDLE
                bot_match.simulation.save()
            bot_match.save()

        # Request all team matches within results
        team_matches = TeamMatch.objects.filter(pk__in=team_results.keys())
        for team_match in team_matches:
            sim = team_results[team_match.pk]

            if sim.success:
                winner = Team.objects.filter(pk=sim.winner).first()
                team_match.winner = winner
                team_match.simulation.simulation = sim.playback
                team_match.simulation.state = Simulation.SimulationState.DONE
                team_match.simulation.save()
            else:
                team_match.simulation.state = Simulation.SimulationState.IDLE
                team_match.simulation.save()
            team_match.save()
