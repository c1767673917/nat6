#!/bin/bash

# 拉取最新代码
git pull

# 安装依赖
npm install

# 构建前端
npm run build

# 重启服务
pm2 restart memo-app 