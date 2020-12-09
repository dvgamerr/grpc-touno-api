FROM node:lts-alpine

WORKDIR /app
COPY . /app

RUN npm i --production
EXPOSE 3000

ENV TZ Asia/Bangkok
CMD ["npm", "start"]
