---
title: conflict-resolution
---
# Git 冲突解决

## 理解合并冲突

### 冲突产生原因
```bash
# 当两个分支修改了同一文件的同一部分时会产生冲突
# 例如：
# - main 分支修改了 file.txt 的第10行
# - feature 分支也修改了 file.txt 的第10行
# - 合并时 Git 无法自动决定保留哪个版本
```

### 冲突标记说明
```bash
<<<<<<< HEAD
当前分支的内容
=======
要合并进来的分支的内容
>>>>>>> feature-branch
```

## 合并冲突解决

### 基本流程
```bash
# 1. 尝试合并
git checkout main
git merge feature-login
# Auto-merging file.txt
# CONFLICT (content): Merge conflict in file.txt
# Automatic merge failed; fix conflicts and then commit the result.

# 2. 查看冲突文件
git status
# Unmerged paths:
#   both modified:   file.txt

# 3. 编辑冲突文件
# 手动选择保留的内容，删除冲突标记

# 4. 标记为已解决
git add file.txt

# 5. 完成合并
git commit -m "Merge feature-login into main"

# 或放弃合并
git merge --abort
```

### 查看冲突详情
```bash
# 查看冲突文件列表
git diff --name-only --diff-filter=U

# 查看冲突的详细内容
git diff

# 查看三方对比（基础版本、当前分支、合并分支）
git diff --cc

# 查看某个文件的冲突
git diff file.txt
```

## 冲突解决策略

### 1. 手动解决
```bash
# 编辑冲突文件，保留需要的内容
# 删除冲突标记 <<<<<<<, =======, >>>>>>>

# 示例：原始冲突
<<<<<<< HEAD
function hello() {
    console.log('Hello from main');
}
=======
function hello() {
    console.log('Hello from feature');
}
>>>>>>> feature-branch

# 解决后（合并两者的更改）
function hello() {
    console.log('Hello from main and feature');
}
```

### 2. 选择某一方的版本
```bash
# 保留当前分支（ours）的版本
git checkout --ours file.txt
git add file.txt

# 保留合并分支（theirs）的版本
git checkout --theirs file.txt
git add file.txt

# 批量保留当前分支的所有文件
git checkout --ours .

# 批量保留合并分支的所有文件
git checkout --theirs .
```

### 3. 使用合并工具
```bash
# 启动默认合并工具
git mergetool

# 使用指定工具
git mergetool --tool=vimdiff
git mergetool --tool=meld
git mergetool --tool=kdiff3

# 配置默认合并工具
git config --global merge.tool vimdiff
git config --global merge.tool vscode

# 配置 VS Code 作为合并工具
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# 不创建备份文件
git config --global mergetool.keepBackup false
```

## Rebase 冲突解决

### 解决 Rebase 冲突
```bash
# 1. 执行 rebase
git checkout feature
git rebase main
# CONFLICT (content): Merge conflict in file.txt

# 2. 解决冲突
# 编辑冲突文件

# 3. 标记为已解决并继续
git add file.txt
git rebase --continue

# 或跳过此提交
git rebase --skip

# 或放弃 rebase
git rebase --abort
```

### 交互式 Rebase 冲突
```bash
# 启动交互式 rebase
git rebase -i HEAD~3

# 如果遇到冲突
# 1. 解决冲突
# 2. git add <冲突文件>
# 3. git rebase --continue
# 4. 重复直到完成
```

## Cherry-pick 冲突解决

```bash
# 1. 执行 cherry-pick
git cherry-pick abc123
# CONFLICT (content): Merge conflict in file.txt

# 2. 解决冲突
# 编辑冲突文件

# 3. 继续
git add file.txt
git cherry-pick --continue

# 或放弃
git cherry-pick --abort
```

## 预防冲突策略

### 1. 频繁同步
```bash
# 开发过程中经常从主分支拉取更新
git checkout feature
git fetch origin
git rebase origin/main

# 或使用 merge
git merge origin/main
```

