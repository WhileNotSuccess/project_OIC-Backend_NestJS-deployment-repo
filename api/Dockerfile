# Use the official Node.js image as the base image
FROM node:20-trixie

RUN mkdir /files

RUN apt-get update && apt-get install -y locales && sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]