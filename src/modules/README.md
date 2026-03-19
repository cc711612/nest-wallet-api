# Module Structure (Phase 1)

目前先以 `service + repository` 為主，先建立 `src/modules` 統一入口，避免一次性大搬遷造成風險。

## Target layout

- `src/modules/{module}/controllers`
- `src/modules/{module}/services`
- `src/modules/{module}/repositories`
- `src/modules/{module}/entities`
- `src/modules/{module}/dto`
- `src/modules/{module}/enums`
- `src/modules/{module}/mappers`
- `src/modules/{module}/{module}.module.ts`

## Current status

- Phase 1: 已建立 `src/modules/*/*.module.ts` 統一入口（re-export 舊模組）。
- Phase 2: 逐模組搬遷 controller/service/repository 到 `src/modules`，保持 API contract 不變。