### 2. 小步提交
```bash
# 提交粒度要小，功能单一
git add file1.txt
git commit -m "feat: add login validation"

git add file2.txt
git commit -m "feat: add login UI"

# 而不是
git add .
git commit -m "feat: add login feature"
```

### 3. 代码审查
```bash
# 使用 Pull Request 进行代码审查
# 在合并前解决潜在冲突
```

## 高级冲突处理

### 理解三方合并
```bash
# 查看合并基础版本
git show :1:file.txt > file.base.txt

# 查看当前分支版本
git show :2:file.txt > file.ours.txt

# 查看合并分支版本
git show :3:file.txt > file.theirs.txt

# 使用 diff3 格式
git config --global merge.conflictstyle diff3

# 冲突标记会变为：
<<<<<<< ours
当前分支的内容
||||||| base
基础版本的内容
=======
要合并的分支内容
>>>>>>> theirs
```

### 查看冲突历史
```bash
# 查看导致冲突的提交
git log --merge

# 查看冲突文件的修改历史
git log --oneline --all -- file.txt

# 对比两个分支的差异
git diff main...feature
```

### 撤销合并
```bash
# 如果已经提交了合并（但未推送）
git reset --hard HEAD~1

# 如果已经推送了合并
# 使用 revert（创建一个反向提交）
git revert -m 1 HEAD

# -m 1 表示保留主分支的内容
# -m 2 表示保留被合并分支的内容
```

## 冲突解决工具

### 命令行工具
```bash
# vimdiff
git mergetool --tool=vimdiff

# 快捷键：
# :diffget LO  # 获取 LOCAL (当前分支)
# :diffget BA  # 获取 BASE (基础版本)
# :diffget RE  # 获取 REMOTE (合并分支)
# :wqa         # 保存并退出
```

### GUI 工具推荐
```bash
# 1. VS Code
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# 2. Meld (跨平台)
git config --global merge.tool meld

# 3. KDiff3 (跨平台)
git config --global merge.tool kdiff3

# 4. P4Merge (免费)
git config --global merge.tool p4merge

# 5. Beyond Compare (商业软件)
git config --global merge.tool bc3
```

## 实用技巧

### 批量解决冲突
```bash
# 查看所有冲突文件
git diff --name-only --diff-filter=U

# 批量选择某一方的版本
git checkout --ours -- '*.txt'
git checkout --theirs -- '*.md'
git add .
git commit
```

### 自动化冲突解决
```bash
# 设置合并策略
# 遇到冲突时优先使用当前分支的版本
git merge -X ours feature-branch

# 遇到冲突时优先使用合并分支的版本
git merge -X theirs feature-branch

# Rebase 时使用
git rebase -X ours main
git rebase -X theirs main
```

### 冲突标记搜索
```bash
# 搜索项目中未解决的冲突标记
grep -r "<<<<<<< HEAD" .
grep -r "=======" .
grep -r ">>>>>>>" .

# 使用 git grep
git grep "<<<<<<< HEAD"
```

### 预防性检查
```bash
# 合并前预览
git merge --no-commit --no-ff feature-branch
git diff --cached
git merge --abort  # 如果不满意就放弃

# 查看即将合并的改动
git diff main...feature-branch
```

## 常见冲突场景

### 场景1：同一行不同修改
```bash
# main: console.log('Hello');
# feature: console.log('Hi');

# 解决：根据业务需求选择或合并
console.log('Hello and Hi');
```

### 场景2：文件被删除
```bash
# main 分支删除了 file.txt
# feature 分支修改了 file.txt

# 解决：
# 保留文件
git add file.txt

# 或确认删除
git rm file.txt
```

### 场景3：重命名冲突
```bash
# main: old.txt -> new.txt
# feature: old.txt -> renamed.txt

# Git 通常能自动处理，如果不行：
# 手动决定最终文件名
git mv new.txt final.txt
git add final.txt
```

### 场景4：二进制文件冲突
```bash
# 二进制文件（如图片）无法合并
# 必须选择某一方的版本

git checkout --ours image.png
# 或
git checkout --theirs image.png
```
