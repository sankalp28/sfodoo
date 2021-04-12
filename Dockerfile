FROM nginx:latest as main
COPY conf/default.conf /etc/nginx/conf.d/

FROM main
RUN mkdir /usr/share/nginx/html/sfodo
COPY dist/. /usr/share/nginx/html/sfodo/
