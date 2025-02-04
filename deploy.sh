#!/bin/bash

# 安装依赖
echo "Installing dependencies..."
npm install

# 构建前端
echo "Building frontend..."
npm run build

# 安装PM2
echo "Installing PM2..."
npm install -g pm2

# 启动服务器
echo "Starting server..."
pm2 start server/index.js --name memo-app

# 设置开机自启
echo "Setting up startup script..."
pm2 startup
pm2 save

echo "Deployment complete!" 