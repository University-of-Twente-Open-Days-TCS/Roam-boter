#!/usr/bin/env bash

# prepare cache
/usr/bin/env python manage.py generatecaches --levels level1

# start simulation workers
/usr/bin/env python manage.py startsimulationworkers & 
SIM_PID=$!

# run server
/usr/bin/env gunicorn roamboter.wsgi:application --bind 0.0.0.0:8000 --workers 3 &
GUNI_PID=$!

stop_gracefully(){
    kill -15 $SIM_PID
    kill -15 $GUNI_PID
    wait $!
    exit 0
}

trap 'stop_gracefully' SIGTERM
wait $GUNI_PID

