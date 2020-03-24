# RoamBot-er
Open Days Workshop for University of Twente. 

## Table of contents
>[Installation](#installation)

>[Troubleshooting](#troubleshooting)

## Installation 

### Dependencies
Make sure you have docker and docker-compose installed. It is important that docker-compose supports at least 3.7 version docker-compose.yml files.

### Installation Steps

1. Clone the git repository.
2. CD to the git repository. 

Build the docker containers:

3. `sudo docker-compose build` 

Start the docker containers:

4. `sudo docker-compose up`

The above commands will have initialized and started the containers. The django web server is not ready yet. First the database needs to initialized and a super user must be created. 
To do this you first have to open a new terminal and get inside the 'web' docker container.

5. `docker exec -it roambot-er_web_1 /bin/bash` 

   This will give you a bash terminal inside of the docker container.

Initialize the database:

6. `python manage.py migrate` 

Create a super user:

7. `python manage.py createsuperuser` 

   Follow the instructions to create credentials for the superuser.


### Migrations
Follow the following commands to ready the django database for errors.

1. `sudo docker-compose build`
2. `sudo docker-compose up`

Go in the shell of your django docker container 

3. `sudo docker exec -it roambot-er_web_1 /bin/bash`
4. `./manage.py makemigrations <app-names>`

   Fill in all apps to make sure all migrations happen.

5. `./manage.py migrate`

### Generating cache
For every level a cache needs to be generated to do this run the prepare\_caches.py script with the level names.

For example the following command will generate cache for level1 and level2:

`./prepare_caches.py level1 level2`

### Starting simulation workers
To simulate matches efficiently the webserver uses multiprocessing.
This is done with a worker pool which take pending simulations from a queue and simulate them.
The workers can be started as follows:

`./manage.py startsimulationworkers`

Note this done as a background process in the start.sh file.
This file is run when the docker container is started.


### Insert bots
Follow the following command to load bots into the database.

1. ./manage.py loaddata roamboter/fixtures/bots.json

## Troubleshooting

### Migrations won't apply
Django keeps track of the migrations in it's own database table. 
Sometimes by a sudden change of code migrations can't be applied.
The suggested approach to fix this is to delete the database.

#### Full reset
Complete these steps to fully reset the webserver.
**NOTE:** Be very carefull when completing these steps on a system with other docker containers.
It will delete all data in ALL docker containers. 
Also in the contaiers not related to the RoamBot-er Project.

1.  Delete all migration files. (keep \_\_init\_\_.py)
2.  `sudo docker-compose down`
3.  `sudo docker volume rm $(sudo docker volume -q)`

    This will delete **all** docker volumes on the system!

4.  Follow installations steps. 

### Makemigrations doesn't create all migrations
Make sure you specify app names as follows:

    `./manage.py makemigrations app1-name app2-name etc...

