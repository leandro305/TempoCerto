FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ADD . .

EXPOSE 3000

CMD ["npm", "run", "nodemon"]