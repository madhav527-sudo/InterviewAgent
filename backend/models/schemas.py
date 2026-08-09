from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
import uuid


class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    EXPERT = "expert"


class QuestionType(str, Enum):
    CONCEPTUAL = "conceptual"
    PRACTICAL = "practical"
    SYSTEM_DESIGN = "system_design"
    DEBUGGING = "debugging"
    SCENARIO = "scenario"


class TopicStatus(str, Enum):
    MASTERED = "mastered"
    PROFICIENT = "proficient"
    NEEDS_PRACTICE = "needs_practice"
    NEEDS_REVISION = "needs_revision"
    SKIPPED = "skipped"
    NOT_STARTED = "not_started"


class InterviewStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class LearningSignal(BaseModel):
    conceptual_understanding: str = "moderate"
    practical_implementation: str = "moderate"
    production_reasoning: str = "moderate"
    system_design: str = "moderate"
    debugging_skills: str = "moderate"
    communication: str = "moderate"


class TopicMastery(BaseModel):
    level: str
    score: int
    status: TopicStatus


class CandidateProfile(BaseModel):
    id: str
    name: str
    email: str
    avatar_initials: str
    cohort: str
    days_completed: int
    total_days: int
    overall_progress: int
    interview_readiness: int
    strengths: list[str]
    weaknesses: list[str]
    skipped_topics: list[str]
    repeated_attempts: dict[str, int]
    learning_signals: LearningSignal
    topic_mastery: dict[str, TopicMastery]


class InterviewConfig(BaseModel):
    candidate_id: str
    interview_type: str = "comprehensive"
    difficulty: str = "adaptive"
    num_questions: int = Field(default=10, ge=8, le=15)
    selected_topics: list[str] = []
    auto_select_topics: bool = True


class Question(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    text: str
    topic: str
    curriculum_day: int
    difficulty: int = Field(ge=1, le=5)
    question_type: QuestionType
    context: str = ""
    is_followup: bool = False
    references_previous: Optional[str] = None


class AnswerEvaluation(BaseModel):
    score: float = Field(ge=0, le=100)
    technical_accuracy: float = Field(ge=0, le=100)
    depth: float = Field(ge=0, le=100)
    communication: float = Field(ge=0, le=100)
    feedback: str
    strengths_shown: list[str] = []
    gaps_identified: list[str] = []
    misconceptions: list[str] = []
    follow_up_suggested: bool = False


class AnswerSubmission(BaseModel):
    answer_text: str


class InterviewTurn(BaseModel):
    question: Question
    answer: Optional[str] = None
    evaluation: Optional[AnswerEvaluation] = None
    skipped: bool = False
    timestamp: Optional[str] = None


class InterviewSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:12])
    candidate_id: str
    status: InterviewStatus = InterviewStatus.IN_PROGRESS
    config: InterviewConfig
    turns: list[InterviewTurn] = []
    current_question_index: int = 0
    current_difficulty: int = 3
    topics_covered: list[str] = []
    days_covered: list[int] = []
    strengths_detected: list[str] = []
    weaknesses_detected: list[str] = []
    contradictions: list[str] = []
    overall_trajectory: str = "stable"


class CategoryScore(BaseModel):
    score: float
    level: str
    details: str


class RevisionItem(BaseModel):
    topic: str
    curriculum_day: int
    priority: str
    reason: str
    suggested_actions: list[str]


class InterviewReport(BaseModel):
    interview_id: str
    candidate_name: str
    date: str
    duration_minutes: int
    overall_score: float
    grade: str
    questions_answered: int
    questions_skipped: int
    categories: dict[str, CategoryScore]
    strengths: list[str]
    areas_for_improvement: list[str]
    interview_insights: list[str]
    revision_plan: list[RevisionItem]
    topic_breakdown: dict[str, float]
    difficulty_progression: list[int]
    recommendation: str
