# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json first to leverage cache
COPY package.json ./

# Install dependencies (none currently, but good practice)
# RUN npm install

# Copy application source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]
