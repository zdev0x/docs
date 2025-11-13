---
title: Dockerfile
---

# Dockerfile

Dockerfile 是用于构建 Docker 镜像的文本文件，包含一系列指令和参数。

## 基础指令

### FROM - 基础镜像
```dockerfile
# 使用官方镜像
FROM node:18

# 使用特定版本
FROM node:18.17.0

# 使用 Alpine Linux（更小）
FROM node:18-alpine

# 多阶段构建的基础
FROM node:18 AS builder
```

### WORKDIR - 工作目录
```dockerfile
# 设置工作目录（自动创建）
WORKDIR /app

# 后续的 RUN、CMD、COPY 等都在此目录执行
```

### COPY 和 ADD
```dockerfile
# COPY - 复制文件（推荐）
COPY package.json package-lock.json ./
COPY src/ ./src/
COPY . .

# ADD - 功能更多（自动解压、支持 URL）
ADD archive.tar.gz /app/
ADD https://example.com/file.txt /app/

# 最佳实践：优先使用 COPY
```

### RUN - 执行命令
```dockerfile
# Shell 形式
RUN npm install

# Exec 形式（推荐）
RUN ["npm", "install"]

# 合并命令减少层数
RUN apt-get update && \
    apt-get install -y curl git && \
    rm -rf /var/lib/apt/lists/*

# 使用 && 和 \ 提高可读性
RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
        vim && \
    rm -rf /var/lib/apt/lists/*
```

### ENV - 环境变量
```dockerfile
# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 多个变量
ENV NODE_ENV=production \
    PORT=3000 \
    API_URL=https://api.example.com
```

### EXPOSE - 暴露端口
```dockerfile
# 声明容器监听的端口
EXPOSE 3000

# 多个端口
EXPOSE 3000 8080
```

### CMD 和 ENTRYPOINT

#### CMD - 容器启动命令
```dockerfile
# Shell 形式
CMD npm start

# Exec 形式（推荐）
CMD ["npm", "start"]

# 作为 ENTRYPOINT 的参数
CMD ["--port", "3000"]
```

#### ENTRYPOINT - 入口点
```dockerfile
# 固定的可执行文件
ENTRYPOINT ["node"]

# 配合 CMD 使用
ENTRYPOINT ["node"]
CMD ["server.js"]

# 使用脚本作为入口点
ENTRYPOINT ["./docker-entrypoint.sh"]
```

#### CMD vs ENTRYPOINT
```dockerfile
# CMD：可被 docker run 命令行参数覆盖
CMD ["node", "server.js"]
# docker run myimage node app.js  # 覆盖 CMD

# ENTRYPOINT：不会被覆盖，命令行参数会追加
ENTRYPOINT ["node"]
CMD ["server.js"]
# docker run myimage app.js  # 变成 node app.js

# 最佳实践：结合使用
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
```

## 实战示例

### Node.js 应用
```dockerfile
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动命令
CMD ["node", "server.js"]
```

### Python 应用
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

### Go 应用
```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 复制 go mod 文件
COPY go.mod go.sum ./
RUN go mod download

# 复制源代码
COPY . .

# 编译
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 运行阶段
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
```

## 多阶段构建

### 基本概念
```dockerfile
# 第一阶段：构建
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 第二阶段：运行
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### React 应用多阶段构建
```dockerfile
# 构建阶段
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 带测试的多阶段构建
```dockerfile
# 依赖阶段
FROM node:18 AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# 测试阶段
FROM dependencies AS test
COPY . .
RUN npm test

# 构建阶段
FROM dependencies AS build
COPY . .
RUN npm run build

# 生产阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["node", "dist/server.js"]
```

## 优化技巧

### 1. 利用缓存层
```dockerfile
# ❌ 不好：每次代码改动都要重新安装依赖
FROM node:18
WORKDIR /app
COPY . .
RUN npm install

# ✅ 好：依赖不变时使用缓存
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
```

### 2. 减少层数
```dockerfile
# ❌ 不好：多个 RUN 创建多个层
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN rm -rf /var/lib/apt/lists/*

# ✅ 好：合并命令
RUN apt-get update && \
    apt-get install -y curl git && \
    rm -rf /var/lib/apt/lists/*
```

### 3. 使用 .dockerignore
```bash
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
dist
build
coverage
*.md
.vscode
.idea
```

### 4. 选择合适的基础镜像
```dockerfile
# 标准镜像：~900MB
FROM node:18

# Slim 镜像：~200MB
FROM node:18-slim

# Alpine 镜像：~100MB
FROM node:18-alpine

# 最佳实践：
# 开发：使用标准镜像（工具齐全）
# 生产：使用 alpine（体积小）
```

### 5. 使用特定版本
```dockerfile
# ❌ 不好：使用 latest 标签
FROM node:latest

# ✅ 好：使用具体版本
FROM node:18.17.0-alpine

# ✅ 更好：使用 SHA256
FROM node:18@sha256:abc123...
```

### 6. 非 root 用户运行
```dockerfile
FROM node:18-alpine

# 创建用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY --chown=nodejs:nodejs package*.json ./
RUN npm ci --only=production

COPY --chown=nodejs:nodejs . .

# 切换用户
USER nodejs

EXPOSE 3000
CMD ["node", "server.js"]
```

### 7. 健康检查
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "server.js"]
```

### 8. 构建参数
```dockerfile
# 使用构建参数
ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.version=$VERSION

# 构建时传参
# docker build \
#   --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
#   --build-arg VCS_REF=$(git rev-parse --short HEAD) \
#   --build-arg VERSION=1.0.0 \
#   -t myapp:latest .
```

## 高级技巧

### 使用构建缓存
```dockerfile
# 使用 BuildKit 特性
# docker build --build-arg BUILDKIT_INLINE_CACHE=1 .

FROM node:18 AS base
WORKDIR /app

FROM base AS dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["node", "dist/server.js"]
```

### Secret 管理
```dockerfile
# 使用 BuildKit secrets
FROM alpine

# 构建时挂载 secret
RUN --mount=type=secret,id=mysecret \
    cat /run/secrets/mysecret

# 构建命令
# docker build --secret id=mysecret,src=mysecret.txt .
```

### 镜像元数据
```dockerfile
FROM node:18-alpine

LABEL maintainer="your-email@example.com" \
      version="1.0.0" \
      description="My awesome app" \
      org.opencontainers.image.source="https://github.com/user/repo"

# ...
```

## 常用模式

### 开发与生产分离
```dockerfile
# Dockerfile.dev
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Dockerfile.prod
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```

### 动态入口点脚本
```bash
# docker-entrypoint.sh
#!/bin/sh
set -e

# 等待数据库
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done

echo "Database is up - executing command"
exec "$@"
```

```dockerfile
FROM node:18-alpine
WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY . .

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
```
