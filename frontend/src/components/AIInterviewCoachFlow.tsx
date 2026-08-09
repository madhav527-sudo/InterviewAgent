import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain,
  X,
  FileText,
  ArrowRight,
  Trash2,
  Edit3,
} from 'lucide-react'
import { api } from '../api/client'

interface AIInterviewCoachFlowProps {
  isOpen: boolean
  onClose: () => void
  initialSelectedType?: string
}

export interface CandidateProfile {
  fullName: string
  education: string
  college: string
  degree: string
  branch: string
  yearSemester: string
  experienceLevel: string
  skills: string
  targetRole: string
  preferredCompany: string
  hasResume: boolean
  projects: string
  certifications: string
}

const defaultProfile: CandidateProfile = {
  fullName: 'Alex Sharma',
  education: 'Undergraduate',
  college: 'IIT / NIT Campus',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering',
  yearSemester: '4th Year / 7th Sem',
  experienceLevel: 'Fresher (0–2 Years)',
  skills: 'C++, DSA, React, JavaScript, RAG Architecture',
  targetRole: 'Software Developer',
  preferredCompany: 'Google',
  hasResume: true,
  projects: 'AI Resume Builder & Mock Interview Platform',
  certifications: 'AWS Certified Cloud Practitioner',
}

const interviewTypes = [
  { id: 'technical', title: 'Technical', desc: 'Skills & Concepts', icon: '💻' },
  { id: 'coding', title: 'Coding & DSA', desc: 'Problem Solving', icon: '🧩' },
  { id: 'hr', title: 'HR', desc: 'Behavioral & Personality', icon: '💼' },
  { id: 'placement', title: 'Placement', desc: 'Campus Drive Prep', icon: '🎓' },
  { id: 'personalized', title: 'Personalized', desc: 'Resume & Goals', icon: '✨', isHighlight: true },
]

const focusChips = [
  'Technical',
  'DSA',
  'Projects',
  'Communication',
  'Confidence',
  'HR',
  'Problem Solving',
  'Resume',
]

const interviewerStyles = [
  { id: 'professional', label: 'Professional', desc: 'Real interview' },
  { id: 'challenging', label: 'Challenging', desc: 'Push my limits' },
  { id: 'supportive', label: 'Supportive', desc: 'Build confidence' },
  { id: 'ai_decides', label: '✨ AI Decides', desc: 'Optimal choice' },
]

