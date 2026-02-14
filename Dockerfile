# Build React
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Apache
FROM httpd:2.4

RUN echo "LoadModule proxy_module modules/mod_proxy.so" >> /usr/local/apache2/conf/httpd.conf \
 && echo "LoadModule proxy_http_module modules/mod_proxy_http.so" >> /usr/local/apache2/conf/httpd.conf \
 && echo "LoadModule rewrite_module modules/mod_rewrite.so" >> /usr/local/apache2/conf/httpd.conf

COPY apache.conf /usr/local/apache2/conf/httpd.conf
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

EXPOSE 80
