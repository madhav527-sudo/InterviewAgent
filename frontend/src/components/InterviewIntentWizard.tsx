import { useState } from 'react'
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  ShieldCheck,
} from 'lucide-react'

export interface InterviewIntentData {
  interviewGoal: string
  customGoal: string
  currentStatus: string
  experienceLevel: string
  education: string
  domain: string
  targetRole: string
  targetCompanyType: string
  targetCompany: string
  expectations: string[]
  customExpectations: string
  interviewerStyle: string
  focusAreas: string[]
  difficulty: string
  interviewFormat: 'video' | 'voice' | 'text' | 'coding'
  useResume: boolean
  customNotes: string
}

interface InterviewIntentWizardProps {
  isOpen: boolean
  onClose: () => void
  onStartInterview: (intent: InterviewIntentData) => void
}

const goalsList = [
  'Campus Placement',
  'Off-Campus Job',
  'College Placement',
  'Internship',
  'Job Interview',
  'Career Change',
  'Promotion',
  'Higher Studies / MBA',
  'Government Job',
  'Practice & Skill Improvement',
]

const rolesList = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Cybersecurity Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
]

const expectationsList = [
  'Ask realistic interview questions',
  'Ask difficult questions',
  'Ask beginner-friendly questions',
  'Ask follow-up questions',
  'Challenge my answers',
  'Focus on technical knowledge',
  'Focus on communication',
  'Focus on confidence',
  'Focus on problem solving',
  'Ask questions from my resume',
  'Give hints when I get stuck',
  "Don't give hints",
  'Behave like a strict interviewer',
  'Behave like a friendly interviewer',
  'Behave like a real corporate interviewer',
  'Interrupt me when my answer is unclear',
  'Ask me to explain my answer deeper',
]

const personalityModes = [
  { id: 'Professional', title: 'Professional', desc: 'Formal corporate interviewer', icon: '🧑💼' },
  { id: 'Strict', title: 'Strict', desc: 'Challenging interviewer who pushes your limits', icon: '🎯' },
  { id: 'Friendly', title: 'Friendly', desc: 'Supportive interviewer who helps reduce nervousness', icon: '😊' },
  { id: 'Stress Interview', title: 'Stress Interview', desc: 'High-pressure interview simulation', icon: '🔥' },
  { id: 'Technical Expert', title: 'Technical Expert', desc: 'Deep technical questions and follow-ups', icon: '🧠' },
  { id: 'College Placement', title: 'College Placement', desc: 'Suitable for campus placements', icon: '🎓' },
]

const focusAreasList = [
  'Communication',
  'Technical Knowledge',
  'DSA / Coding',
  'Problem Solving',
  'Confidence',
  'HR Questions',
  'Resume Explanation',
  'Projects',
  'Leadership',
  'Behavioral Questions',
  'Domain Knowledge',
  'English Communication',
  'Answer Structure',
]

