FROM nginx:stable-bookworm-perl

# Copy custom nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf
