FROM node:16-alpine

MAINTAINER gangdonguri <rhkdgnsvk2@gmail.com>

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

ENV NODE_ENV production
EXPOSE 3000

COPY . .
CMD ["npm", "start"]
