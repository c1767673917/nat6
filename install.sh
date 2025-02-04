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
    
    # 克隆项目
    echo -e "${GREEN}克隆项目代码...${NC}"
    git clone https://github.com/c1767673917/nat6.git
    cd nat6

    # 创建必要的目录
    mkdir -p data/nginx
    mkdir -p data/certbot

    # 启动服务
    echo -e "${GREEN}启动服务...${NC}"
    docker-compose up -d

    echo -e "${GREEN}安装完成!${NC}"
    echo "您的网站已经部署在 https://m.loux.us.kg"
}

main 