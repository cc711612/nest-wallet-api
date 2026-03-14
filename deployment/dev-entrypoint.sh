#!/bin/sh
set -e

LOCKFILE_CACHE="node_modules/.package-lock.json"

if [ ! -d node_modules ]; then
  echo "[dev-entrypoint] 找不到 node_modules，執行 npm ci..."
  npm ci
  cp package-lock.json "$LOCKFILE_CACHE"
elif [ ! -f "$LOCKFILE_CACHE" ] || ! cmp -s package-lock.json "$LOCKFILE_CACHE"; then
  echo "[dev-entrypoint] 偵測到 package-lock 變更，執行 npm ci..."
  npm ci
  cp package-lock.json "$LOCKFILE_CACHE"
fi

exec npm run start:dev
