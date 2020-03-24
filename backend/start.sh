#!/bin/bash
/usr/bin/env python manage.py generatecaches --levels level1 &
/usr/bin/env python manage.py startsimulationworkers & 
gunicorn roamboter.wsgi:application --bind 0.0.0.0:8000 --workers 3
