---
title: 批量删除 Docker 镜像
---

# 批量删除 Docker 镜像

## 删除所有未使用的镜像

```bash
docker images | awk 'NR!=1{print $1":"$2}' | xargs docker rmi
```

## 删除 none 标签的镜像

```bash
docker images | grep none | awk '{print $3}' | xargs docker rmi
```

## k8s 环境删除镜像

```bash
crictl images | grep none | awk '{print $3}' | xargs crictl rmi
```

## 清理所有缓存

```bash
# 清理所有未使用的资源（镜像、容器、网络、卷）
docker system prune --all

# 强制清理且不提示确认
docker system prune --all -f
```
