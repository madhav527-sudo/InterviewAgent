"""
Central Adaptive Interview Engine
CV Analysis → Candidate Profile → Interview Planning → Question Generation
→ Answer Analysis → Follow-Up Generation → Candidate Assessment → Final Report
"""

from __future__ import annotations

import json
import os
import re
from copy import deepcopy
from datetime import datetime
from typing import Any

try:
    import google.generativeai as genai

    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


def _configure_gemini() -> bool:
    api_key = os.getenv("GOOGLE_API_KEY", "")
    if GEMINI_AVAILABLE and api_key and api_key != "your_gemini_api_key_here":
        genai.configure(api_key=api_key)
        return True
    return False


def _parse_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text.strip())


def _empty_profile() -> dict:
    return {
        "personal": {
            "name": "",
            "education": [],
            "email": "",
            "phone": "",
        },
        "technical_skills": {
            "programming_languages": [],
            "frameworks": [],
            "databases": [],
            "cloud": [],
            "ai_ml": [],
            "tools": [],
            "other": [],
        },
        "experience": {"internships": [], "work": []},
        "projects": [],
        "other": {
            "certifications": [],
            "hackathons": [],
            "leadership": [],
            "achievements": [],
            "extracurricular": [],
            "interests": [],
        },
        "raw_cv_summary": "",
        "claims_to_verify": [],
    }


