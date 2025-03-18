# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install ALL dependencies (including dev dependencies) for build
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies and only keep production dependencies
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
