---
title: Ubuntu 换源
---

# Ubuntu 换源

## 一键换清华源

```bash
sudo sed -i 's@/archive.ubuntu.com/@/mirrors.tuna.tsinghua.edu.cn/@g' /etc/apt/sources.list
sudo sed -i 's@/security.ubuntu.com/@/mirrors.tuna.tsinghua.edu.cn/@g' /etc/apt/sources.list
sudo apt update
```

## 一键换阿里源

```bash
sudo sed -i 's@/archive.ubuntu.com/@/mirrors.aliyun.com/@g' /etc/apt/sources.list
sudo sed -i 's@/security.ubuntu.com/@/mirrors.aliyun.com/@g' /etc/apt/sources.list
sudo apt update
```

## 一键换中科大源

```bash
sudo sed -i 's@/archive.ubuntu.com/@/mirrors.ustc.edu.cn/@g' /etc/apt/sources.list
sudo sed -i 's@/security.ubuntu.com/@/mirrors.ustc.edu.cn/@g' /etc/apt/sources.list
sudo apt update
```
