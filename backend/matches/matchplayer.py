from simulation.simulation import simulate

from AIapi.grammar import converter

import logging
logger = logging.getLogger("debugLogger")


class SimulationPlayer(object):

    def run_botmatch(self, botmatch):
        """
        Expects a pending BotMatch instance and runs the simulation.
        """
        if botmatch.simulation_state == "DONE":
            raise Exception("Simulation already has run")

        bot = botmatch.bot
        bot_ai = bot.ais.first() # take first of all ais
        team_ai = botmatch.ai

        # convert ais to AINode objects
        bot_ai_eval_tree = converter.convert_aijson(bot_ai.ai)
        team_ai_eval_tree = converter.convert_aijson(team_ai.ai)

        # send team ai as first player
        playback = simulate([team_ai_eval_tree, bot_ai_eval_tree])
        winner = playback.winner

        if winner == 0:
            botmatch.winner = botmatch.team
        else:
            botmatch.winner = None

        botmatch.simulation = playback.to_json()
        botmatch.simulation_state = "DONE"
        botmatch.save()


SIMULATION_PLAYER = SimulationPlayer()
