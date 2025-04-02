#!/bin/bash 
set -e 

# 定義容器名稱或容器 ID（根據你自己的設置）
PROJECT_CONTAINER="nest-wallet-api-node"

echo  "Develop 部署開始 Start..." 

# 拉取最新版本的應用程式
git pull origin develop

docker restart $PROJECT_CONTAINER

echo  "部署完成！"
