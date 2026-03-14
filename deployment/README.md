# 部署說明

## 1) 準備 env

此專案使用兩份 env（用途不同）：

- 根目錄 `.env`：應用程式執行設定（DB/JWT 等），dev/prod compose 都會使用
- `deployment/.env`：僅部署參數（例如 `PROJECT_NAME`、`PORT`）

複製範本：

```bash
cp .env.example .env
cp deployment/.env.example deployment/.env
```

至少要調整的欄位：

- 開發（`.env`）：`DB_HOST`、`DB_PORT`、`DB_USERNAME`、`DB_PASSWORD`、`DB_DATABASE`、`JWT_SECRET`
- 正式（`deployment/.env`）：通常只需 `PROJECT_NAME`，`PORT` 視需求調整

注意：請在根目錄 `.env` 設定外部資料庫主機 `DB_HOST`。

## 2) 開發模式

使用 hot reload 啟動：

```bash
docker compose -f deployment/docker-compose.dev.yml up --build
```

dev 容器會執行 `deployment/dev-entrypoint.sh`，行為如下：

- 當 `node_modules` 不存在時，自動安裝依賴
- 當 `package-lock.json` 變更時，自動重跑安裝
- 啟動 `npm run start:dev`

開發 compose 不會啟動資料庫容器，預期使用外部 DB。
若 DB 跑在主機上，請在根目錄 `.env` 設定 `DB_HOST=host.docker.internal`。

建議在容器內執行 npm：

```bash
docker compose -f deployment/docker-compose.dev.yml exec app npm install
docker compose -f deployment/docker-compose.dev.yml exec app npm run build
```

你也可以使用預設檔案：

```bash
docker compose -f deployment/docker-compose.yml up --build
```

## 3) 類正式環境啟動

建立 production image 並啟動：

```bash
docker compose --env-file deployment/.env -f deployment/docker-compose.prod.yml up --build -d
```

說明：

- 此 compose 只會啟動 Nest 應用容器。
- 資料庫需為外部服務，並由根目錄 `.env` 提供設定。
- production compose 會讀取根目錄 `.env`（應用設定）與 `deployment/.env`（部署參數）。

停止：

```bash
docker compose --env-file deployment/.env -f deployment/docker-compose.prod.yml down
```
