
# ARG ARCH=arm32v7
# FROM ${ARCH}/node:lts-alpine
FROM node:lts-alpine

WORKDIR /app
COPY . /app

RUN yarn --production
EXPOSE 3000

ENV TZ Asia/Bangkok
CMD ["yarn", "start"]
