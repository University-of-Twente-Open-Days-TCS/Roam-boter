from multiprocessing import Process, Queue
from threading import Thread
import time

from AIapi.grammar import converter
from matches.models import BotMatch, Simulation

from django.db.models import Q

num_workers = 4
match_queue = Queue()
result_queue = Queue()

# Reset lost matches.
unplayed_matches = BotMatch.objects.filter(~Q(simulation__state=Simulation.SimulationState.DONE))
for x in unplayed_matches:
    x.simulation.state = Simulation.SimulationState.IDLE
    x.simulation.save()


def worker_task(match_queue, result_queue):
    from simulation.simulation import simulate

    while True:
        botmatch_id, ais = match_queue.get()
        playback = simulate(ais)
        result_queue.put((botmatch_id, playback))



# Initialise workers
for _ in range(num_workers):
    t = Process(target=worker_task, args=(match_queue, result_queue))
    t.start()


# Check database for possible matches to play.
while True:


    # Queue unplayed matches
    unplayed_matches = BotMatch.objects.filter(simulation__state=Simulation.SimulationState.IDLE)
    print("matches on idle: ", len(unplayed_matches), "queue length: ", match_queue.qsize())

    for botmatch in unplayed_matches:
        botmatch.simulation.state = Simulation.SimulationState.PENDING
        botmatch.simulation.save()

        bot = botmatch.bot
        bot_ai = bot.ais.first()  # take first of all ais
        team_ai = botmatch.ai

        # convert ais to AINode objects
        bot_ai_eval_tree = converter.convert_aijson(bot_ai.ai)
        team_ai_eval_tree = converter.convert_aijson(team_ai.ai)

        match_queue.put((botmatch.pk, [team_ai_eval_tree, bot_ai_eval_tree]))

    while not result_queue.empty():
        botmatch_id, playback = result_queue.get()
        botmatch = BotMatch.objects.get(pk=botmatch_id)

        if playback.winner == 0:
            botmatch.winner = botmatch.team
        else:
            botmatch.winner = None

        botmatch.simulation.simulation = playback.to_json(botmatch.team_id, -1)
        botmatch.simulation.state = Simulation.SimulationState.DONE
        botmatch.simulation.save()
        botmatch.save()
        print("match", botmatch_id, "played")

    time.sleep(0.5)
