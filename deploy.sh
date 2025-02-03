#!/bin/bash

# 设置项目目录
PROJECT_DIR="/var/www/memo-app"
REPO_URL="https://YOUR_TOKEN@github.com/c1767673917/nat6.git"

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "创建项目目录..."
    sudo mkdir -p $PROJECT_DIR
    sudo chown -R $USER:$USER $PROJECT_DIR
    # 首次克隆项目
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
else
    cd $PROJECT_DIR
    # 拉取最新代码
    git pull origin main
fi

# 安装依赖
echo "安装依赖..."
npm install

# 构建前端
echo "构建前端..."
npm run build

# 确保dist目录存在
if [ ! -d "$PROJECT_DIR/dist" ]; then
    echo "错误: 构建失败，dist 目录不存在"
    exit 1
fi

# 设置权限
sudo chown -R www-data:www-data $PROJECT_DIR/dist

# 启动后端服务（使用 PM2）
if pm2 list | grep -q "memo-app"; then
    echo "重启服务..."
    pm2 restart memo-app
else
    echo "首次启动服务..."
    pm2 start server/index.js --name memo-app
fi

# 重启 Nginx
echo "重启 Nginx..."
sudo systemctl restart nginx

echo "部署完成!" 