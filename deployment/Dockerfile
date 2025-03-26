# 使用輕量級的 Node.js 基礎映像進行構建
FROM node:20-alpine AS builder

# 設置工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 設置環境變數以安裝生產依賴
ENV NODE_ENV=production

# 安裝生產依賴
RUN npm install --only=production

# 安裝 nodemon
RUN npm install -g nodemon

# 複製應用程式代碼
COPY . .

# 使用更小的基礎映像來運行應用程式
FROM node:20-alpine

# 安裝 bash
RUN apk add --no-cache bash

# 設置工作目錄
WORKDIR /usr/src/app

# 從 builder 階段複製必要的文件
COPY --from=builder /usr/src/app /usr/src/app

# 暴露應用程式埠
EXPOSE 3000

# 修改 CMD 指令以使用 node 而不是 nodemon 啟動應用程式
CMD ["node", "dist/main.js"]