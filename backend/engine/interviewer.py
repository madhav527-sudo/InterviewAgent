"""
CohortIQ AI Interview Engine — Gemini-Powered Conversational Interviewer
Replaces static question bank with dynamic, context-aware AI conversation.
"""

import json
import uuid
import os
from datetime import datetime
from pathlib import Path
from .question_bank import QUESTION_BANK, get_topic_guidance, get_curriculum_days_for_topic
from .adaptive_engine import AdaptiveInterviewEngine

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

DATA_DIR = Path(__file__).parent.parent / "data"


def _configure_gemini():
    """Configure Gemini API if available."""
    api_key = os.getenv("GOOGLE_API_KEY", "")
    if GEMINI_AVAILABLE and api_key and api_key != "your_gemini_api_key_here":
        genai.configure(api_key=api_key)
        return True
    return False


def load_candidate(candidate_id: str) -> dict:
    with open(DATA_DIR / "candidate.json") as f:
        data = json.load(f)
    for c in data["candidates"]:
        if c["id"] == candidate_id:
            return c
    return data["candidates"][0]


def load_curriculum() -> dict:
    with open(DATA_DIR / "curriculum.json") as f:
        return json.load(f)


# In-memory session store
SESSIONS: dict = {}

# Interview stages
STAGES = ["introduction", "background", "technical", "deep_dive", "behavioral", "closing"]


def _build_system_prompt(candidate: dict, config: dict, topic_guidance: str) -> str:
    """Build the system prompt for the CV-aware AI interviewer persona (Aria)."""
    profile = config.get("candidate_profile", {}) or {}
    candidate_name = profile.get("fullName") or config.get("candidate_name") or candidate.get("name", "Candidate")
    degree = profile.get("degree") or profile.get("education") or "Software Engineering"
    skills = profile.get("skills") or ", ".join(candidate.get("strengths", [])) or "Programming & Software Development"
    projects = profile.get("projects") or "Technical projects"
    experience = profile.get("experienceLevel") or config.get("experience_level") or "Fresher"
    target_role = config.get("target_role") or profile.get("targetRole") or "Software / AI Engineer"
    target_company = config.get("target_company") or profile.get("preferredCompany") or "Tech Company"
    job_description = config.get("job_description") or ""
    cv_text = config.get("cv_text") or ""
    interview_goal = config.get("interview_goal") or "Placement Preparation & Skill Practice"
    interviewer_style = config.get("interviewer_style") or "Professional"
    user_expectations = ", ".join(config.get("user_expectations", [])) or "Ask realistic CV-aware questions"
    focus_areas = ", ".join(config.get("focus_areas", [])) or "CV Claims, Technical Concepts & Communication"

    jd_block = f"\n### Target Job Description Requirements:\n{job_description}\n" if job_description else ""
    cv_block = f"\n### Full Resume / CV Text Extracted:\n{cv_text}\n" if cv_text else ""

    return f"""You are Aria, an expert female AI interviewer at CohortIQ. You conduct real-time, highly personalized technical & behavioral interviews that feel like a natural conversation with an expert interviewer who has thoroughly read the candidate's CV.

## Candidate Background & CV Information
- Name: {candidate_name}
- Education / Degree: {degree}
- Experience Level: {experience}
- Technical Skills Listed: {skills}
- Documented Projects: {projects}
- Target Job Role: {target_role}
- Target Company / Industry: {target_company}
- Interview Goal: {interview_goal}
- Focus Improvement Areas: {focus_areas}
{jd_block}{cv_block}
## Interviewer Persona Mode: **{interviewer_style}**
- Guidelines:
  - If "Strict" or "Challenging": Deeply verify claims, challenge vague or shallow answers, ask tough follow-ups on architecture/edge cases.
  - If "Friendly" or "Supportive": Be encouraging while probing technical concepts deeply.
  - If "Technical Expert": Dive into architecture, low-level details, databases, API design, and performance optimizations.
  - If "Professional": Maintain an objective, corporate, and structured interview tone.

## Core Rules for CV-Aware Dynamic Questioning
1. SHOW YOU READ THEIR CV: In your questions, explicitly reference what they wrote in their profile/CV!
   - Example: "I noticed on your resume that you built a project using React and Node.js. Can you explain how you designed the architecture?"
   - Example: "You mentioned SQL experience — how did you structure your schema and optimize query performance?"
2. VERIFY CV CLAIMS:
   - Ask specific technical questions to verify if candidate genuinely built what they claimed.
   - If they give a vague answer, probe deeper ("What specifically made it scalable?" or "What challenges did you face implementing authentication?").
3. JOB DESCRIPTION MATCHING (If JD is provided):
   - Compare candidate's skills with job requirements. Prioritize evaluating skills required by the job.
4. ADAPTIVE FOLLOW-UP LOOP:
   - Ask ONE clear question at a time. Never dump multiple questions.
   - Strong answer -> Acknowledge briefly and increase complexity (ask system design, edge cases, trade-offs).
   - Weak/Uncertain answer -> Ask a simpler clarifying question on the same topic to test fundamentals.
   - New topic mentioned -> Follow the new topic naturally instead of sticking rigidly to a script.
5. CONVERSATIONAL TONE:
   - Use natural human transitions ("That makes sense...", "That's an interesting approach. How did you...").
   - NEVER use robotic headings like "Question 3:".

## Topic Areas Guidance
{topic_guidance}

## Response Format
Always return ONLY a valid JSON object (no markdown, no ```json formatting):
{{
  "response": "Your natural spoken response to the user containing your next question",
  "stage": "current stage: introduction|background|cv_projects|technical|deep_dive|behavioral|closing",
  "difficulty_assessment": "strong|moderate|weak",
  "topics_touched": ["list of topics touched"],
  "key_observations": ["notable things observed about answer depth or CV consistency"],
  "should_end_soon": false,
  "score_estimate": 70
}}"""


