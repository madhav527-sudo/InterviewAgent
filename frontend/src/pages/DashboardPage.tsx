import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  FileText,
  Target,
  TrendingUp,
  BookOpen,
  Briefcase,
  ArrowRight,
  AlertTriangle,
  Clock,
  Zap,
  Upload,
} from 'lucide-react'

interface UserProfile {
  fullName?: string
  college?: string
  degree?: string
  branch?: string
  yearSemester?: string
  experienceLevel?: string
  skills?: string
  targetRole?: string
  preferredCompany?: string
  hasResume?: boolean
}

export default function DashboardPage() {
  const [profile] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('cohortiq_candidate_profile')
    if (stored) {
      try {
        const p = JSON.parse(stored)
        if (p && (p.fullName || p.targetRole || p.skills)) return p
      } catch { /* ignore */ }
    }
    return null
  })

  const skillsList = profile?.skills?.split(',').map(s => s.trim()).filter(Boolean) || []
  const targetRole = profile?.targetRole || 'Not provided'
  const experience = profile?.experienceLevel || 'Not provided'

  if (!profile) {
    return (
      <div className="min-h-screen bg-white text-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Upload className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome to CohortIQ</h1>
          <p className="text-sm text-zinc-600 max-w-md mx-auto">
            Upload your resume to unlock your personalized AI career dashboard — skill gap analysis, learning roadmap, interview prep, and job matching.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all hover:scale-[1.02]"
          >
            Upload Resume & Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      {/* Header */}
      <div className="relative border-b border-zinc-100 bg-gradient-to-b from-orange-50/40 via-white to-white py-10 sm:py-12">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-gradient-to-tr from-orange-200/30 via-amber-100/20 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-extrabold text-orange-700 uppercase tracking-wide mb-3">
                <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
                AI CAREER DASHBOARD
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                {profile.fullName ? `Welcome back, ${profile.fullName}` : 'Your Career Dashboard'}
              </h1>
              <p className="mt-2 text-sm text-zinc-600">Your personalized AI career intelligence workspace.</p>
            </div>
            <Link
              to="/setup"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02]"
            >
              Start AI Interview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 space-y-10">
        {/* Quick Stats Row */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold mb-2">
              <FileText className="h-4 w-4" /> Resume Status
            </div>
            <p className="text-lg font-extrabold text-emerald-600">{profile.hasResume ? '✓ Uploaded' : 'Not uploaded'}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold mb-2">
              <Target className="h-4 w-4" /> Target Role
            </div>
            <p className="text-sm font-extrabold text-zinc-900">{targetRole}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold mb-2">
              <Briefcase className="h-4 w-4" /> Experience
            </div>
            <p className="text-sm font-extrabold text-zinc-900">{experience}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold mb-2">
              <Zap className="h-4 w-4" /> Skills
            </div>
            <p className="text-sm font-extrabold text-orange-600">{skillsList.length > 0 ? `${skillsList.length} skills` : 'Not provided'}</p>
          </div>
        </div>

        {/* Two Column: AI Recommendations + Skill Gap */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* AI Recommendations */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-zinc-900">
              <Sparkles className="h-5 w-5 text-orange-500" /> AI Career Recommendations
            </h2>
            <div className="text-xs text-zinc-500 rounded-xl bg-zinc-50 border border-zinc-200/80 p-3 space-y-0.5">
              <p className="font-semibold">Based on: ✓ Your Resume · ✓ Target Role · ✓ Skills</p>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-zinc-700">
              {targetRole !== 'Not provided' && (
                <li className="flex items-start gap-2 rounded-xl bg-orange-50/60 border border-orange-200/60 p-3">
                  <ArrowRight className="h-3.5 w-3.5 text-orange-500 mt-0.5 shrink-0" />
                  Practice {targetRole} interview questions on CohortIQ
                </li>
              )}
              <li className="flex items-start gap-2 rounded-xl bg-zinc-50 border border-zinc-200/60 p-3">
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500 mt-0.5 shrink-0" />
                Improve resume bullet points with measurable impact
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-zinc-50 border border-zinc-200/60 p-3">
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500 mt-0.5 shrink-0" />
                Build one end-to-end project showcasing your strongest skills
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-zinc-50 border border-zinc-200/60 p-3">
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500 mt-0.5 shrink-0" />
                Complete your AI Resume analysis for skill gap insights
              </li>
            </ul>
          </div>

          {/* Skill Gap Preview */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-zinc-900">
              <TrendingUp className="h-5 w-5 text-amber-600" /> Skill Gap Overview
            </h2>
            {skillsList.length > 0 ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 mb-1.5">Your Current Skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsList.slice(0, 8).map(s => (
                      <span key={s} className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-3">
                  <p className="text-xs font-semibold text-zinc-500 mb-1.5">Commonly needed for {targetRole}:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-800">⚠ System Design</span>
                    <span className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-800">⚠ Testing</span>
                    <span className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-800">✕ CI/CD</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 italic">AI assessment — not verified market data</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-orange-50/60 border border-orange-200 p-4 text-center text-xs space-y-2">
                <AlertTriangle className="mx-auto h-6 w-6 text-orange-500" />
                <p className="font-bold text-zinc-900">Skills not provided</p>
                <p className="text-zinc-600">Complete your AI Resume analysis to see your skill gap.</p>
                <Link to="/profile" className="inline-flex items-center gap-1 rounded-xl bg-orange-500 px-4 py-2 font-bold text-white shadow hover:bg-orange-600 mt-1">
                  Go to AI Resume <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 90-Day Roadmap Preview */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-zinc-900">
              <BookOpen className="h-5 w-5 text-indigo-600" /> Your 90-Day Career Roadmap
            </h2>
            <Link to="/profile" className="text-xs font-bold text-orange-600 hover:underline">View Full Roadmap →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-orange-50/60 border border-orange-200 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-extrabold text-orange-900">Days 0–30: Foundation</span>
              </div>
              <p className="text-xs text-zinc-700 font-semibold">Build core skills for your target role. Focus on fundamentals.</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-600" />
                <span className="text-xs font-extrabold text-zinc-700">Days 31–60: Skill Building</span>
              </div>
              <p className="text-xs text-zinc-700 font-semibold">Intermediate projects, problem solving, interview prep.</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-600" />
                <span className="text-xs font-extrabold text-zinc-700">Days 61–90: Job Readiness</span>
              </div>
              <p className="text-xs text-zinc-700 font-semibold">Mock interviews, resume polish, applications.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <Link to="/profile" className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center space-y-2">
            <FileText className="mx-auto h-6 w-6 text-orange-500" />
            <p className="text-xs font-extrabold text-zinc-900">AI Resume Analysis</p>
          </Link>
          <Link to="/setup" className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center space-y-2">
            <Target className="mx-auto h-6 w-6 text-indigo-500" />
            <p className="text-xs font-extrabold text-zinc-900">Practice Interview</p>
          </Link>
          <Link to="/profile" className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center space-y-2">
            <TrendingUp className="mx-auto h-6 w-6 text-emerald-500" />
            <p className="text-xs font-extrabold text-zinc-900">Skill Gap Analysis</p>
          </Link>
          <Link to="/profile" className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center space-y-2">
            <Briefcase className="mx-auto h-6 w-6 text-amber-500" />
            <p className="text-xs font-extrabold text-zinc-900">Job Matching</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
