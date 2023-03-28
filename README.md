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

Make sure to set the number of simulation workers:
   In backend/matches/simulation\_worker.py change the line:
      `num_workers = 8` to the number of cores that should be used for simulations.

Build the docker containers:

3. `sudo docker-compose build` 

Start the docker containers:

4. `sudo docker-compose up`

The above commands will have initialized and started the containers. The django web server is not ready yet. First the database needs to initialized and a super user must be created. 
To do this you first have to open a new terminal and get inside the 'web' docker container.

5. `sudo docker exec -it roam-boter_web_1 /bin/bash` 

   This will give you a bash terminal inside the docker container.

Initialize the database:

6. `python manage.py migrate` 

Create a super user:

7. `python manage.py createsuperuser` 

   Follow the instructions to create credentials for the superuser.

Make the migrations for the apps:

8. `python manage.py makemigrations AIapi dashboard matches`
9. `python manage.py migrate` 

Reboot the roam-boter_web_1 container to make sure that the simulation workers are created.

10. `sudo docker restart roam-boter_web_1`


### Migrations
Follow the following commands to ready the django database for errors.

1. `sudo docker-compose build`
2. `sudo docker-compose up`

Go in the shell of your django docker container 

3. `sudo docker exec -it roam-boter_web_1 /bin/bash`
4. `./manage.py makemigrations <app-names>`

   Fill in all apps to make sure all migrations happen.

5. `./manage.py migrate`

### Generating cache
For every level a cache needs to be generated to do this run the prepare\_caches.py script with the level names.

For example the following command will generate cache for level1 and level2:

`./manage.py generatecaches --levels <level-name-1> <level-name-2>`

### Starting simulation workers
To simulate matches efficiently the webserver uses multiprocessing.
This is done with a worker pool which take pending simulations from a queue and simulate them.
The workers can be started as follows:

`./manage.py startsimulationworkers`

Note this done as a background process in the start.sh file.
This file is run when the docker container is started.


### Insert bots
Follow the following command to load bots into the database.

1. `./manage.py loaddata roamboter/fixtures/bots.json`


### NGINX Reverse Proxy
Use the following server configuration for the nginx reverse proxy:
```
server {
	listen 443 ssl;
	listen [::]:443 ssl;

	ssl_certificate /etc/letsencrypt/live/roamboter.ia.utwente.nl/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/roamboter.ia.utwente.nl/privkey.pem;

	server_name roamboter.ia.utwente.nl roamboter.inter-actief.utwente.nl;

	location / {
		proxy_pass http://127.0.0.1:3000;
	}

	location ^~ /.well-known/acme-challenge/ {
		root /var/www/letsencrypt;
		default_type text/plain;
	}

	location = /.well-known/acme-challenge/ {
		return 404;
	}
}

server {
	listen 443 ssl;
	listen [::]:443 ssl;

	ssl_certificate /etc/letsencrypt/live/roamboter.ia.utwente.nl/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/roamboter.ia.utwente.nl/privkey.pem;

	server_name api.roamboter.ia.utwente.nl api.roamboter.inter-actief.utwente.nl;
	underscores_in_headers on;

	location / {
		proxy_pass http://127.0.0.1:8000;
		proxy_pass_request_headers on;
	}

	location ^~ /.well-known/acme-challenge/ {
		root /var/www/letsencrypt;
		default_type text/plain;
	}

	location = /.well-known/acme-challenge/ {
		return 404;
	}
}
```

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
3.  `sudo docker volume rm $(sudo docker volume ls -q)`

    This will delete **all** docker volumes on the system!

4.  Follow installations steps. 

### Makemigrations doesn't create all migrations
Make sure you specify app names as follows:

    `./manage.py makemigrations AIapi dashboard matches`

