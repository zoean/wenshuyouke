FROM docker-registry.wtipcc.com:5000/nginx
MAINTAINER mingmeijun@wtipcc.com
COPY default.conf /etc/nginx/conf.d/
COPY dist/ /usr/share/nginx/html/
