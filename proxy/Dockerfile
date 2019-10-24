FROM docker.io/nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /tmp/default.template
ARG VRP_BACKEND_URL
RUN envsubst < /tmp/default.template > /etc/nginx/conf.d/default.conf \
        && chmod -R 777 /var/log/nginx /var/cache/nginx/ \
        && chmod -R 777 /etc/nginx/
