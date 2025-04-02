#!/bin/bash 
set -e 

# 定義容器名稱或容器 ID（根據你自己的設置）
PROJECT_CONTAINER="nest-wallet-api-node"

echo  "Production 部署開始..." 

docker restart $PROJECT_CONTAINER

echo  "部署完成！"
