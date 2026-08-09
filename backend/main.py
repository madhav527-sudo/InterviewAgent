"""CohortIQ — AI Technical Interview Platform API."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import candidate_prep, candidates, curriculum, interviews

app = FastAPI(
    title="CohortIQ API",
    description="AI-powered technical interview engine for the 31-Day AI Engineering Cohort",
    version="1.0.0",
)

import os

cors_origins_raw = os.getenv("CORS_ORIGINS", "*")
if cors_origins_raw.strip() == "*":
    origins = ["*"]
    allow_credentials = False
else:
    origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)
app.include_router(curriculum.router)
app.include_router(interviews.router)
app.include_router(candidate_prep.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "CohortIQ API", "version": "1.0.0"}


@app.get("/api/topics")
async def list_topics():
    from engine.question_bank import get_topics

    return {"topics": get_topics()}
