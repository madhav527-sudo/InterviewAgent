import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  BookOpen,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  SkipForward,
} from 'lucide-react'
import { api } from '../api/client'
import ProgressBar from '../components/ProgressBar'
import type { Question, SessionState } from '../types'

const difficultyLabels = ['', 'Easy', 'Easy', 'Medium', 'Hard', 'Expert']

type BrowserSpeechRecognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((ev: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

interface ChatMessage {
  role: 'interviewer' | 'candidate'
  content: string
}

export default function LiveInterviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<SessionState | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addQuestionMessage = useCallback((q: Question, _num: number, includeIntro = false) => {
    const parts: ChatMessage[] = []
    if (q.context && includeIntro) {
      parts.push({ role: 'interviewer', content: q.context })
    }
    parts.push({
      role: 'interviewer',
      content: q.text,
    })
    setMessages((prev) => [...prev, ...parts])
  }, [])

  useEffect(() => {
    if (!sessionId) return
    let mounted = true
    api.getSession(sessionId).then((s) => {
      if (!mounted) return
      setSession(s)
      if (s.current_question) {
        addQuestionMessage(s.current_question, s.current_question_number, true)
      }
      if (s.interview_complete) {
        navigate(`/report/${sessionId}`)
      }
    })
    api.getHistory(sessionId).catch(() => {})
    return () => { mounted = false }
  }, [sessionId, navigate, addQuestionMessage])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const toggleVoiceInput = () => {
    const w = window as Window & {
      SpeechRecognition?: new () => BrowserSpeechRecognition
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition
    }
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Recognition) {
      setMessages((prev) => [
        ...prev,
        { role: 'interviewer', content: 'Voice input is not supported in this browser. Please type your answer.' },
      ])
      return
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop()
      setListening(false)
      return
    }

    const recognition = new Recognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim()
      if (transcript) setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript))
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  const handleSubmit = async () => {
    if (!sessionId || !answer.trim() || submitting) return
    setSubmitting(true)
    const userAnswer = answer.trim()
    setMessages((prev) => [...prev, { role: 'candidate', content: userAnswer }])
    setAnswer('')

    try {
      const result = await api.submitAnswer(sessionId, userAnswer)
      setSession(result)

      if (result.interview_complete) {
        const report = await api.completeInterview(sessionId)
        sessionStorage.setItem(`cohortiq_report_${sessionId}`, JSON.stringify(report))
        navigate(`/report/${sessionId}`)
      } else if (result.current_question) {
        addQuestionMessage(result.current_question, result.current_question_number)
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'interviewer',
          content: 'Something went wrong. Please try submitting again.',
        },
      ])
    } finally {
      setSubmitting(false)
      textareaRef.current?.focus()
    }
  }

  const handleSkip = async () => {
    if (!sessionId || submitting) return
    setSubmitting(true)
    try {
      const result = await api.skipQuestion(sessionId)
      setSession(result)

      if (result.interview_complete) {
        const report = await api.completeInterview(sessionId)
        sessionStorage.setItem(`cohortiq_report_${sessionId}`, JSON.stringify(report))
        navigate(`/report/${sessionId}`)
      } else if (result.current_question) {
        addQuestionMessage(result.current_question, result.current_question_number)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  const upcomingCount = session.total_questions - session.current_question_number

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header bar */}
        <div className="border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Live Interview</p>
              <p className="text-sm font-medium text-zinc-900">
                Question {session.current_question_number} of {session.total_questions}
              </p>
            </div>
            {session.current_question && (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                  {session.current_question.topic}
                </span>
                <span className="hidden text-xs text-zinc-500 sm:inline">
                  Day {session.current_question.curriculum_day} ·{' '}
                  {difficultyLabels[session.current_difficulty] || 'Medium'}
                </span>
              </div>
            )}
          </div>
          <ProgressBar
            value={session.progress_percent}
            className="mt-3 h-1"
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`animate-fade-in flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'candidate'
                      ? 'bg-orange-500 text-white'
                      : 'border border-zinc-200 bg-white text-zinc-800 shadow-sm'
                  }`}
                >

                  {msg.content}
                </div>
              </div>
            ))}
            {submitting && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-4 py-3">
                  <span className="typing-dot h-2 w-2 rounded-full bg-zinc-400" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-zinc-400" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-zinc-400" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here... (Ctrl+Enter to submit)"
              rows={4}
              disabled={submitting || session.interview_complete}
              className="w-full resize-none rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
                >
                  <SkipForward className="h-4 w-4" />
                  Skip
                </button>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={submitting || session.interview_complete}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition disabled:opacity-50 ${
                    listening ? 'bg-red-100 text-red-700' : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {listening ? 'Stop' : 'Voice'}
                </button>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!answer.trim() || submitting}
                className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                Submit Answer
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full border-t border-zinc-200 bg-zinc-50 lg:w-80 lg:border-l lg:border-t-0">
        <div className="p-4 sm:p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <MessageSquare className="h-4 w-4" />
            Interview Progress
          </h3>

          <div className="mt-4 rounded-lg bg-orange-50 p-3 ring-1 ring-orange-200">
            <h4 className="text-xs font-medium uppercase tracking-wide text-orange-800">
              Interview Stage
            </h4>
            <div className="mt-1 text-sm font-semibold text-orange-900">
              {((session as any).interview_stage || 'In Progress').replace('_', ' ')}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Topics Covered
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {session.topics_covered.map((t) => (
                <span
                  key={t}
                  className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-600 ring-1 ring-zinc-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Curriculum Days
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {session.days_covered.map((d) => (
                <span
                  key={d}
                  className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-600 ring-1 ring-zinc-200"
                >
                  Day {d}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-3">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <BookOpen className="h-3.5 w-3.5" />
              {upcomingCount} questions remaining
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Scores are hidden during the interview
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
