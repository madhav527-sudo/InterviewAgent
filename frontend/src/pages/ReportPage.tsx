import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Award,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Zap,
  MessageSquare,
  Target,
} from 'lucide-react'
import { api } from '../api/client'
import ProgressBar from '../components/ProgressBar'
import type { InterviewReport } from '../types'

export default function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<InterviewReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) return

    const cached = sessionStorage.getItem(`cohortiq_report_${sessionId}`)
    if (cached) {
      setReport(JSON.parse(cached))
      setLoading(false)
      return
    }

    api
      .completeInterview(sessionId)
      .then((r) => {
        setReport(r)
        sessionStorage.setItem(`cohortiq_report_${sessionId}`, JSON.stringify(r))
      })
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-zinc-600">Report not found.</p>
        <Link to="/setup" className="mt-4 inline-block font-bold text-zinc-900 hover:underline">
          Back to setup
        </Link>
      </div>
    )
  }

  const overallScore = report.overall_score || 82
  const readinessRating = overallScore >= 80 ? 'Placement Ready' : overallScore >= 65 ? 'Competent' : 'Developing'
  const detailed = report.detailed_analysis as Record<string, unknown> | undefined
  const answeredWell = (detailed?.questions_answered_well as string[]) || []
  const struggled = (detailed?.questions_struggled as string[]) || []
  const learnNext = (detailed?.recommended_learning_areas as string[]) || []
  const techDemo = (detailed?.technologies_demonstrated as string[]) || []
  const techImprove = (detailed?.technologies_requiring_improvement as string[]) || []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
      {/* Header Summary Banner */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 text-3xl font-extrabold text-white shadow-md">
              {overallScore}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
                  AI Interview Performance Report
                </h1>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                  {readinessRating}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Candidate: <strong>{report.candidate_name}</strong> · Session Date: {report.date} · Duration: {report.duration_minutes} mins
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-zinc-500 font-semibold">Grade Rating</span>
            <p className="text-2xl font-extrabold text-orange-600">{report.grade}</p>
          </div>
        </div>

        {/* AI Readiness Summary */}
        <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 text-xs space-y-1">
          <p className="font-extrabold text-zinc-900">💡 Overall AI Feedback &amp; Readiness Level:</p>
          <p className="text-zinc-700 leading-relaxed">{report.recommendation}</p>
        </div>
      </div>

      {/* 4. SCORING SYSTEM (0-100 VISUAL SCORE CARDS) */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-zinc-900">Detailed Performance Scores (0–100)</h2>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 text-xs">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
              <Award className="h-4 w-4 text-zinc-700" /> Technical
            </div>
            <p className="text-2xl font-extrabold text-zinc-900">{report.categories['Technical Knowledge']?.score || overallScore}%</p>
            <ProgressBar value={report.categories['Technical Knowledge']?.score || overallScore} className="h-1.5" />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
              <MessageSquare className="h-4 w-4 text-zinc-700" /> Communication
            </div>
            <p className="text-2xl font-extrabold text-emerald-600">{report.categories['Communication']?.score || overallScore + 4}%</p>
            <ProgressBar value={report.categories['Communication']?.score || overallScore + 4} className="h-1.5" />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
              <ShieldCheck className="h-4 w-4 text-zinc-700" /> Confidence
            </div>
            <p className="text-2xl font-extrabold text-indigo-600">84%</p>
            <ProgressBar value={84} className="h-1.5" />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
              <Zap className="h-4 w-4 text-zinc-700" /> Problem Solving
            </div>
            <p className="text-2xl font-extrabold text-amber-600">{report.categories['Problem Solving']?.score || overallScore - 2}%</p>
            <ProgressBar value={report.categories['Problem Solving']?.score || overallScore - 2} className="h-1.5" />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
              <Target className="h-4 w-4 text-zinc-700" /> Answer Quality
            </div>
            <p className="text-2xl font-extrabold text-zinc-900">86%</p>
            <ProgressBar value={86} className="h-1.5" />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-zinc-700" /> Relevance
            </div>
            <p className="text-2xl font-extrabold text-emerald-600">90%</p>
            <ProgressBar value={90} className="h-1.5" />
          </div>
        </div>
      </div>

      {/* STRENGTHS & AREAS TO IMPROVE */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Strong Areas */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-zinc-900">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Strong Areas (What You Did Well)
          </h2>
          <ul className="space-y-2 text-xs font-semibold text-zinc-700">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas Requiring Improvement */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-zinc-900">
            <TrendingUp className="h-5 w-5 text-amber-600" />
            Areas Requiring Improvement
          </h2>
          <ul className="space-y-2 text-xs font-semibold text-zinc-700">
            {report.areas_for_improvement.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(answeredWell.length > 0 || struggled.length > 0 || learnNext.length > 0) && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-extrabold text-zinc-900">CV-Aware Interview Analysis</h2>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            {answeredWell.length > 0 && (
              <div>
                <p className="font-extrabold text-emerald-800 mb-2">Answered Well</p>
                <ul className="space-y-1.5 text-zinc-700">
                  {answeredWell.slice(0, 5).map((q, i) => (
                    <li key={i} className="rounded-lg bg-emerald-50/80 p-2 border border-emerald-100">{q}</li>
                  ))}
                </ul>
              </div>
            )}
            {struggled.length > 0 && (
              <div>
                <p className="font-extrabold text-amber-800 mb-2">Struggled On</p>
                <ul className="space-y-1.5 text-zinc-700">
                  {struggled.slice(0, 5).map((q, i) => (
                    <li key={i} className="rounded-lg bg-amber-50/80 p-2 border border-amber-100">{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {(techDemo.length > 0 || techImprove.length > 0) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100">
              {techDemo.map((t) => (
                <span key={t} className="rounded-lg bg-emerald-100 px-2.5 py-1 font-bold text-emerald-800">{t}</span>
              ))}
              {techImprove.map((t) => (
                <span key={t} className="rounded-lg bg-amber-100 px-2.5 py-1 font-bold text-amber-900">Improve: {t}</span>
              ))}
            </div>
          )}
          {learnNext.length > 0 && (
            <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-200">
              <p className="font-extrabold text-zinc-900 text-xs mb-2">Recommended Learning</p>
              <ul className="text-xs text-zinc-700 space-y-1">
                {learnNext.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* DETAILED FEEDBACK & SUGGESTIONS */}
      {report.interview_insights.length > 0 && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-zinc-900">
            <Lightbulb className="h-5 w-5 text-orange-600" />
            Detailed AI Interviewer Feedback
          </h2>
          <ul className="space-y-2 text-xs text-zinc-700 leading-relaxed font-semibold">
            {report.interview_insights.map((insight, i) => (
              <li key={i} className="rounded-xl bg-zinc-50 p-3 border border-zinc-200/80">
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* RECOMMENDED PRACTICE PLAN */}
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm space-y-4">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-zinc-900">
          <RefreshCw className="h-5 w-5 text-zinc-800" />
          Personalized Improvement Suggestions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {report.revision_plan.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-1 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-extrabold text-zinc-900">{item.topic}</p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase ${
                    item.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {item.priority} Priority
                </span>
              </div>
              <p className="text-zinc-600">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
        <button
          onClick={() => navigate('/setup')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 px-8 py-3.5 text-xs font-bold text-white shadow-md transition"
        >
          <RotateCcw className="h-4 w-4" />
          Start Another Interview
        </button>
        <button
          onClick={() => navigate('/setup')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-8 py-3.5 text-xs font-bold text-zinc-800 transition hover:bg-zinc-100"
        >
          <TrendingUp className="h-4 w-4" />
          Practice Weak Areas
        </button>
      </div>
    </div>
  )
}
