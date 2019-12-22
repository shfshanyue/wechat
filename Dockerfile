FROM node:10-alpine

WORKDIR /code

ADD package.json /code
RUN npm install --production

ADD . /code

CMD npm start
