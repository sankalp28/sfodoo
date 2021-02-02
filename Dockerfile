FROM nginx:latest as main
#RUN rm  /etc/nginx/conf.d/default.conf
COPY conf/default.conf /etc/nginx/conf.d/

FROM main
RUN mkdir /usr/share/nginx/html/sfodo
COPY sfodo/. /usr/share/nginx/html/sfodo/