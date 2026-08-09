"""CV upload, AI analysis, and interview preparation endpoints."""

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from engine.adaptive_engine import AdaptiveInterviewEngine
from engine.cv_parser import extract_text_from_bytes

router = APIRouter(prefix="/api/candidate", tags=["candidate"])


@router.post("/analyze-cv")
async def analyze_cv(
    file: UploadFile = File(...),
    full_name: str = Form(""),
    target_role: str = Form(""),
    experience_level: str = Form(""),
    skills: str = Form(""),
    projects: str = Form(""),
    job_description: str = Form(""),
    additional_info: str = Form(""),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 10MB limit")

    try:
        cv_text = extract_text_from_bytes(file.filename, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    if not cv_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file. Try TXT or a text-based PDF.")

    manual = {
        "fullName": full_name,
        "targetRole": target_role,
        "experienceLevel": experience_level,
        "skills": skills,
        "projects": projects,
    }
    config = {
        "cv_text": cv_text,
        "job_description": job_description,
        "custom_notes": additional_info,
        "target_role": target_role,
        "experience_level": experience_level,
        "candidate_profile": manual,
    }

    engine = AdaptiveInterviewEngine(config)
    structured_profile = engine.analyze_cv_text(cv_text, manual)
    interview_analysis = engine.analyze_interview_configuration()

    return {
        "cv_text": cv_text,
        "structured_profile": structured_profile,
        "interview_data_analysis": interview_analysis,
        "filename": file.filename,
    }


from pydantic import BaseModel, Field


class AnalyzeTextRequest(BaseModel):
    cv_text: str
    candidate_profile: dict = Field(default_factory=dict)
    target_role: str = ""
    experience_level: str = ""
    job_description: str = ""
    additional_info: str = ""


@router.post("/analyze-text")
async def analyze_cv_text_only(payload: AnalyzeTextRequest):
    """Analyze CV from plain text (e.g. pasted resume)."""
    cv_text = payload.cv_text.strip()
    if not cv_text:
        raise HTTPException(status_code=400, detail="cv_text is required")

    manual = payload.candidate_profile or {}
    config = {
        "cv_text": cv_text,
        "job_description": payload.job_description or "",
        "custom_notes": payload.additional_info or "",
        "target_role": payload.target_role or manual.get("targetRole") or "",
        "experience_level": payload.experience_level or manual.get("experienceLevel") or "",
        "candidate_profile": manual,
    }
    engine = AdaptiveInterviewEngine(config)
    structured_profile = engine.analyze_cv_text(cv_text, manual)
    interview_analysis = engine.analyze_interview_configuration()
    return {
        "cv_text": cv_text,
        "structured_profile": structured_profile,
        "interview_data_analysis": interview_analysis,
    }
