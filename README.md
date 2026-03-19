# Wallet API

NestJS 錢包 API，使用 `wallet-v2` 相容路由（`/api/*`）。

## 開發啟動（Docker）

```bash
docker compose -f deployment/docker-compose.dev.yml up -d --build
```

## 常用指令（Docker）

```bash
docker compose -f deployment/docker-compose.dev.yml exec app npm run build
docker compose -f deployment/docker-compose.dev.yml exec app npm run test
docker compose -f deployment/docker-compose.dev.yml exec app npm run test:e2e
```

## API 文件

- Swagger UI：`http://localhost:3000/swagger`
- OpenAPI JSON：`http://localhost:3000/swagger-json`
- 對齊報告：`docs/api/wallet-v2-parity-report.md`

## Architecture

- 目前以 `service + repository` 為主，並建立 `src/modules/*` 統一模組入口。
- 模組化遷移規劃請見：`src/modules/README.md`

## Postman 匯入檔

- Collection：`postman/nest-wallet-api.postman_collection.json`

此 collection 已包含：

- `POST /api/auth/login`
- `POST /api/auth/thirdParty/checkBind`
- `POST /api/auth/thirdParty/bind`
- `POST /api/auth/thirdParty/unBind`
- `POST /api/wallet/auth/login`
- `POST /api/wallet/auth/login/token`
- `POST /api/wallet/auth/register`
- `POST /api/wallet/auth/register/batch`
- `GET /api/wallet`
- `GET|POST /api/wallet/user`
- `PUT /api/wallet/user/:wallet_users_id`
- `DELETE /api/wallet/:wallet/user/:wallet_user_id`
- `GET /api/wallet/:wallet/detail`
- `GET /api/device`
- `POST /api/device`
- `GET /api/option/exchangeRate`
- `GET /api/option/category`
- `GET /api/categories`
