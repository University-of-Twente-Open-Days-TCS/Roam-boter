from django.core.management.base import BaseCommand

from matches.simulation_workers import WorkerPool

class Command(BaseCommand):

    def handle(self, *args, **options):
        self.stdout.write("Starting simulation workers")
        WorkerPool()
