---
title: 容器管理
---

# 容器管理

Docker 容器的创建、运行、监控和管理。

## 容器生命周期

### 创建和运行容器

#### docker run - 运行容器
```bash
# 基本用法
docker run nginx

# 后台运行
docker run -d nginx

# 命名容器
docker run --name my-nginx -d nginx

# 端口映射
docker run -p 8080:80 nginx

# 环境变量
docker run -e NODE_ENV=production -e PORT=3000 node-app

# 挂载卷
docker run -v /host/path:/container/path nginx

# 交互式运行
docker run -it ubuntu bash

# 自动删除（容器停止后）
docker run --rm alpine echo "Hello"

# 限制资源
docker run --memory="512m" --cpus="1.5" nginx

# 完整示例
docker run -d \
  --name my-app \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -v $(pwd)/data:/app/data \
  --memory="512m" \
  --cpus="1.0" \
  my-node-app:latest
```

#### docker create - 创建容器（不启动）
```bash
# 创建容器
docker create --name my-container nginx

# 启动已创建的容器
docker start my-container
```

### 容器控制

#### 启动、停止、重启
```bash
# 启动容器
docker start container-name

# 启动并附加
docker start -a container-name

# 停止容器（优雅关闭）
docker stop container-name

# 强制停止
docker kill container-name

# 重启容器
docker restart container-name

# 暂停容器
docker pause container-name

# 恢复容器
docker unpause container-name
```

#### 删除容器
```bash
# 删除容器
docker rm container-name

# 强制删除运行中的容器
docker rm -f container-name

# 删除所有停止的容器
docker container prune

# 删除所有容器
docker rm $(docker ps -aq)

# 删除所有停止的容器（另一种方式）
docker ps -a | grep Exit | awk '{print $1}' | xargs docker rm
```

## 容器监控

### 查看容器

#### docker ps - 列出容器
```bash
# 列出运行中的容器
docker ps

# 列出所有容器
docker ps -a

# 仅显示容器 ID
docker ps -q

# 自定义格式
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"

# 过滤容器
docker ps -f "status=running"
docker ps -f "name=nginx"
docker ps -f "ancestor=nginx"
```

#### docker stats - 资源使用统计
```bash
# 实时统计所有容器
docker stats

# 统计特定容器
docker stats container-name

# 仅显示一次
docker stats --no-stream

# 自定义格式
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

#### docker top - 容器进程
```bash
# 查看容器内进程
docker top container-name

# 自定义格式
docker top container-name aux
```

### 日志管理

#### docker logs - 查看日志
```bash
# 查看日志
docker logs container-name

# 实时跟踪日志
docker logs -f container-name

# 显示最后 N 行
docker logs --tail 100 container-name

# 显示时间戳
docker logs -t container-name

# 显示最近时间的日志
docker logs --since 10m container-name
docker logs --since 2024-01-01 container-name

# 组合使用
docker logs -f --tail 50 --since 5m container-name
```

#### 日志驱动配置
```bash
# 使用 JSON 文件驱动（默认）
docker run --log-driver json-file --log-opt max-size=10m --log-opt max-file=3 nginx

# 使用 syslog
docker run --log-driver syslog nginx

# 禁用日志
docker run --log-driver none nginx
```

## 容器交互

### 进入容器

#### docker exec - 在运行容器中执行命令
```bash
# 执行单个命令
docker exec container-name ls -la

# 交互式 bash
docker exec -it container-name bash

# 以 root 用户执行
docker exec -u root -it container-name bash

# 设置工作目录
docker exec -w /app -it container-name bash

# 设置环境变量
docker exec -e MY_VAR=value container-name env
```

#### docker attach - 附加到容器
```bash
# 附加到容器的主进程
docker attach container-name

# 附加但不接管 stdin
docker attach --no-stdin container-name

# 退出时不停止容器：Ctrl+P, Ctrl+Q
```

### 文件操作

#### docker cp - 复制文件
```bash
# 从容器复制到主机
docker cp container-name:/path/in/container /path/on/host

# 从主机复制到容器
docker cp /path/on/host container-name:/path/in/container

# 复制目录
docker cp container-name:/app/logs ./logs

# 示例：备份容器数据
docker cp my-db:/var/lib/mysql ./backup
```

## 容器检查

### docker inspect - 详细信息
```bash
# 查看容器详细信息（JSON）
docker inspect container-name

# 查看特定字段
docker inspect --format='{{.State.Status}}' container-name
docker inspect --format='{{.NetworkSettings.IPAddress}}' container-name
docker inspect --format='{{json .Config.Env}}' container-name | jq

# 查看挂载点
docker inspect --format='{{json .Mounts}}' container-name | jq

# 查看端口映射
docker inspect --format='{{json .NetworkSettings.Ports}}' container-name | jq
```

### 常用检查命令
```bash
# 获取容器 IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container-name

# 获取容器环境变量
docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' container-name

# 获取容器挂载
docker inspect -f '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}' container-name

