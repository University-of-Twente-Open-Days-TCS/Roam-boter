from django.core.management.base import BaseCommand
from django.db.utils import ProgrammingError

from matches.simulation_workers import WorkerPool


class Command(BaseCommand):

    help = """
           Start simulation workers to run simulations.\n
           Note that this command will block.\n
           You will have to call this command if you want to be able to simulate matches.
           """

    def handle(self, *args, **options):
        # check whether database is ready to start simulation workers
        try:
            self.stdout.write("\u001b[35mStarting simulation workers\u001b[0m")
            WorkerPool()
        except ProgrammingError:
            self.stdout.write("\u001b[35mCould not start simulation workers, because database has not been initialized\u001b[0m")
