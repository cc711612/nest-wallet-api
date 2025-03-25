#!/bin/sh
set -e

# 正確轉發信號給應用程序
trap 'kill -TERM $PID' TERM INT QUIT

# 日誌輸出，標記應用啟動
echo "Starting NestJS application in development mode..."

# 確保依賴已安裝
npm install

# 使用 nodemon 啟動應用並啟用 legacy watch 選項
nodemon -L --config nodemon.json &

# 保存進程 ID 並等待
PID=$!
wait $PID
