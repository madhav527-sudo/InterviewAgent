"""Interview session API router."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from engine.interviewer import InterviewEngine, SESSIONS

router = APIRouter(prefix="/api/interviews", tags=["interviews"])


class StartInterviewRequest(BaseModel):
    candidate_id: str = "cand_001"
    interview_type: str = "comprehensive"
    difficulty: str = "adaptive"
    num_questions: int = Field(default=10, ge=5, le=20)
    selected_topics: list[str] = []
    auto_select_topics: bool = True
    candidate_profile: dict = {}
    job_description: str = ""
    cv_text: str = ""
    structured_profile: dict = {}
    target_role: str = ""
    experience_level: str = ""
    interviewer_style: str = "Professional"
    user_expectations: list[str] = []
    focus_areas: list[str] = []
    custom_notes: str = ""
    interview_goal: str = ""


class AnswerRequest(BaseModel):
    answer_text: str


@router.post("/start")
async def start_interview(req: StartInterviewRequest):
    config = req.model_dump()
    engine = InterviewEngine(req.candidate_id, config)
    SESSIONS[engine.session_id] = engine
    state = engine.get_first_question()
    return {"session_id": engine.session_id, **state}


@router.get("/{session_id}")
async def get_session(session_id: str):
    engine = SESSIONS.get(session_id)
    if not engine:
        raise HTTPException(status_code=404, detail="Interview session not found")
    return engine._session_state()


@router.get("/{session_id}/history")
async def get_history(session_id: str):
    engine = SESSIONS.get(session_id)
    if not engine:
        raise HTTPException(status_code=404, detail="Interview session not found")
    return {
        "turns": [
            {
                "question": t["question"],
                "answer": t["answer"],
                "skipped": t["skipped"],
                "is_followup": t["question"].get("is_followup", False),
            }
            for t in engine.turns
            if t["answer"] or t["skipped"]
        ],
        "topics_covered": engine.topics_covered,
        "days_covered": engine.days_covered,
    }


@router.post("/{session_id}/answer")
async def submit_answer(session_id: str, req: AnswerRequest):
    engine = SESSIONS.get(session_id)
    if not engine:
        raise HTTPException(status_code=404, detail="Interview session not found")
    if engine.status == "completed":
        raise HTTPException(status_code=400, detail="Interview already completed")
    state = engine.process_answer(req.answer_text)
    return state


@router.post("/{session_id}/skip")
async def skip_question(session_id: str):
    engine = SESSIONS.get(session_id)
    if not engine:
        raise HTTPException(status_code=404, detail="Interview session not found")
    if engine.status == "completed":
        raise HTTPException(status_code=400, detail="Interview already completed")
    state = engine.skip_question()
    return state


@router.post("/{session_id}/complete")
async def complete_interview(session_id: str):
    engine = SESSIONS.get(session_id)
    if not engine:
        raise HTTPException(status_code=404, detail="Interview session not found")
    report = engine.complete_interview()
    return report
