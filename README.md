# vue-admin-template

English | [简体中文](./README-zh.md)

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint

**Live demo:** http://panjiachen.github.io/vue-admin-template


**The current version is `v4.0+` build on `vue-cli`. If you want to use the old version , you can switch branch to [tag/3.11.0](https://github.com/PanJiaChen/vue-admin-template/tree/tag/3.11.0), it does not rely on `vue-cli`**

## Build Setup


```bash
# clone the project
git clone https://github.com/PanJiaChen/vue-admin-template.git

# enter the project directory
cd vue-admin-template

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

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