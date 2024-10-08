# Docker-Multi-Service-Application-with-NGINX-Reverse-Proxy-and-PostgreSQL
This project demonstrates a multi-service Docker-based application with NGINX as a reverse proxy, a Node.js backend connected to a PostgreSQL database, and static content served as the frontend. It highlights key DevOps concepts, such as Docker networks, volumes, and service orchestration through docker-compose

 ![Project UI](Images/Multi-Service-Application.png)


# Docker Multi-Service Application with NGINX Reverse Proxy and PostgreSQL

This project demonstrates a multi-service Docker-based application with NGINX as a reverse proxy, a Node.js backend connected to a PostgreSQL database, and static content served by the frontend. It highlights key DevOps concepts such as Docker networks, volumes, and service orchestration through `docker-compose`.

## Project Structure

```bash
.
├── backend
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend
├── Dockerfile
│   ├── dist
│   │   └── index.html
│   ├── nginx
│   │   ├── default.conf
└── docker-compose.yml
```

## Tools and Concepts Used

- **Docker**: Containerization of backend, frontend, and database services.
- **Docker Networks**: Three distinct networks to isolate and manage communication between frontend, backend, and database services.
- **Docker Volumes**: Persistent storage for PostgreSQL data.
- **NGINX**: Acts as a reverse proxy for routing frontend requests to the backend service.
- **PostgreSQL**: Database for handling persistent data from backend requests.
- **Node.js (Express)**: Backend server handling API requests and connecting to PostgreSQL.

---

## Step 1: Setting up the Project Structure

1. Create a new folder for your project.
    ```bash
    mkdir docker-multi-service
    cd docker-multi-service
    ```

2. Inside the project folder, create directories for each service:
    ```bash
    mkdir frontend backend database
    ```

---

## Step 2: Set Up the Frontend with NGINX Reverse Proxy

1. In the **frontend** directory, create a `Dockerfile` for NGINX:
    ```dockerfile
      # Use the official NGINX image
      FROM nginx:alpine

      # Copy the NGINX server configuration
      COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

      # Copy static HTML files (if any)
      COPY ./dist/ /usr/share/nginx/html
    ```

2. Create a simple HTML file in `frontend/dist/index.html`:
    ```html
    <!DOCTYPE html>
    <html>
    <head>
      <title>Frontend with NGINX</title>
    </head>
    <body>
      <h1>Welcome to the Frontend</h1>
    </body>
    </html>
    ```

3. Create an NGINX config file in `frontend/nginx/default.conf`:
    ```nginx
    server {
      listen 80;

      location / {
        root /usr/share/nginx/html;
        index index.html;
      }

      location /api/ {
        proxy_pass http://backend:5000;
      }
    }
    ```

---

## Step 3: Set Up the Backend

1. In the **backend** directory, create a `Dockerfile` for your Node.js backend:
    ```dockerfile
    FROM node:14

    # Create app directory
    WORKDIR /app

    # Copy app source code
    COPY package.json ./
    RUN npm install

    COPY . .

    # Expose port 5000 for the backend
    EXPOSE 5000

    CMD ["npm", "start"]
    ```

2. Create a `server.js` file in the `backend` folder:
    ```javascript
    const express = require('express');
    const app = express();
    const PORT = 5000;

    app.get('/api', (req, res) => {
      res.send({ message: 'Hello from the backend!' });
    });

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
    ```

3. Create a `package.json` file in the `backend` directory:
    ```json
    {
      "name": "backend",
      "version": "1.0.0",
      "description": "",
      "main": "server.js",
      "scripts": {
        "start": "node server.js"
      },
      "dependencies": {
        "express": "^4.17.1"
      }
    }
    ```

---

## Step 4: Set Up the Database (PostgreSQL)

1. For the **database**, you can use the official PostgreSQL image. No Dockerfile is needed.
2. Ensure that Docker Compose points to the PostgreSQL image and mounts a volume for data persistence.

---

## Step 5: Docker Compose File

Here’s your `docker-compose.yml` file that sets up the services, networks, and volumes:

```yaml
version: '3'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "8081:80"
    networks:
      - frontend_network
      - backend_network
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    networks:
      - backend_network
      - database_network
    depends_on:
      - database

  database:
    image: postgres
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - database_network

networks:
  frontend_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.18.0.0/16
          gateway: 172.18.0.1
  backend_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.19.0.0/16
          gateway: 172.19.0.1
  database_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
          gateway: 172.20.0.1

volumes:
  db_data
```
## Step 6: Build and Run Your Application
1. Build the services:
```bash
sudo docker-compose up --build
```
2. he frontend should now be accessible at `http://localhost:8081`, and the backend should respond at `/api`on the same port through the reverse proxy.

## Step 7: Test NGINX Reverse Proxy
To test that the NGINX reverse proxy is properly forwarding requests from the frontend to the backend, visit the following URL:
```bash
http://localhost:8081/api
```
If everything is working correctly, you should see the message returned by the backend:
```bash
{
  "message": "Hello from the backend!"
}

```
![Nginx UI](Images/Nginx-reverse-proxy-ui.png)

This verifies that NGINX is correctly proxying the /api requests to the backend service running on port 5000.
