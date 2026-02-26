# Use official Node.js runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application
COPY . .

# Build the app for production (Vite)
RUN npm run build

# Install a simple static server to serve the build output
RUN npm install -g serve

# Specify port
EXPOSE 5173

# Start the application specifying the build directory
CMD ["serve", "-s", "dist", "-l", "5173"]
