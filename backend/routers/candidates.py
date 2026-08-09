"""Candidate API router."""
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/candidates", tags=["candidates"])
DATA_DIR = Path(__file__).parent.parent / "data"


@router.get("")
async def list_candidates():
    with open(DATA_DIR / "candidate.json") as f:
        data = json.load(f)
    return {"candidates": data["candidates"]}


@router.get("/{candidate_id}")
async def get_candidate(candidate_id: str):
    with open(DATA_DIR / "candidate.json") as f:
        data = json.load(f)
    for c in data["candidates"]:
        if c["id"] == candidate_id:
            return c
    raise HTTPException(status_code=404, detail="Candidate not found")
