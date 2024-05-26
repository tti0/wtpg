FROM node:20-slim

WORKDIR /opt/app

COPY package.json ./

RUN yarn install

COPY . .

ENV PORT=4459

EXPOSE 4459

CMD ["yarn", "run", "start"]
