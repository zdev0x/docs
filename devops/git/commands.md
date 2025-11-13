---
title: commands
---
# Git 常用命令

## 基础操作

### 初始化与克隆
```bash
# 初始化仓库
git init

# 克隆远程仓库
git clone <url>
git clone <url> <directory-name>

# 克隆指定分支
git clone -b <branch-name> <url>
```

### 查看状态
```bash
# 查看工作区状态
git status

# 简洁输出
git status -s

# 查看提交历史
git log
git log --oneline
git log --graph --all --decorate
```

### 添加与提交
```bash
# 添加文件到暂存区
git add <file>
git add .
git add -A

# 提交
git commit -m "commit message"

# 添加并提交
git commit -am "commit message"

# 修改最后一次提交
git commit --amend
git commit --amend -m "new message"
```

## 分支操作

```bash
# 查看分支
git branch
git branch -a  # 查看所有分支（包括远程）
git branch -r  # 仅查看远程分支

# 创建分支
git branch <branch-name>

# 切换分支
git checkout <branch-name>
git switch <branch-name>  # 新命令

# 创建并切换
git checkout -b <branch-name>
git switch -c <branch-name>

# 删除分支
git branch -d <branch-name>  # 安全删除
git branch -D <branch-name>  # 强制删除

# 重命名分支
git branch -m <old-name> <new-name>
```

## 远程操作

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin <url>

# 拉取
git pull
git pull origin main

# 推送
git push
git push origin main
git push -u origin main  # 设置上游分支

# 强制推送（谨慎使用）
git push -f

# 删除远程分支
git push origin --delete <branch-name>
```

## 撤销操作

```bash
# 撤销工作区修改
git checkout -- <file>
git restore <file>  # 新命令

# 撤销暂存区
git reset HEAD <file>
git restore --staged <file>  # 新命令

# 回退提交
git reset --soft HEAD~1   # 保留修改，撤销提交
git reset --mixed HEAD~1  # 保留工作区，撤销提交和暂存
git reset --hard HEAD~1   # 完全撤销（危险）

# 撤销指定提交（生成新提交）
git revert <commit-hash>
```

## 储藏 (Stash)

```bash
# 储藏当前修改
git stash
git stash save "message"

# 查看储藏列表
git stash list

# 应用储藏
git stash apply
git stash apply stash@{0}

# 应用并删除
git stash pop

# 删除储藏
git stash drop stash@{0}
git stash clear  # 清空所有
```

## 合并与变基

```bash
# 合并分支
git merge <branch-name>
git merge --no-ff <branch-name>  # 禁用快进

# 变基
git rebase <branch-name>
git rebase -i HEAD~3  # 交互式变基

# 终止合并/变基
git merge --abort
git rebase --abort

# 继续合并/变基
git merge --continue
git rebase --continue
```

## 标签

```bash
# 创建标签
git tag v1.0.0
git tag -a v1.0.0 -m "version 1.0.0"

# 查看标签
git tag
git show v1.0.0

# 推送标签
git push origin v1.0.0
git push origin --tags  # 推送所有标签

# 删除标签
git tag -d v1.0.0
git push origin --delete v1.0.0
```

## 实用技巧

### 查看文件修改
```bash
# 查看未暂存的修改
git diff

# 查看已暂存的修改
git diff --staged
git diff --cached

# 查看两个提交之间的差异
git diff commit1 commit2
```

### 搜索与过滤
```bash
# 搜索提交信息
git log --grep="keyword"

# 搜索代码
git log -S"function_name"

# 查看某人的提交
git log --author="name"

# 查看某段时间的提交
git log --since="2 weeks ago"
git log --after="2024-01-01" --before="2024-12-31"
```

### 清理与优化
```bash
# 清理未跟踪文件
git clean -n  # 预览
git clean -f  # 删除文件
git clean -fd # 删除文件和目录

# 垃圾回收
git gc

# 压缩仓库
git gc --aggressive
```
