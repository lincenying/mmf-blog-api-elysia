# mmf-blog-api-elysia

## 如何使用

install bun, MongoDB, And start the

```bash
# Install dependencies
bun install

# Start the API server
bun dev

# Build the API server
bun build
NODE_ENV=production bun ./dist/index.js

# Build the API server with compile
# mac
bun build:compile:mac
NODE_ENV=production ./server-mac

# linux
bun build:compile:linux
NODE_ENV=production ./server-linux
```

Add admin
http://localhost:4000/backend

管理员添加成功后，会自动生成admin.Lock文件锁定，如需继续添加，请直接删除该文件

After the success of the administrator to add, will automatically generate the admin. Lock file locking, if you need to continue to add, please just delete the file

## 注意mongoose的版本

| MongoDB Server | Mongoose                                          |
| -------------- | ------------------------------------------------- |
| 8.x            | ^8.7.0 &vert; ^9.0.0                              |
| 7.x            | ^7.4.0 &vert; ^8.0.0 &vert; ^9.0.0                |
| 6.x            | ^7.0.0 &vert; ^8.0.0 &vert; ^9.0.0                |
| 5.x            | ^6.0.0 &vert; ^7.0.0 &vert; ^8.0.0                |
| 4.4.x          | ^6.0.0 &vert; ^7.0.0 &vert; ^8.0.0                |
| 4.2.x          | ^6.0.0 &vert; ^7.0.0 &vert; ^8.0.0                |
| 4.0.x          | ^6.0.0 &vert; ^7.0.0 &vert; ^8.0.0 <8.16.0        |
| 3.6.x          | ^6.0.0 &vert; ^7.0.0 &vert; ^8.0.0 <8.8.0         |

自行根据系统MongoDB的版本, 安装对应mongoose版本

## docker

如果宿主机起`mongodb`服务, 可以直接使用下面命令构建启动容器,
如果要将`mongodb`也容器化, 可以直接使用`docker-compose`

`mongodb`连接地址配置见`Dockerfile`的`ENV MONGO_URI=mongodb://host.docker.internal:27017`

```bash
# 第一次执行时, 如果相关镜像拉不下来, 可以执行以下命令:
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/oven/bun:1.3.11
docker tag swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/oven/bun:1.3.11 oven/bun:1.3
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/gcr.io/distroless/base-debian13:latest
docker tag swr.cn-north-4.myhuaweicloud.com/ddn-k8s/gcr.io/distroless/base-debian13:latest gcr.io/distroless/base:latest
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/mongo:7.0.31
docker tag swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/mongo:7.0.31 mongo:7
# 构建镜像
docker build -t lincenying/bun-api-server:1.26.0319 -f ./Dockerfile .
# 运行镜像
docker run -d \
-p 4080:4080 \
--name container-bun-api-server \
lincenying/bun-api-server:1.26.0319
# 进入容器
docker exec -it container-bun-api-server /bin/bash
# 停止容器
docker stop container-bun-api-server
# 删除容器
docker rm container-bun-api-server
# 删除镜像
docker rmi images-bun-api-server
```

## docker-compose

修改`docker-compose.yml`中的`mongo.volumes`配置, 将宿主机数据库路径映射到容器中

```yaml
volumes:
  - /Users/lincenying/web/mongodb7/data:/data/db
```

```bash
# 生成镜像及启动容器
docker-compose build
docker-compose up -d
```
