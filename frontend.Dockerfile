FROM node:18-alpine

WORKDIR /src
ADD ./project-mp/ /src
EXPOSE 3000

RUN npm install

CMD npm start
