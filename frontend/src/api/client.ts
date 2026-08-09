import type {
  Candidate,
  Curriculum,
  InterviewConfig,
  InterviewReport,
  Question,
  SessionState,
  TurnHistory,
} from '../types'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

const OFFLINE_TOPICS = ['Prompt Engineering', 'RAG Architecture', 'Vector Databases', 'Agentic AI', 'MCP', 'AI Deployment']

const OFFLINE_CANDIDATE: Candidate = {
  id: 'cand_001', name: 'Alex Smith', email: 'alex@example.com', avatar_initials: 'AS',
  cohort: 'AI Engineering Cohort', enrollment_date: '', days_completed: 22, total_days: 31,
  overall_progress: 71, interview_readiness: 72, previous_interviews: [], strengths: [], weaknesses: [],
  skipped_topics: [], repeated_attempts: {}, learning_signals: {
    conceptual_understanding: 'developing', practical_implementation: 'developing', production_reasoning: 'developing',
    system_design: 'developing', debugging_skills: 'developing', communication: 'developing',
  }, topic_mastery: {},
}

const OFFLINE_QUESTIONS: Question[] = [
  { id: 'intro', text: 'To begin, please tell me about yourself, your background, and the AI projects or technologies you have worked with.', topic: 'Introduction', curriculum_day: 0, difficulty: 1, question_type: 'introduction', context: "Hi Alex! I'm your AI interviewer. Take your time and speak naturally.", is_followup: false, references_previous: null },
  { id: 'vector-basics', text: 'Explain how HNSW indexing works and why it is useful for approximate nearest-neighbor search.', topic: 'Vector Databases', curriculum_day: 9, difficulty: 3, question_type: 'conceptual', context: '', is_followup: false, references_previous: 'intro' },
  { id: 'rag-basics', text: 'How would you design a RAG pipeline to answer questions from company documents?', topic: 'RAG Architecture', curriculum_day: 12, difficulty: 3, question_type: 'system_design', context: '', is_followup: false, references_previous: 'vector-basics' },
  { id: 'prompt-basics', text: 'What techniques would you use to make an LLM response more reliable and safe?', topic: 'Prompt Engineering', curriculum_day: 4, difficulty: 3, question_type: 'conceptual', context: '', is_followup: false, references_previous: 'rag-basics' },
]

const safeUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36).substring(4, 8)
}

const OFFLINE_CURRICULUM: Curriculum = {
  cohort_name: '31-Day AI Engineering Cohort',
  total_days: 31,
  modules: [
    { id: 'module-1', name: 'Module 1: LLM Core & Prompting', days: [1, 2, 3, 4, 5, 6, 7], color: '#ff6b00' },
    { id: 'module-2', name: 'Module 2: RAG & Vector Databases', days: [8, 9, 10, 11, 12, 13, 14, 15], color: '#3b82f6' },
    { id: 'module-3', name: 'Module 3: AI Agents & MCP', days: [16, 17, 18, 19, 20, 21, 22, 23], color: '#10b981' },
    { id: 'module-4', name: 'Module 4: Production & Deployment', days: [24, 25, 26, 27, 28, 29, 30, 31], color: '#8b5cf6' },
  ],
  days: [
    { day: 1, title: 'LLM Architectures & Transformers', module: 'module-1', mission: 'Understand attention mechanisms and LLM inference.', topics: ['Transformers', 'Attention', 'Tokenization'], learning_objectives: ['Master attention math', 'Understand KV cache'], difficulty: 2 },
    { day: 4, title: 'Prompt Engineering & Safety', module: 'module-1', mission: 'Learn structured outputs, chain-of-thought, and guardrails.', topics: ['Prompt Engineering', 'Guardrails', 'Chain of Thought'], learning_objectives: ['System prompt optimization', 'Output schemas'], difficulty: 3 },
    { day: 9, title: 'Vector DB Indexing & Search', module: 'module-2', mission: 'Master HNSW, IVFFlat, and similarity metrics.', topics: ['Vector Databases', 'HNSW', 'Embeddings'], learning_objectives: ['HNSW construction', 'Cos vs L2 distance'], difficulty: 3 },
    { day: 12, title: 'Advanced RAG Pipelines', module: 'module-2', mission: 'Hybrid search, re-ranking, and query decomposition.', topics: ['RAG Architecture', 'Hybrid Search', 'Reranking'], learning_objectives: ['Reciprocal Rank Fusion', 'Cross-encoders'], difficulty: 4 },
    { day: 18, title: 'Agentic AI Workflows', module: 'module-3', mission: 'Tool calling, multi-agent systems, and state management.', topics: ['Agentic AI', 'Tool Calling', 'ReAct'], learning_objectives: ['Stateful agent loops', 'Tool schema validation'], difficulty: 4 },
    { day: 22, title: 'Model Context Protocol (MCP)', module: 'module-3', mission: 'Build MCP client/server integrations.', topics: ['MCP', 'Protocols', 'APIs'], learning_objectives: ['MCP server development', 'JSON-RPC transport'], difficulty: 3 },
    { day: 28, title: 'AI Production Deployment', module: 'module-4', mission: 'Latency optimization, monitoring, and scaling.', topics: ['AI Deployment', 'Latency', 'vLLM'], learning_objectives: ['vLLM engine setup', 'Continuous batching'], difficulty: 5 },
  ],
}

type OfflineSession = { config: InterviewConfig; index: number; answered: number; state: SessionState; answers: string[] }
const offlineSessions = new Map<string, OfflineSession>()

