# Stage 1: Build React App
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Apache Server
FROM httpd:2.4

COPY --from=build /app/build/ /usr/local/apache2/htdocs/

EXPOSE 80
