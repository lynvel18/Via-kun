FROM node:25.2.1
WORKDIR /usr/src/bot
COPY . /usr/src/bot/
RUN npm install
CMD ["node", "src/index.js"]