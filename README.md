# Data Science Workbench

A public-ready dark dashboard for modern data scientists, built to run like your `ai-chat-app`: local app, GitHub-ready repo, and shareable online through a public tunnel.

## Features

- Real uploads for `CSV`, `TSV`, `JSON`, `XLSX`, `XLS`, `TXT`, and `Parquet`
- Automatic schema inference and preview tables
- Data cleaning and preprocessing actions
- Quick tools for Auto EDA, feature importance, model comparison, drift monitoring, and LLM dataset building
- Charts, correlations, quality summaries, target analysis, and model training panels
- Synthetic data generation for AI / ML training
- Dark Terminal UI matching the approved design

## Project structure

```text
data-science-workbench/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── src/
├── public/
├── assets/
├── verdent-design/
├── setup.sh
├── start.sh
├── start-production.sh
└── autostart-cloudflared.sh
```

## Local setup

```bash
./setup.sh
./start.sh
```

Open:

- Frontend: `http://localhost:5174`
- Backend health: `http://localhost:8010/api/health`

## Public online access

Start the app:

```bash
./start-production.sh
```

Then expose it publicly:

```bash
cloudflared tunnel --url http://localhost:5174
```

Share the generated `https://*.trycloudflare.com` URL.

## Build

```bash
npm run build
```

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- FastAPI
- Recharts
- Papa Parse
- SheetJS (`xlsx`)
- Hyparquet
