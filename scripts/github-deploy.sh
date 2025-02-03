#!/bin/bash

# 配置 Git
git config --global user.email "你的邮箱"
git config --global user.name "c1767673917"

# 克隆仓库
git clone https://c1767673917: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@github.com/c1767673917/nat6.git
cd nat6

# 创建新分支
git checkout -b memo-app

# 复制所有文件
cp -r ../frontend ./
cp -r ../backend ./
cp -r ../docker ./
cp -r ../scripts ./
cp ../docker-compose.yml ./
cp ../nginx.conf ./

# 提交更改
git add .
git commit -m "添加备忘录应用"

# 推送到 GitHub
git push origin memo-app

echo "代码已成功推送到 GitHub！" 