# 阶段一：构建阶段
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx vite build        # 执行构建命令，生成 dist 文件夹

# 阶段二：运行阶段
FROM nginx:stable-alpine
# 将构建好的 dist 文件夹内容，复制到 Nginx 的默认网站目录
COPY --from=builder /app/dist /usr/share/nginx/html
# 暴露 Nginx 默认的 80 端口
EXPOSE 80
# Nginx 会在启动时自动运行