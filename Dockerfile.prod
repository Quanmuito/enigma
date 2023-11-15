# Stage 1: Build the application base image with node
FROM node:20.9.0-alpine3.17 as builder

# Set the working directory in the container
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

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

# Remove Nginx default static file
RUN rm -rf /usr/share/nginx/html/*

# Copy the 1st stage’s static resources onto the current image. Note: the destination should match with 'homepage' in package.json
COPY --from=builder /app/build /usr/share/nginx/html/enigma
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Give instructions to run the application inside the container
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]