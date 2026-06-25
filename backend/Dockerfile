# 使用 Node.js 22 基础镜像（建议升级到 22，与前端保持一致）
FROM node:22-alpine AS builder

WORKDIR /app

# 复制依赖文件并安装
COPY package*.json ./
RUN npm ci

# 复制源码
COPY . .

# 编译 TypeScript（生成 dist 目录）
RUN npm run build

# ---------- 生产阶段 ----------
FROM node:22-alpine

WORKDIR /app

# 只复制生产依赖和编译后的文件
COPY package*.json ./
RUN npm ci --only=production

# 从构建阶段复制编译产物
COPY --from=builder /app/dist ./dist

# 复制 SQL 初始化文件到工作目录（server.ts 会自动读取）
COPY init-database.sql ./

# 暴露端口（根据实际端口修改）
EXPOSE 3000

# 运行编译后的入口文件（假设编译后为 dist/server.js）
CMD ["node", "dist/server.js"]