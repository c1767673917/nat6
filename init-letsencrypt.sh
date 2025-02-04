#!/bin/bash

domains=(m.loux.us.kg)
rsa_key_size=4096
data_path="./data/certbot"
email="your-email@example.com" # 改成你的邮箱

if [ -d "$data_path" ]; then
  read -p "现有数据将被清除。是否继续? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

mkdir -p "$data_path/conf/live/$domains"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$data_path/conf/live/$domains/privkey.pem' \
    -out '$data_path/conf/live/$domains/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "### 创建 docker 网络"
docker network create nginx-proxy-network || true

echo "### 启动 nginx"
docker-compose up --force-recreate -d nginx

echo "### 删除虚拟证书并申请 Let's Encrypt 证书"
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot

echo "### 申请 SSL 证书"
docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $email \
    -d $domains \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot

echo "### 重启 nginx"
docker-compose exec nginx nginx -s reload 