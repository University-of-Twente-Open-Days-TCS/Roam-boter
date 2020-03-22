from simulation.simulation import simulate
from workers import task
from matches.models import BotMatch

from AIapi.grammar import converter

import logging

logger = logging.getLogger("debugLogger")


@task()
def process_simulation_task(botmatch_id):

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
    botmatch.save()
    logger.debug("Saved the match")


class SimulationPlayer(object):
    def run_botmatch(self, botmatch):
        """
        Expects a pending BotMatch instance and runs the simulation.
        """

        # send team ai as first player

        process_simulation_task(botmatch.pk)


# Setup simulation player object
SIMULATION_PLAYER = SimulationPlayer()
