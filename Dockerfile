FROM node:22.10.0-alpine
WORKDIR /var/www/notification
COPY . .
RUN npm install

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start:dev"]