# 获取容器状态
docker inspect -f '{{.State.Running}}' container-name
```

## 网络管理

### 网络基础
```bash
# 列出网络
docker network ls

# 查看网络详情
docker network inspect bridge

# 创建网络
docker network create my-network

# 创建自定义子网
docker network create --subnet=172.18.0.0/16 my-network

# 删除网络
docker network rm my-network

# 清理未使用的网络
docker network prune
```

### 容器网络操作
```bash
# 在指定网络中运行容器
docker run -d --network my-network --name app1 nginx

# 连接容器到网络
docker network connect my-network container-name

# 断开容器网络
docker network disconnect my-network container-name

# 查看容器网络
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container-name
```

### 网络模式
```bash
# bridge 模式（默认）
docker run --network bridge nginx

# host 模式（使用主机网络）
docker run --network host nginx

# none 模式（无网络）
docker run --network none nginx

# container 模式（共享其他容器网络）
docker run --network container:container-name nginx
```

## 数据卷管理

### Volume 操作
```bash
# 创建卷
docker volume create my-volume

# 列出卷
docker volume ls

# 查看卷详情
docker volume inspect my-volume

# 删除卷
docker volume rm my-volume

# 清理未使用的卷
docker volume prune
```

### 使用卷
```bash
# 命名卷
docker run -v my-volume:/app/data nginx

# 匿名卷
docker run -v /app/data nginx

# 绑定挂载
docker run -v /host/path:/container/path nginx
docker run -v $(pwd):/app nginx

# 只读挂载
docker run -v my-volume:/app/data:ro nginx

# 查看容器卷
docker inspect -f '{{json .Mounts}}' container-name | jq
```

## 资源限制

### CPU 限制
```bash
# 限制 CPU 份额
docker run --cpu-shares 512 nginx

# 限制 CPU 核心数
docker run --cpus="1.5" nginx

# 绑定特定 CPU
docker run --cpuset-cpus="0,1" nginx
```

### 内存限制
```bash
# 限制内存
docker run --memory="512m" nginx

# 内存 + swap 限制
docker run --memory="512m" --memory-swap="1g" nginx

# 禁用 swap
docker run --memory="512m" --memory-swap="512m" nginx

# 内存预留
docker run --memory="512m" --memory-reservation="256m" nginx
```

### IO 限制
```bash
# 限制块设备读写速度（字节/秒）
docker run --device-read-bps /dev/sda:1mb nginx
docker run --device-write-bps /dev/sda:1mb nginx

# 限制块设备读写速率（IO/秒）
docker run --device-read-iops /dev/sda:1000 nginx
```

## 重启策略

```bash
# no - 不自动重启（默认）
docker run --restart no nginx

# always - 总是重启
docker run --restart always nginx

# on-failure - 失败时重启
docker run --restart on-failure nginx

# on-failure 带重试次数
docker run --restart on-failure:5 nginx

# unless-stopped - 除非手动停止
docker run --restart unless-stopped nginx

# 修改已存在容器的重启策略
docker update --restart unless-stopped container-name
```

## 实用技巧

### 批量操作
```bash
# 停止所有容器
docker stop $(docker ps -q)

# 删除所有容器
docker rm $(docker ps -aq)

# 删除所有退出的容器
docker rm $(docker ps -qf status=exited)

# 按镜像名删除容器
docker rm $(docker ps -aq --filter ancestor=nginx)
```

### 容器维护
```bash
# 查看容器变更
docker diff container-name

# 从容器创建镜像
docker commit container-name my-image:tag

# 导出容器
docker export container-name > container.tar

# 导入容器快照
cat container.tar | docker import - my-image:tag
```

### 监控脚本
```bash
#!/bin/bash
# monitor-containers.sh

# 检查容器健康状态
check_health() {
    containers=$(docker ps --format '{{.Names}}')
    for container in $containers; do
        status=$(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null)
        if [ "$status" == "unhealthy" ]; then
            echo "WARNING: $container is unhealthy"
            docker logs --tail 50 $container
        fi
    done
}

# 检查资源使用
check_resources() {
    docker stats --no-stream --format \
        "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
}

# 清理资源
cleanup() {
    echo "Cleaning up stopped containers..."
    docker container prune -f
    
    echo "Cleaning up unused volumes..."
    docker volume prune -f
    
    echo "Cleaning up unused networks..."
    docker network prune -f
}

# 执行检查
check_health
check_resources
```

### 调试技巧
```bash
# 查看容器启动命令
docker inspect --format='{{.Config.Cmd}}' container-name

# 查看容器入口点
docker inspect --format='{{.Config.Entrypoint}}' container-name

# 以特权模式运行（调试用）
docker run --privileged -it ubuntu bash

# 查看容器资源限制
docker inspect --format='{{.HostConfig.Memory}}' container-name
docker inspect --format='{{.HostConfig.NanoCpus}}' container-name

# 查看容器退出代码
docker inspect --format='{{.State.ExitCode}}' container-name
```
