from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from matches.simulation_workers import WorkerPool

import os
import sys
sys.path.append(os.path.join(settings.PROJECT_PATH, 'simulation'))


class Command(BaseCommand):
    """
    Stops all the simulations that do not yet have a winner
    """

    help = "Generates the level caches necessary for simulation"

    def handle(self, *args, **options):
        WorkerPool.remove_unfinished_simulations()

