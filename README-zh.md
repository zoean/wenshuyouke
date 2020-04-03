#UK-admin

docker rm -f  $(docker ps -a | grep "marketing-web" | awk '{print $1 }') && docker rmi  $(docker images | grep "marketing-web" | awk '{print $1 }') 
```

## Build docker images
```
docker build -t  docker-registry.wtipcc.com:5000/marketing-web .
```
## Push images in remote registry

```
docker push docker-registry.wtipcc.com:5000/marketing-web
```

## Run in docker 
```
 docker run -p 8080:80 -d --name marketing-web  docker-registry.wtipcc.com:5000/marketing-web
```