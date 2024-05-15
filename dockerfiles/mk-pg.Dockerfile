FROM postgres:16.2-bullseye

# Copy the init script to the docker-entrypoint-initdb.d directory
COPY ./schema/init.sql /docker-entrypoint-initdb.d/init.sql
