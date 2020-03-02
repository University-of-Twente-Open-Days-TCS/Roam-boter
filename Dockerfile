FROM python:3.7

ENV PYTHONBUFFERED 1 
ENV DJANGO_ENV dev 


ADD requirements/ /requirements/
RUN pip install -r /requirements/production.txt 

WORKDIR /django/ 

RUN useradd roambot 
RUN chown -R roambot /django 
USER roambot 

EXPOSE 8000
CMD exec gunicorn roamboter.wsgi:application --bind 0.0.0.0:8000 --workers 3
