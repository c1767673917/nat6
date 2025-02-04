# Web备忘录系统

一个简单高效的个人备忘录系统，支持多用户、数据持久化存储。

## 主要功能

- 用户名快速登录
- 添加/编辑/删除备忘录
- 标记完成状态
- 实时数据保存
- 响应式设计，支持移动端

## 技术栈

- 前端：Vue 3 + Vite
- 后端：Node.js + Express
- 数据库：SQLite
- 部署：Docker + Nginx

## 快速部署

1. 克隆仓库
bash
git clone https://github.com/c1767673917/nat6.git
cd nat6

2. 运行安装脚本
bash
chmod +x scripts/install.sh
./scripts/install.sh

3. 根据提示输入您的域名

4. 确保您的域名已正确解析到服务器IP

5. 访问您的域名即可使用系统

## 常用命令
bash
查看运行状态
docker-compose ps
查看日志
docker-compose logs
重启服务
docker-compose restart
停止服务
docker-compose down

## 数据备份

数据库文件位置：`backend/data/memos.db`

## 注意事项

- 确保80端口未被占用
- 确保已正确配置域名解析
- 建议开启HTTPS以保护数据安全