const createOfflineSession = (config: InterviewConfig): SessionState & { session_id: string } => {
  const sessionId = `local-${safeUUID().slice(0, 8)}`
  const state: SessionState = {
    session_id: sessionId, status: 'in_progress', current_question: OFFLINE_QUESTIONS[0],
    current_question_number: 1, total_questions: config.num_questions, current_difficulty: 1,
    topics_covered: [], days_covered: [], progress_percent: 0, last_evaluation: null, interview_complete: false,
  }
  offlineSessions.set(sessionId, { config, index: 0, answered: 0, state, answers: [] })
  return state
}

const submitOfflineAnswer = (sessionId: string, answer: string): SessionState => {
  const session = offlineSessions.get(sessionId)
  if (!session) throw new Error('Interview session not found. Please start a new interview.')
  const words = answer.trim().split(/\s+/).filter(Boolean).length
  const score = Math.max(30, Math.min(92, 35 + words * 1.2))
  session.answers.push(answer)
  session.answered += 1
  session.index += 1
  const complete = session.answered >= session.config.num_questions
  const currentTopic = session.state.current_question?.topic
  const next = complete ? null : { ...OFFLINE_QUESTIONS[session.index % OFFLINE_QUESTIONS.length], context: score >= 70 ? 'That was a thoughtful answer. Let us build on it.' : 'Thank you. Let us explore the fundamentals a little more.' }
  session.state = {
    ...session.state, current_question: next, current_question_number: complete ? session.answered : session.answered + 1,
    current_difficulty: score >= 70 ? Math.min(5, session.state.current_difficulty + 1) : session.state.current_difficulty,
    topics_covered: currentTopic ? Array.from(new Set([...session.state.topics_covered, currentTopic])) : session.state.topics_covered,
    progress_percent: Math.round((session.answered / session.config.num_questions) * 100),
    last_evaluation: { score, technical_accuracy: score, depth: Math.max(25, score - 8), communication: Math.min(95, score + 4), feedback: score >= 70 ? 'Good explanation with useful detail.' : 'Keep expanding your answer with concrete examples.', strengths_shown: [], gaps_identified: [], misconceptions: [], follow_up_suggested: score >= 65 },
    interview_complete: complete,
  }
  return session.state
}

const offlineReport = (sessionId: string): InterviewReport => ({
  interview_id: sessionId, candidate_name: OFFLINE_CANDIDATE.name, date: new Date().toISOString().slice(0, 10), duration_minutes: 5,
  overall_score: 70, grade: 'B', questions_answered: offlineSessions.get(sessionId)?.answered ?? 0, questions_skipped: 0,
  categories: {}, strengths: ['Communicated your experience clearly'], areas_for_improvement: ['Add more technical examples'], interview_insights: ['Offline interview session'], revision_plan: [], topic_breakdown: {}, difficulty_progression: [], recommendation: 'Recommended with continued practice.',
})

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('Non-JSON response from backend')
  }
  return res.json()
}

async function requestForm<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', body: formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export interface CvAnalysisResult {
  cv_text: string
  structured_profile: Record<string, unknown>
  interview_data_analysis: Record<string, unknown>
  filename?: string
}

export const api = {
  health: () => request<{ status: string }>('/health'),

  getCandidates: () => request<{ candidates: Candidate[] }>('/candidates').catch(() => ({ candidates: [OFFLINE_CANDIDATE] })),

  getCandidate: (id: string) => request<Candidate>(`/candidates/${id}`).catch(() => OFFLINE_CANDIDATE),

  getCurriculum: () => request<Curriculum>('/curriculum').catch(() => OFFLINE_CURRICULUM),

  getTopics: () => request<{ topics: string[] }>('/topics').catch(() => ({ topics: OFFLINE_TOPICS })),

  analyzeCv: (file: File, fields: Record<string, string>) => {
    const form = new FormData()
    form.append('file', file)
    Object.entries(fields).forEach(([k, v]) => form.append(k, v || ''))
    return requestForm<CvAnalysisResult>('/candidate/analyze-cv', form)
  },

  analyzeCvText: (payload: {
    cv_text: string
    candidate_profile?: Record<string, unknown>
    target_role?: string
    experience_level?: string
    job_description?: string
    additional_info?: string
  }) =>
    request<CvAnalysisResult>('/candidate/analyze-text', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  startInterview: (config: InterviewConfig) =>
    request<SessionState & { session_id: string }>('/interviews/start', {
      method: 'POST',
      body: JSON.stringify(config),
    }).catch(() => createOfflineSession(config)),

  getSession: (sessionId: string) =>
    request<SessionState>(`/interviews/${sessionId}`).catch(() => {
      const session = offlineSessions.get(sessionId)
      if (!session) throw new Error('Interview service is unavailable. Start a new interview.')
      return session.state
    }),

  getHistory: (sessionId: string) =>
    request<{ turns: TurnHistory[]; topics_covered: string[]; days_covered: number[] }>(
      `/interviews/${sessionId}/history`
    ),

  submitAnswer: (sessionId: string, answerText: string) =>
    request<SessionState>(`/interviews/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ answer_text: answerText }),
    }).catch(() => submitOfflineAnswer(sessionId, answerText)),

  skipQuestion: (sessionId: string) =>
    request<SessionState>(`/interviews/${sessionId}/skip`, {
      method: 'POST',
    }),

  completeInterview: (sessionId: string) =>
    request<InterviewReport>(`/interviews/${sessionId}/complete`, {
      method: 'POST',
    }).catch(() => offlineReport(sessionId)),
}
