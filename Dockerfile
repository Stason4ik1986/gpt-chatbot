# Use official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code to the working directory
COPY . .

# Set environment variables for Telegram Bot API token and ChatGPT API endpoint
ENV TELEGRAM_BOT_TOKEN=<insert_token_here>
ENV CHATGPT_API_ENDPOINT=<insert_endpoint_here>

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Run the app with npm start command
CMD [ "npm", "start" ]
