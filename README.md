# RoamBot-er
Open Days Workshop for University of Twente. 

## Installation 

### Dependencies
Make sure you have docker and docker-compose installed. It is important that docker-compose supports at least 3.7 version docker-compose.yml files.

### Installation Steps

1. Clone the git repository.
2. CD to the git repository. 

Build the docker containers:

3. `docker-compose build` 

Start the docker containers:

4. `docker-compose up`

The above commands will have initialized and started the containers. The django web server is not ready yet. First the database needs to initialized and a super user must be created. 
To do this you first have to open a new terminal and get inside the 'web' docker container.

5. `docker exec -it roambot-er_web_1 /bin/bash` 

   This will give you a bash terminal inside of the docker container.

Initialize the database:

6. `python manage.py migrate` 

Create a super user:

7. `python manage.py createsuperuser` 

   Follow the instructions to create credentials for the superuser.


