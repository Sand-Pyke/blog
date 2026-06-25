# 使用官方 Node.js 镜像作为基础
FROM node:18-alpine

# 在容器内创建工作目录
WORKDIR /app

# 先拷贝 package.json 和 package-lock.json (为了利用缓存)
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 拷贝所有后端源码
COPY . .

# 暴露后端服务端口 (比如 3000)
EXPOSE 3000

# 启动后端服务
CMD ["node", "src/index.js"]