from __future__ import annotations

import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


load_dotenv()

app = FastAPI(title="Data Science Workbench API", version="1.0.0")

origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5174").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    ok: bool
    app: str
    version: str
    supported_uploads: List[str]
    modules: List[str]


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(
        ok=True,
        app="Data Science Workbench",
        version="1.0.0",
        supported_uploads=["csv", "tsv", "json", "xlsx", "xls", "txt", "parquet"],
        modules=[
            "data-cleaning",
            "visualization",
            "model-training",
            "synthetic-data",
            "eda",
            "feature-importance",
            "drift-monitoring",
        ],
    )


@app.get("/api/config")
async def config():
    return {
        "appName": "Data Science Workbench",
        "theme": "Dark Terminal",
        "publicReady": True,
        "deployment": {
            "frontend": "vite",
            "backend": "fastapi",
            "publicTunnel": "cloudflared",
            "targetFrontend": os.getenv("PUBLIC_FRONTEND_URL", ""),
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8010")),
        reload=False,
    )