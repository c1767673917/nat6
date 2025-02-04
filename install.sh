#!/bin/bash

# 更新系统
apt update && apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs

# 安装 nginx
apt install -y nginx

# 克隆项目
git clone https://github.com/c1767673917/nat6.git
cd nat6

# 安装依赖并构建
bash deploy.sh

# 配置 nginx
cp nginx.conf /etc/nginx/sites-available/memo-app
ln -s /etc/nginx/sites-available/memo-app /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "Installation complete! Your app should be running at http://m.loux.us.kg" 