---
title: Docker 换源
---

# Docker 换源

## 阿里云镜像加速

先去[阿里云容器镜像服务](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)获取自己的镜像加速地址

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://xxxxxx.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 其他镜像源

```bash
# 使用中科大镜像
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}

# 使用网易镜像
{
  "registry-mirrors": ["http://hub-mirror.c.163.com"]
}
```
