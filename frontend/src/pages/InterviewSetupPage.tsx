import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  Check,
  FileText,
  ArrowRight,
  User,
  Sliders,
  ShieldCheck,
  Zap,
  Target,
  Code2,
  UserCheck,
} from 'lucide-react'
import { api } from '../api/client'

export interface RealUserProfile {
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

const typeCards = [
  {
    id: 'technical',
    title: 'Technical',
    subtitle: 'Skills & concepts',
    icon: Code2,
  },
  {
    id: 'coding',
    title: 'Coding & DSA',
    subtitle: 'Problem solving',
    icon: Zap,
  },
  {
    id: 'hr',
    title: 'HR',
    subtitle: 'Behavioral & personality',
    icon: UserCheck,
  },
  {
    id: 'placement',
    title: 'Placement',
    subtitle: 'HR + technical',
    icon: Target,
  },
  {
    id: 'personalized',
    title: 'Personalized',
    subtitle: 'AI chooses based on profile',
    icon: Sparkles,
    isRecommended: true,
  },
]

const goalOptions = [
  'College Placement',
  'Internship',
  'Job',
  'Practice',
  'Other',
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
  { id: 'challenging', label: 'Challenging', desc: 'Push your limits' },
  { id: 'supportive', label: 'Supportive', desc: 'Build confidence' },
  { id: 'ai_decides', label: '✨ AI Decides', desc: 'Recommended for you' },
]

export default function InterviewSetupPage() {
  const navigate = useNavigate()

  // Real authenticated / stored user profile (NO FAKE / SAMPLE DATA)
  const [userProfile] = useState<RealUserProfile | null>(() => {
    const stored = localStorage.getItem('cohortiq_candidate_profile')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed && (parsed.fullName || parsed.targetRole || parsed.skills)) {
          return parsed
        }
      } catch (e) {
        console.error('Failed to parse candidate profile', e)
      }
    }
    return null
  })

  // Selection states
  const [selectedType, setSelectedType] = useState('personalized')
  const [selectedGoal, setSelectedGoal] = useState('College Placement')
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    'Technical',
    'DSA',
    'Projects',
    'Communication',
  ])
  const [selectedStyle, setSelectedStyle] = useState('ai_decides')

  // Resume state
  const [useResume] = useState(true)
  const [isCustomizing, setIsCustomizing] = useState(false)

  // Expandable inline customization
  const [numQuestions, setNumQuestions] = useState(10)
  const [difficulty, setDifficulty] = useState('adaptive')
  const [interviewMode, setInterviewMode] = useState<'video' | 'voice' | 'text'>('video')

  // Job description & additional notes states
  const [jobDescription, setJobDescription] = useState('')
  const [customNotes, setCustomNotes] = useState('')

  // Launching state
  const [starting, setStarting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  const toggleFocusChip = (chip: string) => {
    setSelectedFocus((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    )
  }

  const handleSaveSetup = () => {
    const setupData = {
      selectedType,
      selectedGoal,
      selectedFocus,
      selectedStyle,
      useResume,
      numQuestions,
      difficulty,
      interviewMode,
      jobDescription,
      customNotes,
    }
    localStorage.setItem('cohortiq_last_setup', JSON.stringify(setupData))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleStartInterview = async () => {
    setStarting(true)
    setError('')
    try {
      const cvText = localStorage.getItem('cohortiq_cv_text') || ''
      let structuredProfile: Record<string, unknown> | undefined
      const storedProfile = localStorage.getItem('cohortiq_structured_profile')
      if (storedProfile) {
        try {
          structuredProfile = JSON.parse(storedProfile)
        } catch {
          structuredProfile = undefined
        }
      }

      const intentPayload = {
        candidate_profile: userProfile,
        interview_type: selectedType,
        interview_goal: selectedGoal,
        target_role: userProfile?.targetRole || 'Software Developer',
        experience_level: userProfile?.experienceLevel || 'Fresher',
        target_company: userProfile?.preferredCompany || '',
        focus_areas: selectedFocus,
        interviewer_style: selectedStyle,
        use_resume: useResume,
        job_description: jobDescription,
        custom_notes: customNotes,
        cv_text: cvText,
        structured_profile: structuredProfile,
        additional_info: customNotes,
      }

      sessionStorage.setItem('cohortiq_intent_config', JSON.stringify(intentPayload))

      const result = await api.startInterview({
        candidate_id: 'cand_001',
        interview_type: selectedType === 'personalized' ? 'comprehensive' : selectedType,
        difficulty: difficulty === 'adaptive' ? 'adaptive' : difficulty,
        num_questions: numQuestions,
        selected_topics: selectedFocus,
        auto_select_topics: true,
        candidate_profile: userProfile || {},
        job_description: jobDescription,
        cv_text: cvText,
        structured_profile: structuredProfile || {},
        target_role: userProfile?.targetRole || 'Software Developer',
        experience_level: userProfile?.experienceLevel || 'Fresher',
        interviewer_style: selectedStyle,
        focus_areas: selectedFocus,
        custom_notes: customNotes,
        additional_info: customNotes,
        interview_goal: selectedGoal,
      })

      sessionStorage.setItem('cohortiq_session', result.session_id)

      if (interviewMode === 'video') {
        navigate(`/video-interview/${result.session_id}`)
      } else {
        navigate(`/interview/${result.session_id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to launch AI interview session')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-28">
      {/* Top Ambient Glow */}
      <div className="relative border-b border-zinc-100 bg-gradient-to-b from-orange-50/40 via-white to-white py-10 sm:py-14">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-gradient-to-tr from-orange-200/30 via-amber-100/20 to-transparent blur-3xl" />

        {/* 3. HEADER */}
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-extrabold text-orange-700 uppercase tracking-wide mb-3">
                <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
                <span>✨ AI-POWERED</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                AI Interview Setup
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600">
                Tell us what you want to practice. AI will personalize the interview for you.
              </p>
            </div>

            {/* Profile Status Badge (Real Data Only) */}
            {userProfile && (
              <div className="shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-xs text-emerald-900 shadow-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="font-bold">✓ Profile Loaded</p>
                  <p className="text-[11px] text-emerald-700">
                    {userProfile.fullName ? userProfile.fullName : 'Saved Candidate'} ({userProfile.targetRole || 'Software Engineer'})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER (1100–1200px MAX WIDTH) */}
      <main className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 space-y-10">

        {/* 4. CHOOSE INTERVIEW TYPE */}
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">Choose Interview Type</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Select one. AI will handle the rest.</p>
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
            {typeCards.map((card) => {
              const Icon = card.icon
              const isSelected = selectedType === card.id
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedType(card.id)}
                  className={`relative cursor-pointer rounded-2xl p-4 border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/20 shadow-md shadow-orange-500/10 scale-[1.02]'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white shadow">
                      <Check className="h-3 w-3" />
                    </div>
                  )}

                  {card.isRecommended && !isSelected && (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white shadow">
                      Recommended
                    </span>
                  )}

                  <div>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-700'
                    }`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-zinc-900">{card.title}</h3>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{card.subtitle}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 5. PREPARATION GOAL + PROFILE (2-COLUMN SECTION) */}
        <section className="grid gap-6 sm:grid-cols-2">
          {/* LEFT: Preparation Goal */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900">What are you preparing for?</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Choose your target outcome.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {goalOptions.map((goal) => {
                const isSelected = selectedGoal === goal
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setSelectedGoal(goal)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {goal}
                  </button>
                )
              })}
            </div>
          </div>

          {/* RIGHT: Real User Profile Context (NO FAKE / SAMPLE DATA) */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-base font-extrabold text-zinc-900">Your Profile</h2>
                <Link
                  to="/profile"
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  Edit Profile
                </Link>
              </div>

              {userProfile ? (
                <div className="mt-4 space-y-2 text-xs text-zinc-700">
                  {userProfile.fullName && (
                    <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                      <span className="font-semibold text-zinc-500">Name:</span>
                      <span className="font-bold text-zinc-900">{userProfile.fullName}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                    <span className="font-semibold text-zinc-500">Target Role:</span>
                    <span className="font-bold text-orange-600">{userProfile.targetRole || 'Software Developer'}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                    <span className="font-semibold text-zinc-500">Experience:</span>
                    <span className="font-bold text-zinc-900">{userProfile.experienceLevel || 'Fresher'}</span>
                  </div>
                  {userProfile.skills && (
                    <div className="pt-1">
                      <span className="font-semibold text-zinc-500 block mb-1">Skills:</span>
                      <p className="font-bold text-zinc-800 bg-zinc-50 p-2 rounded-xl border border-zinc-200/60">
                        {userProfile.skills}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-orange-50/60 border border-orange-200 p-4 text-center space-y-2 text-xs">
                  <User className="mx-auto h-6 w-6 text-orange-500" />
                  <p className="font-bold text-zinc-900">Profile information not available</p>
                  <p className="text-zinc-600">Complete your profile to get personalized AI question recommendations.</p>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-1 rounded-xl bg-orange-500 px-4 py-2 font-bold text-white shadow hover:bg-orange-600 mt-1"
                  >
                    Complete Profile →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 6. FOCUS AREAS */}
        <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900">What should AI focus on?</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Select specific areas or let AI choose automatically.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedFocus(['Technical', 'DSA', 'Projects', 'Communication'])}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                selectedFocus.length === 4
                  ? 'border-orange-500 bg-orange-500 text-white shadow-md'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              ✨ Let AI Decide
            </button>

            {focusChips.map((chip) => {
              const isSelected = selectedFocus.includes(chip)
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleFocusChip(chip)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
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
        </section>

        {/* 7. INTERVIEWER STYLE */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900">Choose Interview Style</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Select how you want your AI interviewer to interact.</p>
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {interviewerStyles.map((style) => {
              const isSelected = selectedStyle === style.id
              return (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`cursor-pointer rounded-2xl p-4 border text-left transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/20 font-bold shadow-md shadow-orange-500/10'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                  }`}
                >
                  <p className="text-xs font-extrabold text-zinc-900">{style.label}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{style.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 8. RESUME & PERSONALIZATION (HORIZONTAL CARD) */}
        <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shrink-0 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900">Personalize with your Resume</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                AI uses your resume and profile to create relevant questions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {userProfile?.hasResume ? (
              <>
                <span className="rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                  ✓ Resume connected
                </span>
                <Link
                  to="/profile"
                  className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                >
                  Change Resume
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-600"
              >
                Upload Resume
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-100 flex items-center gap-1.5"
            >
              <Sliders className="h-3.5 w-3.5" /> Customize Interview
            </button>
          </div>
        </section>

        {/* INLINE EXPANDABLE CUSTOMIZATION */}
        {isCustomizing && (
          <section className="rounded-3xl border border-zinc-200/90 bg-zinc-50 p-6 space-y-4 text-xs animate-fade-in">
            <h3 className="font-extrabold text-zinc-900 text-sm">Advanced Setup Customization</h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 font-bold text-zinc-900"
                >
                  <option value="adaptive">Adaptive Difficulty (AI Controlled)</option>
                  <option value="easy">Beginner</option>
                  <option value="medium">Intermediate</option>
                  <option value="hard">Advanced</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-zinc-800 mb-1">
                  <span>Questions: {numQuestions}</span>
                  <span className="text-orange-600">~{numQuestions * 2} mins</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={5}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full accent-orange-500 mt-2"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">Interview Format Mode</label>
                <select
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value as any)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 font-bold text-zinc-900"
                >
                  <option value="video">📹 Video Interview (Camera + Voice Avatar)</option>
                  <option value="voice">🎤 Voice Interview</option>
                  <option value="text">⌨️ Text Chat</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-zinc-200">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">Target Job Description (Optional)</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here. AI will match questions against job requirements..."
                  rows={3}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-3 font-semibold text-zinc-900 focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">Custom Notes / Focus Instructions (Optional)</label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Focus heavily on system design and React performance optimization..."
                  rows={3}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-3 font-semibold text-zinc-900 focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </section>
        )}

        {/* 9. ✨ AI RECOMMENDATION */}
        <section className="rounded-3xl border-2 border-orange-500 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 p-6 shadow-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h2 className="text-base font-extrabold text-zinc-900">AI Recommendation</h2>
          </div>

          {userProfile ? (
            <div className="space-y-1 text-xs">
              <p className="font-bold text-orange-900">
                Based on your profile ({userProfile.targetRole || 'Software Engineer'}), AI recommends:
              </p>
              <p className="text-sm font-extrabold text-zinc-900">
                {selectedType.toUpperCase()} Interview • Adaptive Difficulty • {numQuestions} Questions • ~{numQuestions * 1.8} Minutes
              </p>
              <p className="text-zinc-600">
                Topics: {selectedFocus.join(' • ')}
              </p>
            </div>
          ) : (
            <div className="text-xs text-zinc-600">
              <p className="font-bold text-zinc-900">Complete your profile to receive a personalized recommendation.</p>
              <p className="mt-0.5">Currently using default preparation settings.</p>
            </div>
          )}
        </section>

        {/* 10. INTERVIEW SUMMARY */}
        <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-zinc-900">Your Interview Summary</h2>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 text-xs">
            <div className="rounded-2xl bg-zinc-50 p-3 border border-zinc-200/80">
              <span className="text-zinc-500 font-semibold">Interview Type</span>
              <p className="font-bold text-zinc-900 mt-0.5 capitalize">{selectedType}</p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-3 border border-zinc-200/80">
              <span className="text-zinc-500 font-semibold">Goal</span>
              <p className="font-bold text-zinc-900 mt-0.5">{selectedGoal}</p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-3 border border-zinc-200/80">
              <span className="text-zinc-500 font-semibold">Difficulty</span>
              <p className="font-bold text-orange-600 mt-0.5 capitalize">{difficulty}</p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-3 border border-zinc-200/80">
              <span className="text-zinc-500 font-semibold">Duration &amp; Qs</span>
              <p className="font-bold text-zinc-900 mt-0.5">{numQuestions} Qs (~{numQuestions * 2} min)</p>
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-200">{error}</p>
        )}

        {/* 11. START BUTTON & ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 animate-fade-in">
              ✓ Setup saved successfully!
            </span>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
            <button
              type="button"
              onClick={handleSaveSetup}
              className="w-full sm:w-auto rounded-xl border border-zinc-200 px-6 py-3.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition"
            >
              Save Setup
            </button>

            <button
              type="button"
              onClick={handleStartInterview}
              disabled={starting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {starting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Preparing CV-Aware Interview...
                </>
              ) : (
                <>
                  Start AI Interview <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}
