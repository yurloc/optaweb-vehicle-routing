FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /tmp/default.template
ARG VRP_BACKEND_URL
RUN envsubst < /tmp/default.template > /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html
