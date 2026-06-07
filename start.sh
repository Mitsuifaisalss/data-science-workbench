#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

BLUE='\033[1;34m'; GREEN='\033[1;32m'; YELLOW='\033[1;33m'; RED='\033[1;31m'; NC='\033[0m'
log()  { printf "${BLUE}==>${NC} %s\n" "$*"; }
ok()   { printf "${GREEN}✓${NC} %s\n" "$*"; }
warn() { printf "${YELLOW}!${NC} %s\n" "$*"; }
err()  { printf "${RED}✗${NC} %s\n" "$*"; }

if [ ! -d "$BACKEND_DIR/.venv" ]; then
  err "backend/.venv missing. Run ./setup.sh first."
  exit 1
fi

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  err "node_modules missing. Run ./setup.sh first."
  exit 1
fi

PIDS=()
cleanup() {
  echo
  log "Shutting down…"
  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
  wait 2>/dev/null || true
  ok "Bye"
}
trap cleanup EXIT INT TERM

log "Starting backend on http://localhost:8010"
(
  cd "$BACKEND_DIR"
  . .venv/bin/activate
  exec python -m uvicorn main:app --host 0.0.0.0 --port 8010
) &
PIDS+=("$!")

log "Starting frontend on http://localhost:5174"
(
  cd "$ROOT_DIR"
  exec npm run dev -- --host 0.0.0.0 --port 5174
) &
PIDS+=("$!")

echo
ok "Both servers starting. Open http://localhost:5174"
echo "Press Ctrl+C to stop."

wait