from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

import os
import sys
sys.path.append(os.path.join(settings.PROJECT_PATH, 'simulation'))

from simulation.simulation import prepare_caches


class Command(BaseCommand):
    """
    Generates the caches for a list of levels
    """

    help = "Generates the level caches necessary for simulation"

    def add_arguments(self, parser):
        parser.add_argument('--levels', nargs='+', help="Only prepare caches for given levels")

    def handle(self, *args, **options):
        if options['levels'] is not None:
            for level in options['levels']:
                self.stdout.write(self.style.SUCCESS("Preparing cache for level: " + level))
                prepare_caches([level])
        else:
            raise CommandError("TODO: Implement preparing caches for level files in level folder")
