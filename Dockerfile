# Use official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code to the working directory
COPY . .

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Run the app with npm start command
CMD ["npm", "start"]