export default function InterviewIntentWizard({
  isOpen,
  onClose,
  onStartInterview,
}: InterviewIntentWizardProps) {
  const [step, setStep] = useState(1)

  // Intent State
  const [intent, setIntent] = useState<InterviewIntentData>({
    interviewGoal: 'College Placement',
    customGoal: '',
    currentStatus: 'Student',
    experienceLevel: '0–2 Years',
    education: "Bachelor's",
    domain: 'Computer Science',
    targetRole: 'Software Engineer',
    targetCompanyType: 'Product-Based Company',
    targetCompany: 'Google',
    expectations: ['Ask realistic interview questions', 'Ask follow-up questions', 'Focus on technical knowledge'],
    customExpectations: '',
    interviewerStyle: 'Professional',
    focusAreas: ['Technical Knowledge', 'Communication', 'Problem Solving'],
    difficulty: 'Adaptive',
    interviewFormat: 'video',
    useResume: true,
    customNotes: '',
  })

  if (!isOpen) return null

  const toggleExpectation = (item: string) => {
    setIntent((prev) => ({
      ...prev,
      expectations: prev.expectations.includes(item)
        ? prev.expectations.filter((i) => i !== item)
        : [...prev.expectations, item],
    }))
  }

  const toggleFocusArea = (item: string) => {
    setIntent((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(item)
        ? prev.focusAreas.filter((i) => i !== item)
        : [...prev.focusAreas, item],
    }))
  }

  const handleNext = () => {
    if (step < 8) setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1)
  }

  const handleComplete = () => {
    sessionStorage.setItem('cohortiq_intent_config', JSON.stringify(intent))
    onStartInterview(intent)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 sm:p-6 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Tell Us About Your Interview</h2>
              <p className="text-xs text-zinc-500">AI is personalizing your session before starting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Progress Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
            <span>Step {step} of 8</span>
            <span className="text-orange-600 font-extrabold uppercase tracking-wide">
              {step === 1 && '1. Goal'}
              {step === 2 && '2. Profile'}
              {step === 3 && '3. Role & Company'}
              {step === 4 && '4. Expectations'}
              {step === 5 && '5. Style & Focus'}
              {step === 6 && '6. Difficulty & Format'}
              {step === 7 && '7. Resume Context'}
              {step === 8 && '8. Review & Start'}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: PREPARATION GOAL */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900">What are you preparing for?</h3>
              <p className="text-xs text-zinc-500 mt-1">Select your primary reason for taking this interview.</p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {goalsList.map((g) => (
                <button
                  key={g}
                  onClick={() => setIntent({ ...intent, interviewGoal: g })}
                  className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                    intent.interviewGoal === g
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-105'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                Tell us in your own words (Optional)
              </label>
              <textarea
                value={intent.customGoal}
                onChange={(e) => setIntent({ ...intent, customGoal: e.target.value })}
                placeholder="Example: I have an upcoming software developer placement interview and want to improve my technical and HR performance."
                rows={3}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        )}

        {/* STEP 2: USER PROFILE */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900">Tell us about yourself</h3>
              <p className="text-xs text-zinc-500 mt-1">Help AI adjust its language and question complexity.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-bold text-zinc-800 mb-1.5">Current Status</label>
                <select
                  value={intent.currentStatus}
                  onChange={(e) => setIntent({ ...intent, currentStatus: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-semibold text-zinc-900 focus:border-orange-500"
                >
                  <option>Student</option>
                  <option>Fresher</option>
                  <option>Working Professional</option>
                  <option>Experienced Professional</option>
                  <option>Career Switcher</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1.5">Experience Level</label>
                <select
                  value={intent.experienceLevel}
                  onChange={(e) => setIntent({ ...intent, experienceLevel: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-semibold text-zinc-900 focus:border-orange-500"
                >
                  <option>No Experience</option>
                  <option>Internship Experience</option>
                  <option>0–2 Years</option>
                  <option>2–5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1.5">Education</label>
                <select
                  value={intent.education}
                  onChange={(e) => setIntent({ ...intent, education: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-semibold text-zinc-900 focus:border-orange-500"
                >
                  <option>Bachelor's</option>
                  <option>Master's</option>
                  <option>Diploma</option>
                  <option>PhD</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1.5">Field / Domain</label>
                <input
                  type="text"
                  value={intent.domain}
                  onChange={(e) => setIntent({ ...intent, domain: e.target.value })}
                  placeholder="Computer Science, IT, Finance..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-semibold text-zinc-900 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: TARGET ROLE & COMPANY */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900">Target Role & Company</h3>
              <p className="text-xs text-zinc-500 mt-1">Specify what position and company type you are aiming for.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-800 mb-1.5">Select Target Role</label>
                <div className="flex flex-wrap gap-2">
                  {rolesList.map((r) => (
                    <button
                      key={r}
                      onClick={() => setIntent({ ...intent, targetRole: r })}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                        intent.targetRole === r
                          ? 'bg-orange-500 text-white shadow'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <label className="block font-bold text-zinc-800 mb-1.5">Target Company Type</label>
                  <select
                    value={intent.targetCompanyType}
                    onChange={(e) => setIntent({ ...intent, targetCompanyType: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-semibold text-zinc-900 focus:border-orange-500"
                  >
                    <option>Product-Based Company</option>
                    <option>Service-Based Company</option>
                    <option>Startup</option>
                    <option>MNC</option>
                    <option>Specific Company</option>
                    <option>Any Company</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1.5">Target Company Name (Optional)</label>
                  <input
                    type="text"
                    value={intent.targetCompany}
                    onChange={(e) => setIntent({ ...intent, targetCompany: e.target.value })}
                    placeholder="e.g. Google, Meta, Amazon"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-semibold text-zinc-900 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: INTERVIEWER EXPECTATIONS */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900">What do you want from your AI interviewer?</h3>
              <p className="text-xs text-zinc-500 mt-1">Select all expectations that apply.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 max-h-56 overflow-y-auto p-1 border border-zinc-100 rounded-2xl">
              {expectationsList.map((exp) => {
                const isSelected = intent.expectations.includes(exp)
                return (
                  <button
                    key={exp}
                    onClick={() => toggleExpectation(exp)}
                    className={`flex items-center gap-2.5 rounded-xl p-2.5 text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-orange-50 text-orange-900 border border-orange-200 font-bold'
                        : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-zinc-300'}`}>
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{exp}</span>
                  </button>
                )
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">Something specific you want?</label>
              <input
                type="text"
                value={intent.customExpectations}
                onChange={(e) => setIntent({ ...intent, customExpectations: e.target.value })}
                placeholder="Example: Challenge me with follow-ups and behave like a real technical interviewer."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {/* STEP 5: PERSONALITY & FOCUS */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900">How should your AI interviewer behave?</h3>
              <p className="text-xs text-zinc-500 mt-1">Choose the persona mode for your session.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {personalityModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setIntent({ ...intent, interviewerStyle: mode.id })}
                  className={`rounded-2xl p-3.5 border text-left transition-all ${
                    intent.interviewerStyle === mode.id
                      ? 'border-orange-500 bg-orange-50/70 font-bold text-orange-900 shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <span className="text-xl">{mode.icon}</span>
                  <p className="text-xs font-bold text-zinc-900 mt-1">{mode.title}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{mode.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">What do you want to improve? (Select all)</label>
              <div className="flex flex-wrap gap-2">
                {focusAreasList.map((fa) => {
                  const isSelected = intent.focusAreas.includes(fa)
                  return (
                    <button
                      key={fa}
                      onClick={() => toggleFocusArea(fa)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {fa}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: DIFFICULTY & FORMAT */}
        {step === 6 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900">Difficulty & Format</h3>
              <p className="text-xs text-zinc-500 mt-1">Choose how challenging and interactive your practice should be.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-2">Difficulty Level</label>
                <div className="grid gap-2 sm:grid-cols-5 text-xs">
                  {['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Adaptive'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setIntent({ ...intent, difficulty: d })}
                      className={`rounded-xl p-3 border font-bold text-center transition-all ${
                        intent.difficulty === d
                          ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-sm'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                {intent.difficulty === 'Adaptive' && (
                  <p className="text-[11px] text-orange-600 font-semibold mt-1.5">
                    ✓ Recommended: AI automatically adjusts question difficulty based on your answers.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-2">Practice Format</label>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  {[
                    { id: 'video', label: '📹 Video Interview', desc: 'Practice with camera & live voice avatar' },
                    { id: 'voice', label: '🎤 Voice Interview', desc: 'Natural audio speech interview' },
                    { id: 'text', label: '⌨️ Text Interview', desc: 'Type answers via keyboard' },
                    { id: 'coding', label: '🧩 Coding Interview', desc: 'Solve live code algorithms' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setIntent({ ...intent, interviewFormat: fmt.id as any })}
                      className={`rounded-2xl p-3.5 border text-left transition-all ${
                        intent.interviewFormat === fmt.id
                          ? 'border-orange-500 bg-orange-50/80 font-bold text-orange-900 shadow-sm'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <p className="font-bold text-zinc-900">{fmt.label}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{fmt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: RESUME CONTEXT & HELP AI UNDERSTAND YOU */}
        {step === 7 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900">Resume Context & Extra Details</h3>
              <p className="text-xs text-zinc-500 mt-1">Should AI ask questions directly from your resume?</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIntent({ ...intent, useResume: true })}
                className={`flex-1 rounded-2xl p-4 border text-center text-xs font-bold transition-all ${
                  intent.useResume
                    ? 'border-orange-500 bg-orange-50 text-orange-900 shadow'
                    : 'border-zinc-200 bg-white text-zinc-700'
                }`}
              >
                YES — Use My Resume
              </button>
              <button
                onClick={() => setIntent({ ...intent, useResume: false })}
                className={`flex-1 rounded-2xl p-4 border text-center text-xs font-bold transition-all ${
                  !intent.useResume
                    ? 'border-orange-500 bg-orange-50 text-orange-900 shadow'
                    : 'border-zinc-200 bg-white text-zinc-700'
                }`}
              >
                NO — General Interview
              </button>
            </div>

            {intent.useResume && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-zinc-800">
                  <span>Parsed Resume Snapshot (Alex Sharma)</span>
                  <span className="text-emerald-600">✓ Active</span>
                </div>
                <p className="text-zinc-600">Detected: DocuMind RAG Architecture, Python, React, FastAPI, ChromaDB</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                Anything else your interviewer should know?
              </label>
              <textarea
                value={intent.customNotes}
                onChange={(e) => setIntent({ ...intent, customNotes: e.target.value })}
                placeholder="Example: I'm nervous during interviews, so I want realistic practice without unnecessary hints."
                rows={2}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {/* STEP 8: REVIEW SUMMARY */}
        {step === 8 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center max-w-lg mx-auto">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900">Here's what we understand about you</h3>
              <p className="text-xs text-zinc-500 mt-1">✓ AI has understood your interview goal and customized your session.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 rounded-3xl border border-zinc-200 bg-zinc-50/80 p-5 text-xs">
              <div><strong className="text-zinc-500">Interview Goal:</strong> <span className="font-bold text-zinc-900">{intent.interviewGoal}</span></div>
              <div><strong className="text-zinc-500">Target Role:</strong> <span className="font-bold text-zinc-900">{intent.targetRole}</span></div>
              <div><strong className="text-zinc-500">Experience:</strong> <span className="font-bold text-zinc-900">{intent.currentStatus} ({intent.experienceLevel})</span></div>
              <div><strong className="text-zinc-500">Target Company:</strong> <span className="font-bold text-zinc-900">{intent.targetCompany || intent.targetCompanyType}</span></div>
              <div><strong className="text-zinc-500">Interviewer Style:</strong> <span className="font-bold text-orange-600">{intent.interviewerStyle}</span></div>
              <div><strong className="text-zinc-500">Difficulty:</strong> <span className="font-bold text-zinc-900">{intent.difficulty}</span></div>
              <div><strong className="text-zinc-500">Focus Areas:</strong> <span className="font-bold text-zinc-900">{intent.focusAreas.slice(0, 3).join(', ')}</span></div>
              <div><strong className="text-zinc-500">Resume Context:</strong> <span className="font-bold text-emerald-600">{intent.useResume ? 'Using Resume' : 'General'}</span></div>
            </div>
          </div>
        )}

        {/* Bottom Wizard Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-orange-600"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
              >
                Edit Preferences
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:scale-[1.02]"
              >
                Start Personalized Interview →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
