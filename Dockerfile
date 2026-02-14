# Stage 1
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# Stage 2
FROM httpd:2.4-alpine

RUN rm -rf /usr/local/apache2/htdocs/*

COPY --from=build /app/dist /usr/local/apache2/htdocs

EXPOSE 80
