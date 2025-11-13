---
title: Docker Compose
---

# Docker Compose

Docker Compose 是用于定义和运行多容器 Docker 应用的工具。

## 基础概念

### docker-compose.yml 结构
```yaml
version: '3.8'

services:
  # 服务定义
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    
  app:
    build: .
    depends_on:
      - db
    
  db:
    image: postgres:15

volumes:
  # 卷定义
  db-data:

networks:
  # 网络定义
  frontend:
  backend:
```

## 服务配置

### 基本配置
```yaml
services:
  web:
    # 使用镜像
    image: nginx:alpine
    
    # 或者构建镜像
    build: ./web
    
    # 容器名
    container_name: my-web
    
    # 端口映射
    ports:
      - "8080:80"
      - "443:443"
    
    # 环境变量
    environment:
      - NODE_ENV=production
      - API_URL=http://api:3000
    
    # 从文件读取环境变量
    env_file:
      - .env
      - .env.production
    
    # 依赖关系
    depends_on:
      - db
      - redis
    
    # 重启策略
    restart: unless-stopped
```

### 构建配置
```yaml
services:
  app:
    build:
      # 构建上下文
      context: ./app
      
      # Dockerfile 路径
      dockerfile: Dockerfile.prod
      
      # 构建参数
      args:
        - NODE_VERSION=18
        - BUILD_DATE=2024-01-01
      
      # 目标阶段（多阶段构建）
      target: production
      
      # 缓存配置
      cache_from:
        - myapp:latest
```

### 卷挂载
```yaml
services:
  app:
    volumes:
      # 命名卷
      - db-data:/var/lib/mysql
      
      # 绑定挂载
      - ./app:/app
      - ./config:/etc/app/config
      
      # 只读挂载
      - ./certs:/etc/ssl/certs:ro
      
      # 临时文件系统
      - type: tmpfs
        target: /tmp

volumes:
  db-data:
    driver: local
```

### 网络配置
```yaml
services:
  web:
    networks:
      - frontend
      
  app:
    networks:
      - frontend
      - backend
      
  db:
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # 不可访问外网
```

## 实战示例

### Node.js + MongoDB
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGO_URL=mongodb://db:27017/myapp
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: mongo:7
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=secret
    volumes:
      - mongo-data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d:ro
    restart: unless-stopped
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge
```

### Nginx + PHP + MySQL
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./app:/var/www/html
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - php
    networks:
      - frontend
    restart: unless-stopped

  php:
    build:
      context: ./php
      dockerfile: Dockerfile
    volumes:
      - ./app:/var/www/html
      - ./php/php.ini:/usr/local/etc/php/php.ini:ro
    networks:
      - frontend
      - backend
    restart: unless-stopped

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: myapp
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppassword
    volumes:
      - mysql-data:/var/lib/mysql
      - ./mysql/init:/docker-entrypoint-initdb.d:ro
    networks:
      - backend
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password

volumes:
  mysql-data:

networks:
  frontend:
  backend:
```

### React + API + PostgreSQL + Redis
```yaml
version: '3.8'

services:
  # 前端
  frontend:
    build:
      context: ./frontend
      target: production
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - frontend
    restart: unless-stopped

  # API 服务
  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis
    volumes:
      - ./api/uploads:/app/uploads
    networks:
      - frontend
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  # 数据库
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # 缓存
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  postgres-data:
  redis-data:

networks:
  frontend:
  backend:
```

## 常用命令

### 基础命令
```bash
# 启动服务
docker-compose up

# 后台启动
docker-compose up -d

# 指定文件
docker-compose -f docker-compose.prod.yml up -d

# 构建并启动
docker-compose up --build

# 仅构建
docker-compose build

# 重新构建（不使用缓存）
docker-compose build --no-cache

# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down

# 删除容器和卷
docker-compose down -v

# 删除容器、卷和镜像
docker-compose down -v --rmi all
```

### 服务管理
```bash
# 查看服务状态
docker-compose ps

# 查看详细状态
docker-compose ps -a

# 启动特定服务
docker-compose start web

# 停止特定服务
docker-compose stop web

# 重启服务
docker-compose restart web

# 暂停服务
docker-compose pause web

# 恢复服务
docker-compose unpause web

# 删除服务
docker-compose rm web
```

### 日志管理
```bash
# 查看所有日志
docker-compose logs

# 跟踪日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs web

# 显示最后 N 行
docker-compose logs --tail=100

# 显示时间戳
docker-compose logs -t
```

### 执行命令
```bash
# 在服务中执行命令
docker-compose exec web sh

# 以 root 用户执行
docker-compose exec -u root web sh

# 运行一次性命令
docker-compose run --rm web npm install

# 不启动依赖服务
docker-compose run --no-deps web npm test
```

### 扩展服务
```bash
# 扩展服务实例数
docker-compose up -d --scale web=3

# 查看扩展的服务
docker-compose ps
```

## 高级配置

### 环境变量
```yaml
# docker-compose.yml
services:
  app:
    environment:
      # 直接定义
      - NODE_ENV=production
      
      # 从 shell 传递
      - API_KEY=${API_KEY}
      
      # 带默认值
      - PORT=${PORT:-3000}
    
    env_file:
      - .env
      - .env.production
```

```bash
# .env
NODE_ENV=production
DATABASE_URL=postgresql://localhost/myapp
JWT_SECRET=your-secret-key
```

### 健康检查
```yaml
services:
  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 依赖控制
```yaml
services:
  web:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
```

### 资源限制
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### 配置文件
```yaml
services:
  app:
    configs:
      - source: app_config
        target: /etc/app/config.yml
        mode: 0440

configs:
  app_config:
    file: ./config/app.yml
```

### Secrets 管理
```yaml
services:
  app:
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true
```

## 多文件配置

### 基础配置 + 环境覆盖
```yaml
# docker-compose.yml (基础)
services:
  app:
    build: .
    ports:
      - "3000:3000"
```

```yaml
# docker-compose.override.yml (开发覆盖)
services:
  app:
    volumes:
      - ./src:/app/src
    environment:
      - DEBUG=true
```

```yaml
# docker-compose.prod.yml (生产覆盖)
services:
  app:
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

```bash
# 使用多个文件
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 实用技巧

### 开发环境配置
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      target: development
    volumes:
      - ./src:/app/src  # 热重载
      - /app/node_modules  # 排除 node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
    ports:
      - "3000:3000"
      - "9229:9229"  # 调试端口
```

### 等待服务就绪
```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy
    # 或使用等待脚本
    command: >
      sh -c "
        ./wait-for-it.sh db:5432 -- 
        npm start
      "
```

### 备份与恢复
```bash
# 备份数据库
docker-compose exec db pg_dump -U user myapp > backup.sql

# 恢复数据库
docker-compose exec -T db psql -U user myapp < backup.sql

# 备份卷
docker run --rm \
  -v myapp_postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/data-backup.tar.gz /data
```

### 清理命令
```bash
# 停止并删除所有
docker-compose down

# 删除卷
docker-compose down -v

# 删除镜像
docker-compose down --rmi all

# 完全清理
docker-compose down -v --rmi all --remove-orphans
```
