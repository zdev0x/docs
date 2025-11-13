---
title: branching
---
# Git 分支管理

## 分支基础

### 查看分支
```bash
# 查看本地分支
git branch

# 查看所有分支（含远程）
git branch -a

# 查看远程分支
git branch -r

# 查看分支及最后一次提交
git branch -v

# 查看已合并的分支
git branch --merged

# 查看未合并的分支
git branch --no-merged
```

### 创建与切换分支
```bash
# 创建分支
git branch feature-login

# 切换分支
git checkout feature-login
git switch feature-login  # 推荐新命令

# 创建并切换
git checkout -b feature-login
git switch -c feature-login

# 基于远程分支创建本地分支
git checkout -b feature-login origin/feature-login
git switch -c feature-login origin/feature-login

# 基于指定提交创建分支
git branch feature-login abc123
git checkout -b feature-login abc123
```

### 重命名分支
```bash
# 重命名当前分支
git branch -m new-branch-name

# 重命名指定分支
git branch -m old-name new-name

# 重命名并推送到远程
git branch -m old-name new-name
git push origin :old-name new-name
git push origin -u new-name
```

### 删除分支
```bash
# 删除本地分支（已合并）
git branch -d feature-login

# 强制删除本地分支
git branch -D feature-login

# 删除远程分支
git push origin --delete feature-login
git push origin :feature-login

# 清理已删除的远程分支引用
git fetch --prune
git remote prune origin
```

## 分支合并

### Merge 合并
```bash
# 快进合并（Fast-forward）
git checkout main
git merge feature-login

# 禁用快进（保留分支历史）
git merge --no-ff feature-login

# 压缩合并（所有提交合并为一个）
git merge --squash feature-login
git commit -m "Add login feature"

# 终止合并
git merge --abort
```

### Rebase 变基
```bash
# 变基到 main
git checkout feature-login
git rebase main

# 交互式变基（整理最近3次提交）
git rebase -i HEAD~3

# 变基时的选项：
# pick   = 保留提交
# reword = 保留提交但修改提交信息
# edit   = 保留提交但暂停以便修改
# squash = 合并到前一个提交
# fixup  = 合并到前一个提交但丢弃提交信息
# drop   = 删除提交

# 继续变基
git rebase --continue

# 跳过当前提交
git rebase --skip

# 终止变基
git rebase --abort
```

### Merge vs Rebase 选择
```bash
# 功能分支开发时，同步主分支更新
git checkout feature-login
git rebase main  # 推荐：保持线性历史

# 合并功能分支到主分支
git checkout main
git merge --no-ff feature-login  # 推荐：保留分支历史

# 个人开发分支整理
git rebase -i HEAD~5  # 推荐：清理提交历史

# 公共分支
# ❌ 不要对已推送的公共分支执行 rebase
# ✅ 使用 merge
```

## Git Flow 工作流

### 分支类型
```bash
# 主分支
main (master)     # 生产环境代码
develop           # 开发主分支

# 辅助分支
feature/*         # 功能分支
release/*         # 发布分支
hotfix/*          # 紧急修复分支
```

### 功能开发流程
```bash
# 1. 从 develop 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# 2. 开发功能
git add .
git commit -m "feat: add user login"

# 3. 定期同步 develop 分支
git checkout develop
git pull origin develop
git checkout feature/user-authentication
git rebase develop

# 4. 功能完成，合并到 develop
git checkout develop
git merge --no-ff feature/user-authentication
git push origin develop

# 5. 删除功能分支
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

### 发布流程
```bash
# 1. 从 develop 创建发布分支
git checkout develop
git checkout -b release/v1.2.0

# 2. 在发布分支上做最后的调整
git commit -am "chore: update version to 1.2.0"

# 3. 合并到 main
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

# 4. 合并回 develop
git checkout develop
git merge --no-ff release/v1.2.0

# 5. 推送
git push origin main
git push origin develop
git push origin v1.2.0

# 6. 删除发布分支
git branch -d release/v1.2.0
```

### 紧急修复流程
```bash
# 1. 从 main 创建 hotfix 分支
git checkout main
git checkout -b hotfix/security-patch

# 2. 修复问题
git commit -am "fix: security vulnerability"

# 3. 合并到 main
git checkout main
git merge --no-ff hotfix/security-patch
git tag -a v1.2.1 -m "Hotfix version 1.2.1"

# 4. 合并到 develop
git checkout develop
git merge --no-ff hotfix/security-patch

# 5. 推送并删除
git push origin main
git push origin develop
git push origin v1.2.1
git branch -d hotfix/security-patch
```

## GitHub Flow 工作流

```bash
# 1. 从 main 创建功能分支
git checkout main
git pull origin main
git checkout -b add-payment-feature

# 2. 提交代码
git add .
git commit -m "feat: add payment integration"
git push origin add-payment-feature

# 3. 创建 Pull Request（在 GitHub 上）
# 4. Code Review
# 5. 合并 PR（在 GitHub 上）
# 6. 删除分支

# 本地更新
git checkout main
git pull origin main
git branch -d add-payment-feature
```

## 分支保护策略

### 保护主分支
```bash
# 在 GitHub/GitLab 上设置：
# Settings -> Branches -> Branch protection rules

# 推荐规则：
# ✅ Require pull request reviews before merging
# ✅ Require status checks to pass before merging
# ✅ Require branches to be up to date before merging
# ✅ Include administrators
# ✅ Restrict who can push to matching branches
```

## Cherry-pick

### 选择性合并提交
```bash
# 将指定提交应用到当前分支
git cherry-pick abc123

# 应用多个提交
git cherry-pick abc123 def456

# 应用提交范围（不包含起始）
git cherry-pick abc123..def456

# 应用提交范围（包含起始）
git cherry-pick abc123^..def456

# 仅应用但不提交
git cherry-pick -n abc123

# 冲突时继续
git cherry-pick --continue

# 终止 cherry-pick
git cherry-pick --abort
```

## 子模块管理

### 添加子模块
```bash
# 添加子模块
git submodule add https://github.com/user/repo.git libs/repo

# 查看子模块
git submodule status
```

### 克隆含子模块的仓库
```bash
# 方式1：克隆时同时初始化子模块
git clone --recursive https://github.com/user/project.git

# 方式2：克隆后初始化子模块
git clone https://github.com/user/project.git
cd project
git submodule init
git submodule update

# 或合并为一条命令
git submodule update --init --recursive
```

### 更新子模块
```bash
# 更新所有子模块到最新
git submodule update --remote

# 更新指定子模块
git submodule update --remote libs/repo

# 拉取主项目和所有子模块
git pull --recurse-submodules
```

### 删除子模块
```bash
# 1. 删除子模块条目
git submodule deinit -f libs/repo

# 2. 删除 .git/modules 中的子模块目录
rm -rf .git/modules/libs/repo

# 3. 删除工作区中的子模块目录
git rm -f libs/repo

# 4. 提交更改
git commit -m "Remove submodule libs/repo"
```

## 实用技巧

### 同步 Fork 仓库
```bash
# 1. 添加上游仓库
git remote add upstream https://github.com/original/repo.git

# 2. 获取上游更新
git fetch upstream

# 3. 合并到本地
git checkout main
git merge upstream/main

# 4. 推送到自己的远程仓库
git push origin main
```

### 批量操作分支
```bash
# 删除所有已合并的本地分支
git branch --merged | grep -v "\*" | grep -v "main" | xargs -n 1 git branch -d

# 删除所有 feature/ 开头的分支
git branch | grep "feature/" | xargs git branch -D

# 推送所有本地分支到远程
git push --all origin

# 推送所有标签
git push --tags origin
```
