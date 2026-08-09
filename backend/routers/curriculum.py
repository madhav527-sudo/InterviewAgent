"""Curriculum API router."""

import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter(prefix="/api/curriculum", tags=["curriculum"])
DATA_DIR = Path(__file__).parent.parent / "data"


@router.get("")
async def get_curriculum():
    with open(DATA_DIR / "curriculum.json") as f:
        return json.load(f)


@router.get("/days/{day}")
async def get_day(day: int):
    with open(DATA_DIR / "curriculum.json") as f:
        data = json.load(f)
    for d in data["days"]:
        if d["day"] == day:
            return d
    return {"error": "Day not found"}
