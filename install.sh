#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}开始安装部署脚本...${NC}"

# 检查是否安装了必要的软件
check_requirements() {
    command -v git >/dev/null 2>&1 || { echo "需要安装 git"; apt-get update && apt-get install -y git; }
    command -v docker >/dev/null 2>&1 || {
        echo "安装 Docker..."
        curl -fsSL https://get.docker.com | sh
        systemctl start docker
        systemctl enable docker
    }
    command -v docker-compose >/dev/null 2>&1 || {
        echo "安装 Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    }
}

# 主安装流程
main() {
    check_requirements
    
    # 下载所需文件
    echo -e "${GREEN}下载配置文件...${NC}"
    wget https://raw.githubusercontent.com/c1767673917/nat6/master/docker-compose.yml
    wget https://raw.githubusercontent.com/c1767673917/nat6/master/init-letsencrypt.sh
    chmod +x init-letsencrypt.sh

    # 创建必要的目录和文件
    mkdir -p data/nginx
    mkdir -p data/certbot
    
    # 下载 Nginx 配置
    mkdir -p data/nginx
    wget -O data/nginx/app.conf https://raw.githubusercontent.com/c1767673917/nat6/master/data/nginx/app.conf

    # 启动服务
    echo -e "${GREEN}启动服务...${NC}"
    docker-compose up -d

    echo -e "${GREEN}安装完成!${NC}"
    echo "请运行 ./init-letsencrypt.sh 来配置 SSL 证书"
    echo "完成后您的网站将部署在 https://m.loux.us.kg"
}

main 