---
title: Systemd 服务配置
---

# Systemd 服务配置

## 基础服务模板

```ini
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/app
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## 定时器配置

### 服务文件 (mytimer.service)

```ini
[Unit]
Description=My Timer Task

[Service]
Type=oneshot
ExecStart=/bin/bash /path/to/script.sh
```

### 定时器文件 (mytimer.timer)

```ini
[Unit]
Description=Run mytimer every hour

[Timer]
OnUnitActiveSec=1h
Unit=mytimer.service

[Install]
WantedBy=timers.target
```

## 常用命令

```bash
# 重新加载配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start myapp.service

# 开机自启
sudo systemctl enable myapp.service

# 查看状态
sudo systemctl status myapp.service

# 查看日志
sudo journalctl -u myapp.service -f
```
