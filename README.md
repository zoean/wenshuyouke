## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

```
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