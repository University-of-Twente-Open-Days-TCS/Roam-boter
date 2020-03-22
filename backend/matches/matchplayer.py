from simulation.simulation import simulate
from matches.models import BotMatch
from multiprocessing import Queue
from threading import Thread

from AIapi.grammar import converter

import logging

logger = logging.getLogger("debugLogger")

num_workers = 4


class SimulationPlayer(object):
    initialised_workers = False
    queue = Queue()

    def __init__(self):
        self.initialise_workers()

    def initialise_workers(self):
        self.initialised_workers = True

        for _ in range(num_workers):
            t = Thread(target=SimulationPlayer.worker_task, args=(self,))
            t.start()

    def worker_task(self):
        logger.debug("Simulation thread started")

        while True:
            botmatch_id = self.queue.get()
            botmatch = BotMatch.objects.get(pk=botmatch_id)

            if botmatch.simulation.state == "DONE":
                raise Exception("Simulation already has run")

            bot = botmatch.bot
            bot_ai = bot.ais.first()  # take first of all ais
            team_ai = botmatch.ai

            # convert ais to AINode objects
            bot_ai_eval_tree = converter.convert_aijson(bot_ai.ai)
            team_ai_eval_tree = converter.convert_aijson(team_ai.ai)

            playback = simulate([team_ai_eval_tree, bot_ai_eval_tree])
            if playback.winner == 0:
                botmatch.winner = botmatch.team
            else:
                botmatch.winner = None

            botmatch.simulation.simulation = playback.to_json(botmatch.team_id, -1)
            botmatch.simulation.state = "DONE"
            botmatch.simulation.save()
            botmatch.save()

    def run_botmatch(self, botmatch):
        self.queue.put(botmatch.pk)




# Setup simulation player object
SIMULATION_PLAYER = SimulationPlayer()
