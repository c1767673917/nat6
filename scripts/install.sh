#!/bin/bash

echo "开始安装Web备忘录系统..."

# 创建必要的目录
mkdir -p backend/data
mkdir -p frontend/dist

# 安装Docker和Docker Compose
if ! command -v docker &> /dev/null; then
    echo "正在安装Docker..."
    curl -fsSL https://get.docker.com | sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo "正在安装Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 创建docker-compose.yml
cat > docker-compose.yml << 'EOL'
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    volumes:
      - ./backend/data:/app/data
    restart: always

networks:
  default:
    driver: bridge
EOL

# 给安装脚本添加执行权限
chmod +x scripts/install.sh

# 构建和启动容器
docker-compose up -d --build

echo "安装完成！"
echo "系统已经在后台运行，请访问 http://m.loux.us.kg 使用系统" 