class AdaptiveInterviewEngine:
    """Single engine for personalized CV-aware adaptive interviews."""

    MODEL_NAME = "gemini-2.0-flash"

    def __init__(self, config: dict):
        self.config = deepcopy(config)
        self.structured_profile: dict = config.get("structured_profile") or _empty_profile()
        self.interview_plan: dict = {}
        self.assessment: dict = {
            "overall_trajectory": "stable",
            "detected_strengths": [],
            "detected_weaknesses": [],
            "technologies_demonstrated": [],
            "technologies_weak": [],
            "cv_consistency_notes": [],
            "questions_answered_well": [],
            "questions_struggled": [],
            "topics_asked": [],
            "questions_asked_text": [],
            "performance_by_category": {},
            "current_difficulty": 3,
            "answer_analyses": [],
        }
        self.conversation_history: list[dict] = []
        self.gemini_model = None
        self._gemini_ready = _configure_gemini()
        if self._gemini_ready:
            try:
                self.gemini_model = genai.GenerativeModel(self.MODEL_NAME)
            except Exception:
                self.gemini_model = None

    # --- Phase 1: CV analysis ---

    def analyze_cv_text(
        self,
        cv_text: str,
        manual_fields: dict | None = None,
    ) -> dict:
        manual_fields = manual_fields or {}
        if not cv_text.strip() and not manual_fields:
            return self._profile_from_manual_only(manual_fields)

        if self.gemini_model and cv_text.strip():
            prompt = f"""Analyze this resume/CV and return ONLY valid JSON (no markdown).

Resume text:
---
{cv_text[:120000]}
---

Also merge any user-provided fields (may be empty): {json.dumps(manual_fields)}

Return this exact JSON shape:
{{
  "personal": {{
    "name": "",
    "education": [{{"degree":"","institution":"","graduation_year":""}}],
    "email": "",
    "phone": ""
  }},
  "technical_skills": {{
    "programming_languages": [],
    "frameworks": [],
    "databases": [],
    "cloud": [],
    "ai_ml": [],
    "tools": [],
    "other": []
  }},
  "experience": {{
    "internships": [{{"company":"","role":"","duration":"","responsibilities":[],"achievements":[]}}],
    "work": [{{"company":"","role":"","duration":"","responsibilities":[],"achievements":[]}}]
  }},
  "projects": [{{
    "name":"","description":"","technologies":[],"role":"","key_features":[],"challenges":[],"results_impact":[]
  }}],
  "other": {{
    "certifications": [],
    "hackathons": [],
    "leadership": [],
    "achievements": [],
    "extracurricular": [],
    "interests": []
  }},
  "raw_cv_summary": "2-3 sentence summary",
  "claims_to_verify": ["specific technical claims from CV worth probing in interview"]
}}"""
            try:
                resp = self.gemini_model.generate_content(prompt)
                profile = _parse_json(resp.text)
                profile = self._merge_manual_into_profile(profile, manual_fields)
                self.structured_profile = profile
                return profile
            except Exception as e:
                print(f"CV analysis failed: {e}")

        profile = self._profile_from_manual_only(manual_fields, cv_text)
        self.structured_profile = profile
        return profile

    def _merge_manual_into_profile(self, profile: dict, manual: dict) -> dict:
        if manual.get("fullName"):
            profile.setdefault("personal", {})["name"] = manual["fullName"]
        if manual.get("degree"):
            edu = profile.setdefault("personal", {}).setdefault("education", [])
            if not edu:
                edu.append({"degree": manual["degree"], "institution": manual.get("college", ""), "graduation_year": manual.get("yearSemester", "")})
        if manual.get("skills"):
            langs = profile.setdefault("technical_skills", {}).setdefault("programming_languages", [])
            for s in re.split(r"[,;|]", manual["skills"]):
                s = s.strip()
                if s and s not in langs:
                    langs.append(s)
        if manual.get("projects") and not profile.get("projects"):
            profile["projects"] = [{
                "name": "Profile project",
                "description": manual["projects"],
                "technologies": [],
                "role": "",
                "key_features": [],
                "challenges": [],
                "results_impact": [],
            }]
        return profile

    def _profile_from_manual_only(self, manual: dict, cv_text: str = "") -> dict:
        p = _empty_profile()
        if cv_text:
            p["raw_cv_summary"] = cv_text[:500]
        return self._merge_manual_into_profile(p, manual)

    # --- Phase 2: Interview config + JD matching ---

    def analyze_interview_configuration(self) -> dict:
        cfg = self.config
        profile = self.structured_profile
        analysis = {
            "target_role": cfg.get("target_role") or cfg.get("candidate_profile", {}).get("targetRole") or "",
            "experience_level": cfg.get("experience_level") or cfg.get("candidate_profile", {}).get("experienceLevel") or "",
            "interview_type": cfg.get("interview_type") or "comprehensive",
            "focus_areas": cfg.get("focus_areas") or [],
            "interview_goal": cfg.get("interview_goal") or "",
            "job_description": cfg.get("job_description") or "",
            "custom_notes": cfg.get("custom_notes") or "",
            "matching_skills": [],
            "missing_skills": [],
            "priority_technologies": [],
            "relevant_projects": [],
            "potential_weak_areas": [],
            "strong_areas": [],
        }

        if self.gemini_model:
            prompt = f"""Compare job requirements with candidate profile. Return ONLY JSON:
{{
  "matching_skills": [],
  "missing_skills": [],
  "priority_technologies": [],
  "relevant_projects": ["project names from CV"],
  "potential_weak_areas": [],
  "strong_areas": [],
  "interview_focus_summary": "one paragraph internal strategy note"
}}

Interview config: {json.dumps({k: cfg.get(k) for k in ('target_role','experience_level','interview_type','job_description','focus_areas','custom_notes','interview_goal')})}

Candidate profile: {json.dumps(profile)[:80000]}"""
            try:
                resp = self.gemini_model.generate_content(prompt)
                parsed = _parse_json(resp.text)
                analysis.update(parsed)
            except Exception as e:
                print(f"Config analysis failed: {e}")

        self.config["interview_data_analysis"] = analysis
        return analysis

    # --- Phase 3: Internal interview plan (not shown to candidate) ---

    def create_interview_plan(self) -> dict:
        cfg = self.config
        num_q = cfg.get("num_questions", 10)
        analysis = cfg.get("interview_data_analysis") or self.analyze_interview_configuration()

        plan = {
            "created_at": datetime.now().isoformat(),
            "target_question_count": num_q,
            "skills_to_test": analysis.get("priority_technologies") or [],
            "projects_to_discuss": analysis.get("relevant_projects") or [],
            "behavioral_ratio": 0.2,
            "technical_ratio": 0.5,
            "cv_deep_dive_ratio": 0.3,
            "difficulty_level": cfg.get("difficulty") or "adaptive",
            "weak_areas_to_probe": analysis.get("potential_weak_areas") or [],
            "strong_areas_to_stretch": analysis.get("strong_areas") or [],
            "jd_gaps_to_investigate": analysis.get("missing_skills") or [],
            "planned_themes": [],
            "internal_notes": analysis.get("interview_focus_summary", ""),
        }

        if self.gemini_model:
            prompt = f"""Create an INTERNAL interview strategy (not questions list for candidate). Return ONLY JSON:
{{
  "planned_themes": ["theme1", "theme2"],
  "opening_focus": "what to reference from CV first",
  "verification_targets": ["claims to verify"],
  "behavioral_topics": [],
  "problem_solving_scenarios": [],
  "adaptive_rules": "when to go deeper vs simplify"
}}

Target ~{num_q} exchanges. Profile: {json.dumps(self.structured_profile)[:60000]}
JD analysis: {json.dumps(analysis)[:20000]}"""
            try:
                resp = self.gemini_model.generate_content(prompt)
                extra = _parse_json(resp.text)
                plan.update(extra)
            except Exception as e:
                print(f"Plan creation failed: {e}")

        self.interview_plan = plan
        return plan

    def prepare_session(self) -> None:
        """Run full pre-interview pipeline."""
        cv_text = self.config.get("cv_text") or ""
        manual = self.config.get("candidate_profile") or {}
        existing = self.config.get("structured_profile")
        if existing and isinstance(existing, dict) and (
            existing.get("projects") or existing.get("technical_skills") or existing.get("personal")
        ):
            self.structured_profile = existing
        else:
            self.analyze_cv_text(cv_text, manual)
        self.analyze_interview_configuration()
        self.create_interview_plan()

    def build_interviewer_system_prompt(self, topic_guidance: str = "") -> str:
        cfg = self.config
        profile = self.structured_profile
        plan = self.interview_plan
        analysis = cfg.get("interview_data_analysis") or {}
        cv_text = cfg.get("cv_text") or ""
        jd = cfg.get("job_description") or ""

        name = (
            profile.get("personal", {}).get("name")
            or cfg.get("candidate_profile", {}).get("fullName")
            or "Candidate"
        )
        style = cfg.get("interviewer_style") or "Professional"

        return f"""You are Aria, an expert AI interviewer who has thoroughly read the candidate's CV before the interview.

## Structured candidate profile (from CV analysis)
{json.dumps(profile, indent=2)[:90000]}

## Interview configuration analysis
{json.dumps(analysis, indent=2)[:15000]}

## Internal interview plan (NEVER reveal full plan or question list to candidate)
{json.dumps(plan, indent=2)[:15000]}

## Raw CV excerpt
{cv_text[:40000]}

## Job description
{jd[:15000]}

## Candidate name: {name}
## Interviewer style: {style}

## Mandatory behavior
1. Ask ONE clear question at a time in "response" field only — no numbered lists of future questions.
2. Reference specific CV projects, technologies, and claims by name.
3. Verify CV claims with follow-ups; if vague, probe deeper or ask simpler fundamentals.
4. Adapt difficulty: strong answers → harder; weak answers → simpler follow-up, not failure.
5. Follow new topics the candidate mentions.
6. Never repeat the same basic question on a topic already covered (see memory in user messages).
7. Categories to rotate: cv_based, project, skill, role_specific, problem_solving, behavioral, situational, deep_dive.

{topic_guidance}

Return ONLY valid JSON:
{{
  "response": "natural spoken message with exactly one question",
  "stage": "introduction|background|cv_projects|technical|deep_dive|behavioral|closing",
  "question_category": "cv_based|project|skill|role_specific|problem_solving|behavioral|situational|deep_dive",
  "difficulty_assessment": "strong|moderate|weak",
  "topics_touched": [],
  "key_observations": [],
  "answer_analysis": {{
    "understanding": "",
    "correctness": "",
    "depth": "",
    "relevance": "",
    "communication": "",
    "confidence": "",
    "cv_consistency": "",
    "follow_up_opportunity": ""
  }},
  "should_end_soon": false,
  "score_estimate": 70
}}"""

    def _call_interviewer(self, system_prompt: str, user_prompt: str) -> dict:
        if not self.gemini_model:
            return self._fallback_turn(user_prompt)

        try:
            model = genai.GenerativeModel(self.MODEL_NAME, system_instruction=system_prompt)
            chat = model.start_chat(history=self.conversation_history[-20:])
            resp = chat.send_message(user_prompt)
            parsed = _parse_json(resp.text)
            self.conversation_history.append({"role": "user", "parts": [user_prompt]})
            self.conversation_history.append({"role": "model", "parts": [resp.text]})
            return parsed
        except Exception as e:
            print(f"Interviewer call failed: {e}")
            return self._fallback_turn(user_prompt)

    def _fallback_turn(self, user_prompt: str) -> dict:
        profile = self.structured_profile
        projects = profile.get("projects") or []
        proj_name = projects[0].get("name") if projects else "your main project"
        count = len(self.assessment["questions_asked_text"])
        if count == 0:
            msg = f"Welcome! I've reviewed your CV. Could you introduce yourself and tell me about {proj_name}?"
        else:
            msg = "Thank you. Can you go deeper into the technical decisions you made on that project?"
        return {
            "response": msg,
            "stage": "introduction" if count == 0 else "technical",
            "question_category": "cv_based",
            "difficulty_assessment": "moderate",
            "topics_touched": [],
            "key_observations": [],
            "answer_analysis": {},
            "should_end_soon": count >= self.config.get("num_questions", 10),
            "score_estimate": 65,
        }

    def generate_opening_question(self, system_prompt: str) -> dict:
        role = self.config.get("target_role") or "this role"
        prompt = f"""Start the interview now for target role: {role}.
Greet the candidate by name if known. State briefly that you reviewed their resume.
Ask ONE opening question — either intro plus highlight most relevant CV project, or dive into highest-priority project from the plan."""
        return self._call_interviewer(system_prompt, prompt)

    def process_candidate_answer(
        self,
        answer_text: str,
        system_prompt: str,
        exchange_count: int,
        num_questions: int,
        memory: dict,
    ) -> dict:
        topics = memory.get("topics_discussed", [])
        asked = memory.get("questions_asked", [])[-15:]
        prompt = f"""Candidate answer:
\"{answer_text}\"

Interview memory:
- Topics already discussed (do NOT repeat basic questions on these): {', '.join(topics) or 'none yet'}
- Recent questions asked: {json.dumps(asked[-8:])}
- Exchange {exchange_count} of ~{num_questions}
- Detected strengths so far: {', '.join(self.assessment.get('detected_strengths', [])[-5:])}
- Detected weaknesses so far: {', '.join(self.assessment.get('detected_weaknesses', [])[-5:])}

Analyze the answer internally in answer_analysis fields (not shown to candidate in isolation).
Then give a brief natural acknowledgment if appropriate and ask exactly ONE next question.
If exchange >= {num_questions - 1} and enough ground covered, set should_end_soon true and ask a closing reflection question."""

        result = self._call_interviewer(system_prompt, prompt)
        self._update_assessment_from_turn(answer_text, result)
        return result

    def _update_assessment_from_turn(self, answer_text: str, ai: dict) -> None:
        q_text = ai.get("response", "")
        if q_text:
            self.assessment["questions_asked_text"].append(q_text[:500])
        for t in ai.get("topics_touched", []):
            if t not in self.assessment["topics_asked"]:
                self.assessment["topics_asked"].append(t)
        diff = ai.get("difficulty_assessment", "moderate")
        score = ai.get("score_estimate", 70)
        if diff == "strong" or score >= 78:
            self.assessment["detected_strengths"].extend(ai.get("key_observations", [])[:2])
            self.assessment["current_difficulty"] = min(5, self.assessment["current_difficulty"] + 1)
        elif diff == "weak" or score < 55:
            self.assessment["detected_weaknesses"].extend(ai.get("key_observations", [])[:2])
            self.assessment["current_difficulty"] = max(1, self.assessment["current_difficulty"] - 1)

        aa = ai.get("answer_analysis") or {}
        if aa:
            self.assessment["answer_analyses"].append({"answer_excerpt": answer_text[:300], **aa})
            if aa.get("cv_consistency") and "consistent" in str(aa.get("cv_consistency")).lower():
                self.assessment["cv_consistency_notes"].append(aa["cv_consistency"])
        cat = ai.get("question_category", "general")
        self.assessment["performance_by_category"].setdefault(cat, []).append(score)

        if score >= 75:
            self.assessment["questions_answered_well"].append(q_text[:200])
        elif score < 55:
            self.assessment["questions_struggled"].append(q_text[:200])

    def generate_final_analysis(self, turns_summary: list[dict]) -> dict:
        """AI-generated post-interview report enrichment."""
        base = {
            "technologies_demonstrated": list(set(self.assessment.get("technologies_demonstrated", []))),
            "technologies_requiring_improvement": list(set(self.assessment.get("technologies_weak", []))),
            "questions_answered_well": self.assessment.get("questions_answered_well", [])[:8],
            "questions_struggled": self.assessment.get("questions_struggled", [])[:8],
            "recommended_learning_areas": [],
            "hiring_recommendation_detail": "",
            "cv_credibility_summary": "",
        }

        if not self.gemini_model:
            return base

        prompt = f"""Generate final interview analysis. Return ONLY JSON:
{{
  "overall_score": 0-100 number,
  "technical_knowledge": 0-100,
  "problem_solving": 0-100,
  "communication": 0-100,
  "project_knowledge": 0-100,
  "cv_credibility": 0-100,
  "role_fit": 0-100,
  "strong_areas": [],
  "weak_areas": [],
  "technologies_demonstrated": [],
  "technologies_requiring_improvement": [],
  "questions_answered_well": [],
  "questions_struggled": [],
  "recommended_learning_areas": [],
  "hiring_recommendation": "paragraph"
}}

Profile: {json.dumps(self.structured_profile)[:50000]}
Assessment: {json.dumps(self.assessment)[:30000]}
Turns: {json.dumps(turns_summary)[:80000]}
Target role: {self.config.get('target_role')}"""
        try:
            resp = self.gemini_model.generate_content(prompt)
            parsed = _parse_json(resp.text)
            base.update(parsed)
            return base
        except Exception as e:
            print(f"Final analysis failed: {e}")
            return base
