FROM node:18.12.1-alpine

WORKDIR /app

COPY frontend/package*.json .

RUN npm cache clean --force
RUN npm install

CMD [ "npm", "start" ]