export default function AIInterviewCoachFlow({
  isOpen,
  onClose,
  initialSelectedType = 'personalized',
}: AIInterviewCoachFlowProps) {
  const navigate = useNavigate()

  // Saved Profile State
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem('cohortiq_candidate_profile')
    return saved ? JSON.parse(saved) : defaultProfile
  })

  // Mode: 'setup' (main setup) | 'edit_profile' (profile editor)
  const [mode, setMode] = useState<'setup' | 'edit_profile'>('setup')
  const [profileStep, setProfileStep] = useState(1) // 1: Personal & Edu, 2: Skills & Role

  // Clear data confirmation popup state
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Selection states
  const [selectedType, setSelectedType] = useState(initialSelectedType)
  const [selectedGoal, setSelectedGoal] = useState('College Placement')
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    'Technical',
    'DSA',
    'Projects',
    'Communication',
  ])
  const [selectedStyle, setSelectedStyle] = useState('ai_decides')
  const [useResume, setUseResume] = useState(true)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [numQuestions, setNumQuestions] = useState(10)
  const [interviewMode, setInterviewMode] = useState<'video' | 'voice' | 'text'>('video')

  // Launching state
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialSelectedType) {
      setSelectedType(initialSelectedType)
    }
  }, [initialSelectedType])

  if (!isOpen) return null

  // Save profile edits to localStorage
  const handleSaveProfile = () => {
    localStorage.setItem('cohortiq_candidate_profile', JSON.stringify(profile))
    setMode('setup')
  }

  // Clear profile data cleanly
  const handleClearData = () => {
    localStorage.removeItem('cohortiq_candidate_profile')
    sessionStorage.removeItem('cohortiq_intent_config')
    setProfile({
      fullName: '',
      education: '',
      college: '',
      degree: '',
      branch: '',
      yearSemester: '',
      experienceLevel: 'Fresher (0–2 Years)',
      skills: '',
      targetRole: 'Software Developer',
      preferredCompany: '',
      hasResume: false,
      projects: '',
      certifications: '',
    })
    setShowClearConfirm(false)
    setMode('edit_profile')
    setProfileStep(1)
  }

  const toggleFocus = (chip: string) => {
    setSelectedFocus((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    )
  }

  const handleStartInterview = async () => {
    setStarting(true)
    setError('')
    try {
      const intentPayload = {
        candidate: profile,
        interview_type: selectedType,
        interview_goal: selectedGoal,
        target_role: profile.targetRole || 'Software Developer',
        experience_level: profile.experienceLevel,
        target_company: profile.preferredCompany,
        focus_areas: selectedFocus,
        interviewer_style: selectedStyle,
        use_resume: useResume,
      }

      sessionStorage.setItem('cohortiq_intent_config', JSON.stringify(intentPayload))

      const result = await api.startInterview({
        candidate_id: 'cand_001',
        interview_type: selectedType === 'personalized' ? 'comprehensive' : selectedType,
        difficulty: 'adaptive',
        num_questions: numQuestions,
        selected_topics: selectedFocus,
        auto_select_topics: true,
      })

      sessionStorage.setItem('cohortiq_session', result.session_id)

      if (interviewMode === 'video') {
        navigate(`/video-interview/${result.session_id}`)
      } else {
        navigate(`/interview/${result.session_id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start AI interview session')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto animate-fade-in">
      {/* ONE Centered Professional Modal Window */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-8 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-zinc-900">
                  {mode === 'edit_profile' ? 'Complete Your Interview Profile' : 'Set Up Your AI Interview'}
                </h2>
                {mode === 'setup' && profile.fullName && (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-700 border border-zinc-200">
                    ✓ Profile: {profile.fullName} ({profile.degree} {profile.branch})
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">
                {mode === 'edit_profile'
                  ? 'Tell AI about your background so questions are personalized'
                  : 'Choose your goal. AI will personalize the rest.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'setup' && (
              <button
                type="button"
                onClick={() => setMode('edit_profile')}
                className="flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-zinc-900 underline"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Profile
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* MODE: EDIT PROFILE CARD */}
        {mode === 'edit_profile' ? (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-2xl border border-zinc-200 text-xs font-bold">
              <span className={profileStep === 1 ? 'text-zinc-900' : 'text-zinc-400'}>1. Personal & Education</span>
              <span>→</span>
              <span className={profileStep === 2 ? 'text-zinc-900' : 'text-zinc-400'}>2. Skills, Projects & Target Role</span>
            </div>

            {profileStep === 1 ? (
              <div className="space-y-4 text-xs">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-zinc-800 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="e.g. Alex Sharma"
                      className="w-full rounded-xl border border-zinc-200 p-2.5 font-bold text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-800 mb-1">College / University</label>
                    <input
                      type="text"
                      value={profile.college}
                      onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                      placeholder="e.g. IIT Delhi"
                      className="w-full rounded-xl border border-zinc-200 p-2.5 font-bold text-zinc-900"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block font-bold text-zinc-800 mb-1">Degree</label>
                    <input
                      type="text"
                      value={profile.degree}
                      onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                      placeholder="e.g. B.Tech / M.Tech"
                      className="w-full rounded-xl border border-zinc-200 p-2.5 font-bold text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-800 mb-1">Branch / Specialization</label>
                    <input
                      type="text"
                      value={profile.branch}
                      onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                      placeholder="e.g. Computer Science"
                      className="w-full rounded-xl border border-zinc-200 p-2.5 font-bold text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-800 mb-1">Year / Semester</label>
                    <input
                      type="text"
                      value={profile.yearSemester}
                      onChange={(e) => setProfile({ ...profile, yearSemester: e.target.value })}
                      placeholder="e.g. 4th Year"
                      className="w-full rounded-xl border border-zinc-200 p-2.5 font-bold text-zinc-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setProfileStep(2)}
                    className="rounded-xl bg-zinc-900 px-6 py-2.5 font-bold text-white shadow hover:bg-zinc-800"
                  >
                    Next: Skills &amp; Role →
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-zinc-800 mb-1">Target Job Role</label>
                    <input
                      type="text"
                      value={profile.targetRole}
                      onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                      placeholder="e.g. Software Developer"
                      className="w-full rounded-xl border border-zinc-200 p-2.5 font-bold text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-800 mb-1">Experience Level</label>
                    <select
                      value={profile.experienceLevel}
                      onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 p-2.5 font-bold text-zinc-900"
                    >
                      <option>Fresher (0–2 Years)</option>
                      <option>2–5 Years</option>
                      <option>5+ Years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Technical Skills &amp; Languages</label>
                  <input
                    type="text"
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                    placeholder="e.g. C++, DSA, React, JavaScript, Python"
                    className="w-full rounded-xl border border-zinc-200 p-2.5 font-bold text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Projects &amp; Certifications</label>
                  <input
                    type="text"
                    value={profile.projects}
                    onChange={(e) => setProfile({ ...profile, projects: e.target.value })}
                    placeholder="e.g. E-Commerce Website, AI Chatbot"
                    className="w-full rounded-xl border border-zinc-200 p-2.5 font-bold text-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setProfileStep(1)}
                    className="rounded-xl border border-zinc-200 px-4 py-2 font-bold text-zinc-700"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="rounded-xl bg-zinc-900 px-6 py-2.5 font-bold text-white shadow hover:bg-zinc-800"
                  >
                    Save &amp; Continue Setup →
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MODE: MAIN INTERVIEW SETUP MODAL */
          <div className="space-y-5">
            {/* SECTION 1 — INTERVIEW TYPE */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Interview Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {interviewTypes.map((type) => {
                  const isSelected = selectedType === type.id
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`relative rounded-2xl p-3 border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white font-bold shadow-md scale-[1.02]'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      {type.isHighlight && (
                        <span className="absolute -top-2 right-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-extrabold text-white uppercase shadow">
                          Match
                        </span>
                      )}
                      <div>
                        <span className="text-xl">{type.icon}</span>
                        <p className={`text-xs font-extrabold mt-1 ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                          {type.title}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          {type.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2-COLUMN GRID: GOAL & PROFILE SUMMARY */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  What are you preparing for?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['College Placement', 'Internship', 'Job', 'Practice', 'Other'].map((goal) => {
                    const isSelected = selectedGoal === goal
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setSelectedGoal(goal)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-zinc-900 text-white shadow'
                            : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {goal}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Candidate Context
                </label>
                <div className="text-xs space-y-1 text-zinc-800 font-semibold">
                  <p>👤 <strong>{profile.fullName || 'Candidate'}</strong> ({profile.degree || 'B.Tech'} {profile.branch || 'CSE'})</p>
                  <p>💼 Target Role: <span className="text-zinc-900 font-extrabold">{profile.targetRole}</span> ({profile.experienceLevel})</p>
                  <p className="text-[11px] text-zinc-500 truncate">⚡ Skills: {profile.skills || 'C++, DSA, React'}</p>
                </div>
              </div>
            </div>

            {/* SECTION 4 — FOCUS CHIPS */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Focus Areas
              </label>
              <div className="flex flex-wrap gap-1.5">
                {focusChips.map((chip) => {
                  const isSelected = selectedFocus.includes(chip)
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleFocus(chip)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-zinc-900 text-white shadow'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {chip}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SECTION 5 — INTERVIEWER STYLE */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Interviewer Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {interviewerStyles.map((style) => {
                  const isSelected = selectedStyle === style.id
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`rounded-2xl p-2.5 border text-left transition-all ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white font-bold shadow'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      <p className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                        {style.label}
                      </p>
                      <p className={`text-[10px] ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {style.desc}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SECTION 6 — RESUME INTEGRATION */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-extrabold text-zinc-900">Personalized Interview</p>
                  <p className="text-[11px] text-zinc-500">AI uses candidate profile &amp; resume context for relevant probing.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setUseResume(!useResume)}
                  className={`rounded-xl px-3.5 py-2 font-bold transition-all ${
                    useResume
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                  }`}
                >
                  {useResume ? '✓ Resume Linked' : 'Resume Off'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 font-bold text-zinc-700 hover:bg-zinc-100"
                >
                  Customize
                </button>
              </div>
            </div>

            {/* INLINE CUSTOMIZE PANEL */}
            {isCustomizing && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3 text-xs animate-fade-in">
                <p className="font-bold text-zinc-900">Advanced Settings</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="flex justify-between font-bold text-zinc-800 mb-1">
                      <span>Questions: {numQuestions}</span>
                      <span className="text-zinc-500">~{numQuestions * 2} mins</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={15}
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="w-full accent-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-800 mb-1">Mode</label>
                    <select
                      value={interviewMode}
                      onChange={(e) => setInterviewMode(e.target.value as any)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 font-bold text-zinc-900"
                    >
                      <option value="video">📹 Video Interview (Camera + Voice Avatar)</option>
                      <option value="voice">🎤 Voice Interview</option>
                      <option value="text">⌨️ Text Chat</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* AI RECOMMENDATION PANEL */}
            <div className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-zinc-900 to-zinc-800 p-4 text-white shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div className="text-xs">
                  <p className="font-extrabold text-white uppercase tracking-wider text-[11px]">AI Recommendation</p>
                  <p className="text-zinc-200 font-semibold mt-0.5">
                    {selectedType.toUpperCase()} Interview • Adaptive Difficulty • {numQuestions} Questions • ~{numQuestions * 1.8} min
                  </p>
                  <p className="text-[10px] text-zinc-400">Tailored to {profile.fullName || 'Candidate'}'s profile ({profile.targetRole}).</p>
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</p>
            )}

            {/* FOOTER ACTION BAR */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear Interview Data
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-zinc-200 px-5 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartInterview}
                  disabled={starting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-zinc-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                >
                  {starting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Launching Session...
                    </>
                  ) : (
                    <>
                      Start AI Interview <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CONFIRMATION POPUP FOR CLEARING DATA */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-fade-in text-center">
            <h3 className="text-lg font-extrabold text-zinc-900">Clear saved interview data?</h3>
            <p className="text-xs text-zinc-600">
              This will remove your saved candidate profile information. Unrelated application data will not be affected.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearData}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-red-700"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
