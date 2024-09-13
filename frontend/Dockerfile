# Use the official NGINX image
FROM nginx:alpine

# Copy the NGINX server configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy static HTML files (if any)
COPY ./dist/ /usr/share/nginx/html
