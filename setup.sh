#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

BLUE='\033[1;34m'; GREEN='\033[1;32m'; RED='\033[1;31m'; NC='\033[0m'
log()  { printf "${BLUE}==>${NC} %s\n" "$*"; }
ok()   { printf "${GREEN}✓${NC} %s\n" "$*"; }
err()  { printf "${RED}✗${NC} %s\n" "$*"; }

if ! command -v python3 >/dev/null 2>&1; then
  err "python3 is required."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  err "npm is required."
  exit 1
fi

log "Installing frontend dependencies..."
cd "$ROOT_DIR"
npm install

log "Creating backend virtual environment..."
cd "$BACKEND_DIR"
python3 -m venv .venv
. .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

ok "Setup complete."
echo "Run ./start.sh to launch the app."