# https://hub.docker.com/_/node/tags
FROM node:20.12.1-slim

WORKDIR /home/node/api

# Copying the necessary files
COPY package*.json ./

# Installing dependencies
RUN npm ci

# Copying the rest of the application files
COPY . .

# Building the application
RUN npm run build

# Expose the configured port on http_port
EXPOSE $PORT

# Command to start the application
CMD ["npm", "start"]
# ENTRYPOINT ["node", "dist/index.js"]