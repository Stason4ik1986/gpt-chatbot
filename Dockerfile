# Use official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app/src

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code to the working directory
COPY . .

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Set the environment variables
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ENV OPEN_AI_API_KEY=$OPEN_AI_API_KEY
ENV TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN

# Copy the environment variable files to the container
COPY .env.development .env.production ./

RUN npm run build
# Run the app with npm start command
CMD [ "node", "src/main.js" ]