class InterviewEngine:
    def __init__(self, candidate_id: str, config: dict):
        self.session_id = str(uuid.uuid4())[:12]
        self.candidate = load_candidate(candidate_id)
        self.curriculum = load_curriculum()
        self.config = config
        self.turns = []  # Keep for compatibility with report
        self.current_difficulty = 3
        self.topics_covered = []
        self.days_covered = []
        self.strengths_detected = []
        self.weaknesses_detected = []
        self.contradictions = []
        self.answer_history = []
        self.topic_scores = {}
        self.questions_asked_ids = set()
        self.status = "in_progress"
        self.started_at = datetime.now().isoformat()
        
        # Conversational state
        self.conversation_history: list[dict] = []  # {role: "user"|"model", parts: [text]}
        self.interview_context = {
            "mentioned_projects": [],
            "mentioned_technologies": [],
            "topics_discussed": [],
            "strengths_observed": [],
            "weaknesses_observed": [],
            "current_stage": "introduction",
            "questions_count": 0,
            "key_observations": [],
            "questions_asked": [],
        }
        self.gemini_model = None
        self.gemini_chat = None
        self.system_prompt = ""

        # Central adaptive interview engine (CV → plan → Q&A → assessment)
        self.adaptive = AdaptiveInterviewEngine(config)
        self.adaptive.prepare_session()
        self.config["structured_profile"] = self.adaptive.structured_profile
        self.config["interview_data_analysis"] = self.adaptive.config.get("interview_data_analysis")
        
        # Select topics and build guidance
        self.target_topics = self._select_topics()
        self.topic_guidance = get_topic_guidance(self.target_topics, config.get("difficulty", "adaptive"))
        
        # Initialize Gemini
        self._init_gemini()

    def _select_topics(self) -> list[str]:
        """Select interview topics based on config and candidate profile."""
        if self.config.get("selected_topics") and not self.config.get("auto_select_topics", True):
            return self.config["selected_topics"]

        candidate = self.candidate
        priority_topics = []
        weak_topics = candidate.get("weaknesses", [])
        strong_topics = candidate.get("strengths", [])

        topic_map = {
            "Prompt Engineering": "Prompt Engineering",
            "RAG Architecture": "RAG Architecture",
            "RAG Basics": "RAG Architecture",
            "Vector Retrieval Optimization": "Vector Databases",
            "Vector Retrieval": "Vector Databases",
            "Vector Database Indexing": "Vector Databases",
            "Embedding Models": "RAG Architecture",
            "Production Deployment": "AI Deployment",
            "System Design at Scale": "Production AI Systems",
            "Monitoring & Observability": "AI Deployment",
            "Agentic AI": "Agentic AI",
            "MCP Basics": "MCP",
            "Advanced MCP Patterns": "MCP",
            "Chain-of-Thought Reasoning": "Prompt Engineering",
            "LangChain Basics": "LangChain & LangGraph",
            "LangGraph": "LangChain & LangGraph",
            "Chunking Strategies": "RAG Architecture",
            "RAG Evaluation Metrics": "RAG Architecture",
            "RAG Evaluation": "RAG Architecture",
        }

        for w in weak_topics:
            mapped = topic_map.get(w)
            if mapped and mapped in QUESTION_BANK and mapped not in priority_topics:
                priority_topics.append(mapped)

        for s in strong_topics:
            mapped = topic_map.get(s)
            if mapped and mapped in QUESTION_BANK and mapped not in priority_topics:
                priority_topics.append(mapped)

        all_topics = list(QUESTION_BANK.keys())
        for t in all_topics:
            if t not in priority_topics:
                priority_topics.append(t)

        return priority_topics[:min(6, len(priority_topics))]

    def _init_gemini(self):
        """Build interviewer system prompt from adaptive engine context."""
        self.system_prompt = self.adaptive.build_interviewer_system_prompt(self.topic_guidance)
        if not _configure_gemini():
            print("WARNING: Gemini API not configured or key not set. Using fallback responses.")
            return
        try:
            self.gemini_model = genai.GenerativeModel(
                'gemini-2.0-flash',
                system_instruction=self.system_prompt
            )
            self.gemini_chat = self.gemini_model.start_chat(history=[])
        except Exception as e:
            print(f"Failed to initialize Gemini: {e}")
            self.gemini_model = None
            self.gemini_chat = None

    def _call_gemini(self, message: str) -> dict:
        """Send a message through the adaptive engine interviewer."""
        if self.gemini_chat:
            try:
                response = self.gemini_chat.send_message(message)
                text = response.text.strip()
                if text.startswith('```json'):
                    text = text[7:]
                if text.startswith('```'):
                    text = text[3:]
                if text.endswith('```'):
                    text = text[:-3]
                return json.loads(text.strip())
            except json.JSONDecodeError as e:
                print(f"Failed to parse Gemini response as JSON: {e}")
                try:
                    return {
                        "response": response.text.strip(),
                        "stage": self.interview_context["current_stage"],
                        "difficulty_assessment": "moderate",
                        "topics_touched": [],
                        "key_observations": [],
                        "should_end_soon": False,
                        "score_estimate": 60
                    }
                except Exception:
                    pass
            except Exception as e:
                print(f"Gemini API call failed: {e}")

        return self.adaptive._call_interviewer(self.system_prompt, message)

    def _fallback_response(self, user_message: str) -> dict:
        """Fallback when Gemini is unavailable."""
        ctx = self.interview_context
        q_count = ctx["questions_count"]
        
        if q_count == 0:
            return {
                "response": f"Hi {self.candidate['name'].split()[0]}! I'm Aria, your interviewer today. Could you start by telling me about yourself and your background in AI and software engineering?",
                "stage": "introduction",
                "difficulty_assessment": "moderate",
                "topics_touched": [],
                "key_observations": [],
                "should_end_soon": False,
                "score_estimate": 0
            }
        elif q_count < 3:
            return {
                "response": "That's very interesting. Can you tell me about a specific project you've built and the technical challenges you faced while working on it?",
                "stage": "background",
                "difficulty_assessment": "moderate",
                "topics_touched": [],
                "key_observations": [],
                "should_end_soon": False,
                "score_estimate": 65
            }
        else:
            topic = self.target_topics[q_count % len(self.target_topics)] if self.target_topics else "General AI"
            return {
                "response": f"Let's dive into {topic}. Can you explain the core concepts of this area and how you've applied them in practice?",
                "stage": "technical",
                "difficulty_assessment": "moderate",
                "topics_touched": [topic],
                "key_observations": [],
                "should_end_soon": q_count >= 10,
                "score_estimate": 70
            }

    def get_first_question(self) -> dict:
        """Start the interview after CV/strategy preparation — one personalized opening question."""
        profile = self.config.get("candidate_profile", {}) or {}
        name = profile.get("fullName") or self.config.get("candidate_name") or self.candidate.get("name", "Candidate")
        target_role = self.config.get("target_role") or profile.get("targetRole") or "Software Engineer"

        ai_response = None
        if self.gemini_chat:
            ai_response = self._call_gemini(
                f"Begin the interview for {target_role}. Candidate: {name}. "
                "One greeting + one CV-specific opening question only."
            )
        else:
            ai_response = self.adaptive.generate_opening_question(self.system_prompt)

        response_text = ai_response.get(
            "response",
            f"Hi {name.split()[0] if name else 'there'}! I've reviewed your resume for the {target_role} role. "
            "Could you introduce yourself and walk me through your most relevant project?",
        )
        stage = ai_response.get("stage", "introduction")
        self._apply_ai_turn_metadata(ai_response, stage)

        turn = {
            "question": {
                "id": "ai_greeting",
                "text": response_text,
                "topic": "Introduction",
                "curriculum_day": 0,
                "difficulty": 1,
                "question_type": "introduction",
                "context": "",
                "is_followup": False,
                "references_previous": None,
            },
            "answer": None,
            "evaluation": None,
            "skipped": False,
        }
        self.turns.append(turn)
        self.interview_context["questions_count"] = 1
        self.interview_context["questions_asked"] = [response_text[:300]]
        return self._session_state()

    def _apply_ai_turn_metadata(self, ai_response: dict, stage: str | None = None) -> None:
        stage = stage or ai_response.get("stage", self.interview_context["current_stage"])
        self.interview_context["current_stage"] = stage
        for topic in ai_response.get("topics_touched", []):
            if topic not in self.interview_context["topics_discussed"]:
                self.interview_context["topics_discussed"].append(topic)
            if topic not in self.topics_covered:
                self.topics_covered.append(topic)
        for obs in ai_response.get("key_observations", []):
            self.interview_context["key_observations"].append(obs)
        difficulty = ai_response.get("difficulty_assessment", "moderate")
        if difficulty == "strong":
            if stage not in self.strengths_detected:
                self.strengths_detected.append(stage)
            self.current_difficulty = min(5, self.current_difficulty + 1)
        elif difficulty == "weak":
            if stage not in self.weaknesses_detected:
                self.weaknesses_detected.append(stage)
            self.current_difficulty = max(1, self.current_difficulty - 1)

    def process_answer(self, answer_text: str) -> dict:
        """Process candidate's answer using Gemini for dynamic response generation."""
        if not self.turns:
            return self._session_state()

        current_turn = self.turns[-1]
        current_turn["answer"] = answer_text
        current_turn["timestamp"] = datetime.now().isoformat()
        
        num_q = self.config.get("num_questions", 10)
        answered = self.interview_context["questions_count"]

        if self.gemini_chat:
            context_summary = ""
            if self.interview_context["topics_discussed"]:
                context_summary = f"\nTopics already discussed: {', '.join(self.interview_context['topics_discussed'][-8:])}"
            prompt = f"""The candidate answered: \"{answer_text}\"

Interview progress: {answered} exchanges so far, target ~{num_q}.{context_summary}
Current stage: {self.interview_context['current_stage']}
Recent questions (do not repeat): {json.dumps(self.interview_context.get('questions_asked', [])[-6:])}

Analyze answer internally. Acknowledge briefly if natural. Ask exactly ONE next CV-aware question."""
            if answered >= num_q - 1:
                prompt += "\nNear end — set should_end_soon true when appropriate."
            ai_response = self._call_gemini(prompt)
            self.adaptive._update_assessment_from_turn(answer_text, ai_response)
        else:
            ai_response = self.adaptive.process_candidate_answer(
                answer_text,
                self.system_prompt,
                answered,
                num_q,
                self.interview_context,
            )

        response_text = ai_response.get("response", "Thank you for that answer. Could you tell me more?")
        stage = ai_response.get("stage", self.interview_context["current_stage"])
        self.interview_context["questions_count"] += 1
        self.interview_context.setdefault("questions_asked", []).append(response_text[:300])
        self._apply_ai_turn_metadata(ai_response, stage)
        
        # Evaluation score
        score = ai_response.get("score_estimate", 70)
        evaluation = {
            "score": score,
            "technical_accuracy": score,
            "depth": score,
            "communication": min(95, score + 10),
            "feedback": response_text[:200],
            "strengths_shown": ai_response.get("key_observations", [])[:3],
            "gaps_identified": [],
            "misconceptions": [],
            "follow_up_suggested": not ai_response.get("should_end_soon", False),
        }
        current_turn["evaluation"] = evaluation
        
        self.answer_history.append({
            "question_id": current_turn["question"]["id"],
            "topic": current_turn["question"]["topic"],
            "score": score,
            "key_points": answer_text[:200],
        })
        
        # Check if interview should end
        should_end = ai_response.get("should_end_soon", False)
        answered_count = self.interview_context["questions_count"]
        
        if should_end and answered_count >= num_q:
            return self._session_state()
        
        # Create next turn with AI's response
        next_turn = {
            "question": {
                "id": f"ai_q_{answered_count}",
                "text": response_text,
                "topic": ", ".join(ai_response.get("topics_touched", [stage])),
                "curriculum_day": 0,
                "difficulty": self.current_difficulty,
                "question_type": "conversational",
                "context": "",
                "is_followup": True,
                "references_previous": current_turn["question"]["id"],
            },
            "answer": None,
            "evaluation": None,
            "skipped": False,
        }
        self.turns.append(next_turn)
        
        return self._session_state()

    def skip_question(self) -> dict:
        """Skip the current question."""
        if self.turns:
            self.turns[-1]["skipped"] = True
            self.turns[-1]["evaluation"] = {
                "score": 0, "technical_accuracy": 0, "depth": 0, "communication": 0,
                "feedback": "Question was skipped.", "strengths_shown": [],
                "gaps_identified": [], "misconceptions": [], "follow_up_suggested": True,
            }
        
        self.interview_context["questions_count"] += 1
        
        ai_response = self._call_gemini("The candidate chose to skip this question. Move on to a different topic area with an appropriate question.")
        response_text = ai_response.get("response", "No problem, let me ask you about a different topic.")
        
        next_turn = {
            "question": {
                "id": f"ai_q_{self.interview_context['questions_count']}",
                "text": response_text,
                "topic": ", ".join(ai_response.get("topics_touched", ["General"])),
                "curriculum_day": 0,
                "difficulty": self.current_difficulty,
                "question_type": "conversational",
                "context": "",
                "is_followup": False,
                "references_previous": None,
            },
            "answer": None,
            "evaluation": None,
            "skipped": False,
        }
        self.turns.append(next_turn)
        return self._session_state()

    def complete_interview(self) -> dict:
        """Complete the interview and generate a comprehensive report."""
        self.status = "completed"
        return self._generate_report()

    def _generate_report(self) -> dict:
        """Generate interview report."""
        answered_turns = [t for t in self.turns if t["answer"] and t["evaluation"]]
        skipped_turns = [t for t in self.turns if t["skipped"]]

        if not answered_turns:
            overall = 0
        else:
            overall = sum(t["evaluation"]["score"] for t in answered_turns) / len(answered_turns)

        cat_scores = {}
        for topic in self.topics_covered:
            topic_turns = [t for t in answered_turns if topic.lower() in t["question"].get("topic", "").lower()]
            if topic_turns:
                avg = sum(t["evaluation"]["score"] for t in topic_turns) / len(topic_turns)
                level = "Expert" if avg >= 85 else "Proficient" if avg >= 70 else "Developing" if avg >= 50 else "Needs Work"
                cat_scores[topic] = {"score": round(avg, 1), "level": level, "details": f"Answered {len(topic_turns)} questions"}

        profile = self.config.get("candidate_profile", {}) or {}
        candidate_name = profile.get("fullName") or self.config.get("candidate_name") or self.candidate.get("name", "Candidate")
        target_role = self.config.get("target_role") or profile.get("targetRole") or "Software Engineer"

        dims = {
            "Technical Knowledge": round(overall * 1.0, 1),
            "Problem Solving": round(overall * 0.95, 1),
            "CV Credibility & Consistency": round(min(100, overall * 1.02), 1),
            "Project Knowledge": round(overall * 0.98, 1),
            "Role Fit": round(min(100, overall * 0.96 + 3), 1),
            "Communication": round(min(95, overall + 5), 1),
        }
        for k in dims:
            score = max(0, min(100, dims[k]))
            dims[k] = {
                "score": score,
                "level": "Expert" if score >= 85 else "Proficient" if score >= 70 else "Developing" if score >= 50 else "Needs Work",
                "details": ""
            }

        all_strengths = list(set(
            s for t in answered_turns 
            for s in t["evaluation"].get("strengths_shown", [])
        ))[:6]
        
        all_gaps = list(set(
            g for g in self.interview_context.get("weaknesses_observed", [])
        ))[:6]
        
        if not all_strengths:
            all_strengths = ["Active participation in technical conversation"]
        if not all_gaps:
            all_gaps = ["Continue practicing complex technical explanations"]

        insights = self.interview_context.get("key_observations", [])[:6]
        if not insights:
            insights = ["Interview completed with Gemini AI-powered adaptive conversational engine."]

        revision_plan = []
        for weakness in self.weaknesses_detected[:4]:
            days = get_curriculum_days_for_topic(weakness) if weakness in QUESTION_BANK else []
            revision_plan.append({
                "topic": weakness,
                "curriculum_day": days[0] if days else 1,
                "priority": "high",
                "reason": f"Area identified for improvement during interview",
                "suggested_actions": [
                    f"Review materials for {weakness}",
                    "Practice explaining concepts in your own words",
                    "Build a small project applying these concepts",
                ],
            })

        grade = "A+" if overall >= 90 else "A" if overall >= 85 else "B+" if overall >= 78 else "B" if overall >= 70 else "C+" if overall >= 62 else "C" if overall >= 50 else "D"
        rec = ("Highly recommended — demonstrates strong AI engineering skills." if overall >= 80
               else "Recommended with minor areas for improvement." if overall >= 65
               else "Conditionally recommended — should strengthen weak areas before proceeding." if overall >= 50
               else "Needs further preparation before advancing.")

        diff_prog = [t["question"]["difficulty"] for t in self.turns if t.get("question")]

        turns_summary = [
            {
                "question": t["question"]["text"][:400],
                "answer": (t.get("answer") or "")[:600],
                "score": t.get("evaluation", {}).get("score") if t.get("evaluation") else None,
            }
            for t in answered_turns
        ]
        final_ai = self.adaptive.generate_final_analysis(turns_summary)
        if final_ai.get("overall_score"):
            overall = float(final_ai["overall_score"])
        if final_ai.get("strong_areas"):
            all_strengths = list(dict.fromkeys(all_strengths + final_ai["strong_areas"]))[:8]
        if final_ai.get("weak_areas"):
            all_gaps = list(dict.fromkeys(all_gaps + final_ai["weak_areas"]))[:8]

        dim_keys = {
            "Technical Knowledge": final_ai.get("technical_knowledge"),
            "Problem Solving": final_ai.get("problem_solving"),
            "Communication": final_ai.get("communication"),
            "Project Knowledge": final_ai.get("project_knowledge"),
            "CV Credibility & Consistency": final_ai.get("cv_credibility"),
            "Role Fit": final_ai.get("role_fit"),
        }
        for label, val in dim_keys.items():
            if val is not None and label in dims:
                score = max(0, min(100, float(val)))
                dims[label] = {
                    "score": round(score, 1),
                    "level": "Expert" if score >= 85 else "Proficient" if score >= 70 else "Developing" if score >= 50 else "Needs Work",
                    "details": final_ai.get("cv_credibility_summary") or dims[label].get("details", ""),
                }

        rec = final_ai.get("hiring_recommendation") or rec

        return {
            "interview_id": self.session_id,
            "candidate_name": candidate_name,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "duration_minutes": max(5, len(answered_turns) * 3 + len(skipped_turns)),
            "overall_score": round(overall, 1),
            "grade": grade,
            "questions_answered": len(answered_turns),
            "questions_skipped": len(skipped_turns),
            "categories": {**cat_scores, **dims},
            "strengths": all_strengths,
            "areas_for_improvement": all_gaps,
            "interview_insights": insights,
            "revision_plan": revision_plan,
            "topic_breakdown": {
                t: round(
                    sum(x["evaluation"]["score"] for x in answered_turns if t.lower() in x["question"].get("topic", "").lower()) / 
                    max(1, len([x for x in answered_turns if t.lower() in x["question"].get("topic", "").lower()])),
                    1
                ) for t in self.topics_covered
            },
            "difficulty_progression": diff_prog,
            "recommendation": rec,
            "detailed_analysis": final_ai,
        }

    def _session_state(self) -> dict:
        """Get current interview state."""
        current_q = None
        if self.turns:
            last = self.turns[-1]
            if not last["answer"] and not last["skipped"]:
                current_q = last["question"]

        answered = len([t for t in self.turns if t["answer"] or t["skipped"]])
        num_q = self.config.get("num_questions", 10)
        
        interview_complete = (
            answered >= num_q and current_q is None
        )

        return {
            "session_id": self.session_id,
            "status": self.status,
            "current_question": current_q,
            "current_question_number": answered + (1 if current_q else 0),
            "total_questions": max(num_q, answered + (1 if current_q else 0)),
            "current_difficulty": self.current_difficulty,
            "topics_covered": self.topics_covered,
            "days_covered": self.days_covered,
            "progress_percent": min(95, round((answered / max(1, num_q)) * 100)),
            "last_evaluation": next((t["evaluation"] for t in reversed(self.turns) if t["evaluation"]), None),
            "interview_complete": interview_complete,
            "interview_stage": self.interview_context["current_stage"],
            "conversation_context": {
                "topics_discussed": self.interview_context["topics_discussed"],
                "questions_count": self.interview_context["questions_count"],
            }
        }
