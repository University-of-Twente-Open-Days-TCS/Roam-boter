import time
import signal

from django.db import transaction

from matches.models import BotMatch, TeamMatch, Simulation
from dashboard.models import Team

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
        TeamMatch = 1

    class SimulationObject:
        pass

    def __init__(self):
        self.stopped = False
        self.reset_unfinished_matches()

        self.processes = self.init_workers()
        signal.signal(signal.SIGTERM, self.stop_gracefully)
        signal.signal(signal.SIGINT, self.stop_gracefully)
        signal.signal(signal.SIGHUP, self.stop_gracefully)

        self.start()

    def stop_gracefully(self, signum, frame):
        LOGGER.info("STOPPING SIMULATION WORKERS")
        self.stopped = True

        # kill workers.
        # this can be done dirty, because lost matches are collected at the start.
        for process in self.processes:
            process.terminate()
            process.join()

    def start(self):
        while not self.stopped:
            self.collect_matches()
            self.handle_results()
            time.sleep(0.5)

    # Reset lost matches.
    @staticmethod
    def reset_unfinished_matches():

        # find busy simulated Bot Matches and reset them.
        unplayed_matches = BotMatch.objects.filter(simulation__state=Simulation.SimulationState.BUSY)

        for x in unplayed_matches:
            x.simulation.state = Simulation.SimulationState.PENDING
            x.simulation.save()

        # find busy simulated Team Matches
        unplayed_matches = TeamMatch.objects.filter(simulation__state=Simulation.SimulationState.BUSY)

        for x in unplayed_matches:
            x.simulation.state = Simulation.SimulationState.PENDING
            x.simulation.save()

    @staticmethod
    def remove_unfished_simulations():
        unplayed_matches = BotMatch.objects.filter(simulation__state=Simulation.SimulationState.BUSY)
        for x in unplayed_matches:
            x.delete()

        unplayed_matches = TeamMatch.objects.filter(simulation__state=Simulation.SimulationState.BUSY)
        for x in unplayed_matches:
            x.delete()

        unfinished_simulations = Simulation.objects.filter(state=Simulation.SimulationState.BUSY)
        for x in unfinished_simulations:
            x.delete()


    # Initialise workers
    def init_workers(self):
        processes = []

        for _ in range(self.num_workers):
            t = Process(target=WorkerPool.worker_task, args=(self.match_queue, self.result_queue))
            t.start()
            LOGGER.info("Created simulation worker: " + str(t.pid))
            processes.append(t)

        return processes

    @staticmethod
    def worker_task(in_queue, out_queue):
        from AIapi.grammar import converter
        from simulation.simulation import simulate

        while True:
            sim = in_queue.get()

            try:
                eval_trees = []
                team_ids = []
                team_names = []
                for team_id, team_name, ai in sim.players:
                    eval_trees.append(converter.convert_aijson(ai))
                    team_ids.append(team_id)
                    team_names.append(team_name)

                playback_object = simulate(eval_trees)

                # Check for a tie.
                if playback_object.winner is None:
                    sim.winner = None
                else:
                    sim.winner = team_ids[playback_object.winner]

                sim.playback = playback_object.to_json(team_ids, team_names)
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
                for bot_match in unplayed_matches:
                    bot_match.simulation.state = Simulation.SimulationState.BUSY
                    bot_match.simulation.save()

                    sim = self.SimulationObject()
                    sim.match_id = bot_match.pk
                    sim.kind = self.MatchKind.BotMatch
                    sim.players = [(bot_match.team_id, bot_match.team.team_name, bot_match.ai.ai), (None, bot_match.bot.name, bot_match.bot.ais.first().ai)]

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
                    sim.players = [(team_match.initiator_id, team_match.initiator.team_name, team_match.initiator_ai.ai),
                                   (team_match.opponent_id, team_match.opponent.team_name, team_match.opponent_ai.ai)]

                    self.match_queue.put(sim)

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
