import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Curriculum, Candidate } from '../types'

const statusStyles: Record<string, { bg: string; dot: string; label: string }> = {
  completed: { bg: 'border-emerald-200 bg-emerald-50/50', dot: 'bg-emerald-500', label: 'Completed' },
  in_progress: { bg: 'border-orange-200 bg-orange-50/50', dot: 'bg-orange-500', label: 'In Progress' },
  skipped: { bg: 'border-zinc-200 bg-zinc-50', dot: 'bg-zinc-400', label: 'Skipped' },
  not_started: { bg: 'border-zinc-100 bg-white', dot: 'bg-zinc-200', label: 'Not Started' },
}

export default function CurriculumPage() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getCurriculum(), api.getCandidate('cand_001')])
      .then(([cur, cand]) => {
        setCurriculum(cur)
        setCandidate(cand)
        setSelectedModule(cur.modules[0]?.id || null)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !curriculum || !candidate) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  const filteredDays = selectedModule
    ? curriculum.days.filter((d) => d.module === selectedModule)
    : curriculum.days

  const getDayStatus = (day: number) => {
    const progress = candidate.daily_progress?.[String(day)]
    return progress?.status || 'not_started'
  }

  const getDayScore = (day: number) => {
    const progress = candidate.daily_progress?.[String(day)]
    return progress?.score
  }

  const getSignalForDay = (day: Curriculum['days'][0]) => {
    const status = getDayStatus(day.day)
    if (status === 'skipped') return { text: 'Skipped', color: 'text-zinc-500' }
    const score = getDayScore(day.day)
    if (score !== null && score !== undefined) {
      if (score >= 80) return { text: 'Strong performance', color: 'text-emerald-600' }
      if (score >= 60) return { text: 'Needs practice', color: 'text-amber-600' }
      return { text: 'Needs revision', color: 'text-red-600' }
    }
    if (status === 'in_progress') return { text: 'In progress', color: 'text-orange-600' }
    return null
  }

  const repeatedTopics = Object.keys(candidate.repeated_attempts)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {curriculum.cohort_name}
        </h1>
        <p className="mt-1 text-zinc-600">
          31-day learning journey · {candidate.days_completed} days completed
        </p>
      </div>

      {/* Module tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {curriculum.modules.map((mod) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => setSelectedModule(mod.id)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              selectedModule === mod.id
                ? 'border-orange-300 bg-orange-50 text-orange-700'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
            }`}
          >
            {mod.name}
          </button>
        ))}
      </div>

      {/* Learning signals legend */}
      <div className="mt-6 flex flex-wrap gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-xs">
        <span className="font-medium text-zinc-700">Learning signals:</span>
        <span className="text-emerald-600">● Strong performance</span>
        <span className="text-amber-600">● Needs practice / repeated attempts</span>
        <span className="text-red-600">● Needs revision</span>
        <span className="text-zinc-500">● Skipped</span>
      </div>

      {/* Days grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDays.map((day) => {
          const status = getDayStatus(day.day)
          const style = statusStyles[status] || statusStyles.not_started
          const signal = getSignalForDay(day)
          const mod = curriculum.modules.find((m) => m.id === day.module)
          const hasRepeated = day.topics.some((t) =>
            repeatedTopics.some((rt) => t.toLowerCase().includes(rt.toLowerCase().split(' ')[0]))
          )

          return (
            <div
              key={day.day}
              className={`rounded-xl border p-5 transition hover:shadow-sm ${style.bg}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-zinc-500">Day {day.day}</span>
                  <h3 className="mt-1 font-semibold text-zinc-900">{day.title}</h3>
                </div>
                <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
              </div>

              <p className="mt-2 text-xs text-zinc-600 line-clamp-2">{day.mission}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {day.topics.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded bg-white/80 px-2 py-0.5 text-[10px] text-zinc-600"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                {signal && (
                  <span className={`font-medium ${signal.color}`}>{signal.text}</span>
                )}
                {getDayScore(day.day) !== null && getDayScore(day.day) !== undefined && (
                  <span className="text-zinc-500">{getDayScore(day.day)}%</span>
                )}
                {hasRepeated && (
                  <span className="text-amber-600">Repeated attempts</span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-1">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: mod?.color || '#ff6b00' }}
                />
                <span className="text-[10px] text-zinc-500">
                  Difficulty {day.difficulty}/5
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
