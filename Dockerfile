FROM node:alpine AS dataService

WORKDIR /app
COPY . /app 
RUN npm install



