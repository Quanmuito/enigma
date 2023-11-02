# Stage 1: Build the application base image with node
FROM node:20.9.0-alpine3.17 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json .
COPY yarn.lock .

# Install app dependencies using Yarn
RUN yarn install

# Copy the rest of your application code to the container
COPY . .

# Compile the application for docker
RUN yarn build

# Stage 2: Create a new image with Nginx
FROM nginx:1.25.3-alpine

# Set the working directory in the new container. Note: this directory is the default of nginx
WORKDIR /usr/share/nginx/html

# Remove Nginx default static file
RUN rm -rf ./*

# Copy the 1st stage’s static resources onto the current image. Note: the destination should match with 'homepage' in package.json
COPY --from=builder /app/build ./enigma

# Give instructions to run the application inside the container
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]