FROM node:20

# 建立應用程式目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json 以獲取依賴
COPY package*.json ./

# 安裝依賴項
RUN npm install

# 安裝 nodemon 來監聽檔案變更
RUN npm install -g nodemon

# 複製整個專案
COPY . .

# 確保 entrypoint.sh 有正確的權限和 Linux 格式
RUN chmod +x /usr/src/app/deployment/entrypoint.sh && \
    sed -i 's/\r$//' /usr/src/app/deployment/entrypoint.sh

# 複製 nodemon 配置到工作目錄
RUN cp /usr/src/app/deployment/nodemon.json /usr/src/app/

# 暴露應用程式埠
EXPOSE 3000
        
# 使用 entrypoint 腳本啟動應用程式 (修正路徑)
ENTRYPOINT ["/bin/sh", "/usr/src/app/deployment/entrypoint.sh"]