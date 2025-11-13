---
title: Git 清除 Tag
---

# Git 清除 Tag

## 删除单个 tag

```bash
# 删除本地 tag
git tag -d <tag_name>

# 删除远程 tag
git push --delete origin <tag_name>
```

## 批量删除所有 tag

```bash
# 删除所有远程 tag
git tag -l | xargs -n 1 git push --delete origin

# 删除所有本地 tag
git tag -l | xargs git tag -d
```

## 删除匹配模式的 tag

```bash
# 删除以 v1. 开头的 tag
git tag -l "v1.*" | xargs git tag -d
git tag -l "v1.*" | xargs -n 1 git push --delete origin
```
