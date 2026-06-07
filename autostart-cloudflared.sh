#!/usr/bin/env bash

APP_DIR="/Users/mitsuifaisalshahzad/Documents/SAK university/data-science-workbench"
BACKEND_DIR="$APP_DIR/backend"

echo "$(date) | Starting Data Science Workbench + Cloudflared tunnel..." >> "$APP_DIR/autostart.log"

pkill -f "uvicorn main:app --host 0.0.0.0 --port 8010" 2>/dev/null || true
pkill -f "cloudflared tunnel --url http://localhost:5174" 2>/dev/null || true
pkill -f "vite --host 0.0.0.0 --port 5174" 2>/dev/null || true
sleep 2

echo "$(date) | Starting backend..." >> "$APP_DIR/autostart.log"
cd "$BACKEND_DIR"
source .venv/bin/activate
nohup uvicorn main:app --host 0.0.0.0 --port 8010 >> "$APP_DIR/backend.log" 2>&1 &
sleep 3

echo "$(date) | Starting frontend..." >> "$APP_DIR/autostart.log"
cd "$APP_DIR"
nohup npm run dev -- --host 0.0.0.0 --port 5174 >> "$APP_DIR/frontend.log" 2>&1 &
sleep 4

echo "$(date) | Starting cloudflared tunnel..." >> "$APP_DIR/autostart.log"
nohup cloudflared tunnel --url http://localhost:5174 >> "$APP_DIR/cloudflared.log" 2>&1 &
sleep 5

echo "$(date) | Data Science Workbench started successfully." >> "$APP_DIR/autostart.log"