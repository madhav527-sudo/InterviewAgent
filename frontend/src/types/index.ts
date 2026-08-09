export interface Candidate {
  id: string
  name: string
  email: string
  avatar_initials: string
  cohort: string
  enrollment_date?: string
  days_completed: number
  total_days: number
  overall_progress: number
  interview_readiness: number
  previous_interviews: PreviousInterview[]
  strengths: string[]
  weaknesses: string[]
  skipped_topics: string[]
  repeated_attempts: Record<string, number>
  learning_signals: LearningSignals
  topic_mastery: Record<string, TopicMastery>
  daily_progress?: Record<string, DayProgress>
}

export interface PreviousInterview {
  id: string
  date: string
  score: number
  topics_covered: string[]
  status: string
}

export interface LearningSignals {
  conceptual_understanding: string
  practical_implementation: string
  production_reasoning: string
  system_design: string
  debugging_skills: string
  communication: string
}

export interface TopicMastery {
  level: string
  score: number
  status: string
}

export interface DayProgress {
  status: string
  score: number | null
}

export interface CurriculumDay {
  day: number
  title: string
  module: string
  topics: string[]
  learning_objectives: string[]
  difficulty: number
  mission: string
}

export interface CurriculumModule {
  id: string
  name: string
  days: number[]
  color: string
}

export interface Curriculum {
  cohort_name: string
  total_days: number
  modules: CurriculumModule[]
  days: CurriculumDay[]
}

export interface Question {
  id: string
  text: string
  topic: string
  curriculum_day: number
  difficulty: number
  question_type: string
  context: string
  is_followup: boolean
  references_previous: string | null
}

export interface InterviewConfig {
  candidate_id: string
  interview_type: string
  difficulty: string
  num_questions: number
  selected_topics: string[]
  auto_select_topics: boolean
  candidate_profile?: Record<string, any>
  job_description?: string
  cv_text?: string
  structured_profile?: Record<string, unknown>
  additional_info?: string
  target_role?: string
  experience_level?: string
  interviewer_style?: string
  user_expectations?: string[]
  focus_areas?: string[]
  custom_notes?: string
  interview_goal?: string
}

export interface SessionState {
  session_id: string
  status: string
  current_question: Question | null
  current_question_number: number
  total_questions: number
  current_difficulty: number
  topics_covered: string[]
  days_covered: number[]
  progress_percent: number
  last_evaluation: Evaluation | null
  interview_complete: boolean
}

export interface Evaluation {
  score: number
  technical_accuracy: number
  depth: number
  communication: number
  feedback: string
  strengths_shown: string[]
  gaps_identified: string[]
  misconceptions: string[]
  follow_up_suggested: boolean
}

export interface CategoryScore {
  score: number
  level: string
  details: string
}

export interface RevisionItem {
  topic: string
  curriculum_day: number
  priority: string
  reason: string
  suggested_actions: string[]
}

export interface InterviewReport {
  interview_id: string
  candidate_name: string
  date: string
  duration_minutes: number
  overall_score: number
  grade: string
  questions_answered: number
  questions_skipped: number
  categories: Record<string, CategoryScore>
  strengths: string[]
  areas_for_improvement: string[]
  interview_insights: string[]
  revision_plan: RevisionItem[]
  topic_breakdown: Record<string, number>
  difficulty_progression: number[]
  recommendation: string
  detailed_analysis?: Record<string, unknown>
}

export interface TurnHistory {
  question: Question
  answer: string | null
  skipped: boolean
  is_followup: boolean
}
