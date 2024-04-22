FROM node:20-alpine

RUN apk add --update bash

# Setting working directory. 
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . .

EXPOSE 3000

# Running the app
CMD [ "npm", "run", "cluster-prod" ]