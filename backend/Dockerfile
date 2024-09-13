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
