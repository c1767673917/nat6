FROM node:16-alpine as builder

WORKDIR /app

# 首先只复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 然后复制其他源代码文件
COPY . .

# 创建必要的目录和文件
RUN mkdir -p src && \
    mkdir -p public

# 执行构建
RUN npm run build

# 使用nginx来服务静态文件
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80 