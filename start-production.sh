#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$APP_DIR/backend"

pkill -f "uvicorn main:app" 2>/dev/null || true
pkill -f "cloudflared tunnel --url http://localhost:5173" 2>/dev/null || true
pkill -f "vite --host 0.0.0.0 --port 5173" 2>/dev/null || true
sleep 1

echo "==> Starting Backend..."
cd "$BACKEND_DIR"
source .venv/bin/activate
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > "$APP_DIR/backend.log" 2>&1 &
sleep 2

if ! curl -s http://localhost:8000/api/health > /dev/null; then
    echo "✗ Backend failed to start. Check backend.log"
    exit 1
fi
echo "✓ Backend running at http://localhost:8000"

echo "==> Starting Frontend..."
cd "$APP_DIR"
nohup npm run dev -- --host 0.0.0.0 --port 5173 > "$APP_DIR/frontend.log" 2>&1 &
sleep 3
echo "✓ Frontend running at http://localhost:5173"

echo ""
echo "==============================================="
echo "   Data Science Workbench is running locally!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "==============================================="
echo ""
echo "Run this in ANOTHER terminal to make it public:"
echo ""
echo "   cloudflared tunnel --url http://localhost:5173"
echo ""
echo "Then share the https://xxxx.trycloudflare.com link!"
echo ""

wait