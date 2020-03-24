import time


from django.db import transaction

from matches.models import BotMatch, Simulation
from dashboard.models import Team

from django.db.models import Q
from multiprocessing import Process

from multiprocessing import Queue
from enum import Enum

import traceback

import logging
LOGGER = logging.getLogger('matches.worker')


class WorkerPool:

    num_workers = 8
    match_queue = Queue()
    result_queue = Queue()

    class MatchKind(Enum):
        BotMatch = 0

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
                sim.winner = team_ids[playback_object.winner]
                sim.playback = simulate(eval_trees).to_json(team_ids)
                sim.success = True

            except Exception:
                LOGGER.debug(traceback.format_exc())

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
                for botmatch in unplayed_matches:
                    botmatch.simulation.state = Simulation.SimulationState.BUSY
                    botmatch.simulation.save()

                    sim = self.SimulationObject()
                    sim.match_id = botmatch.pk
                    sim.kind = self.MatchKind.BotMatch
                    sim.players = [(botmatch.team_id, botmatch.ai.ai), (None, botmatch.bot.ais.first().ai)]

                    self.match_queue.put(sim)

    # Process the results from the workers.
    def handle_results(self):
        results = {}
        while self.result_queue.qsize() > 0:
            sim = self.result_queue.get()
            results[sim.match_id] = sim

        # Request all botmatches within results
        bot_matches = BotMatch.objects.filter(pk__in=results.keys())
        for bot_match in bot_matches:
            sim = results[bot_match.pk]

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
            # print("match", bot_match.pk, "played", len(bot_matches))
