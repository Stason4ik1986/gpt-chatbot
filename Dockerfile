FROM node:16-alpine

WORKDIR /gpt-chatbot

COPY package*.json ./

RUN npm ci

COPY . .

# Set the environment variables
ARG NODE_ENV
ENV PORT=3000
ENV NODE_ENV=$NODE_ENV
ENV OPEN_AI_API_KEY=$OPEN_AI_API_KEY
ENV TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
EXPOSE $PORT

RUN npm run build

CMD ["npm", "start"]
