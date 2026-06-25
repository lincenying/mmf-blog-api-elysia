#!/usr/bin/env bash
# 一键构建并启动生产栈（API + MongoDB）
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

COMPOSE_FILE="docker-compose.yml"
COMPOSE_FILES=(-f "$COMPOSE_FILE")

echo ">>> docker compose ${COMPOSE_FILES[*]} build"
docker compose "${COMPOSE_FILES[@]}" build

echo ">>> docker compose ${COMPOSE_FILES[*]} up -d"
docker compose "${COMPOSE_FILES[@]}" up -d

WEB_PORT="14080"
echo ""
echo "已启动。前端: http://localhost:${WEB_PORT}"
echo "查看日志: docker compose ${COMPOSE_FILES[*]} logs -f api_bun"
echo "停止服务: docker compose ${COMPOSE_FILES[*]} down"
echo ""
