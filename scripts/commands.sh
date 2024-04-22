# Getting DockerHub credentials
docker login

# Creating and Pushing server image to DockerHub
docker build -t khangtgr/nestjs-server .
docker push khangtgr/nestjs-server

# Cleanning Docker system
docker kill $(docker ps -aq)
docker rmi -f $(docker images -aq)
docker system prune -a --force
docker volume prune -f
docker volume rm $(docker volume ls -q)
docker network prune -f
docker system df
docker volume ls
docker network ls
docker images -a

# Starting up docker compose
docker compose up --build -d
sleep 3
docker compose ps -a
docker compose logs

# Re-init DB
docker compose down
docker volume rm capstone-app-server_postgres_data
docker compose up -d
sleep 3
docker logs nest-db

# Cleanning up docker compose
docker compose down
docker compose down --rmi all --volumes --remove-orphans
docker system prune -a --force
docker system df
docker volume ls
docker images -a