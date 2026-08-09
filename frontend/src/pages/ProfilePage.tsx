import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  Upload,
  Check,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Edit3,
} from 'lucide-react'
import { api } from '../api/client'

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
  projects?: string
  certifications?: string
  achievements?: string
  cvTextPreview?: string
}

function profileFromStructured(structured: Record<string, unknown>, cvText: string): Partial<UserProfile> {
  const personal = (structured.personal as Record<string, unknown>) || {}
  const skills = (structured.technical_skills as Record<string, unknown>) || {}
  const allSkills = [
    ...(skills.programming_languages as string[] || []),
    ...(skills.frameworks as string[] || []),
    ...(skills.databases as string[] || []),
    ...(skills.ai_ml as string[] || []),
  ]
  const projects = (structured.projects as Array<Record<string, unknown>>) || []
  const projectText = projects
    .map((p) => `${p.name || 'Project'}: ${p.description || ''} (${(p.technologies as string[] || []).join(', ')})`)
    .join('\n')
  const edu = ((personal.education as Array<Record<string, unknown>>) || [])[0]
  return {
    fullName: (personal.name as string) || '',
    degree: edu ? `${edu.degree || ''} ${edu.institution || ''}`.trim() : '',
    college: (edu?.institution as string) || '',
    skills: allSkills.join(', '),
    projects: projectText,
    hasResume: true,
    cvTextPreview: cvText.slice(0, 500),
  }
}

const roleOptions = [
  'Software Developer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Analyst', 'Data Scientist',
  'AI/ML Engineer', 'DevOps Engineer', 'Cybersecurity Analyst', 'UI/UX Designer',
]

const goalOptions = ['Internship', 'Placement', 'Full-Time Job', 'Higher Studies', 'Career Switch']

export default function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState('')

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('cohortiq_candidate_profile')
    if (stored) {
      try {
        const p = JSON.parse(stored)
        if (p && (p.fullName || p.targetRole || p.skills)) return p
      } catch { /* ignore */ }
    }
    return null
  })

  const [analyzing, setAnalyzing] = useState(false)
  const [targetGoal, setTargetGoal] = useState('Placement')
  const [targetRole, setTargetRole] = useState(profile?.targetRole || 'Software Developer')
  const [customRole, setCustomRole] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Editable fields
  const [editName, setEditName] = useState(profile?.fullName || '')
  const [editSkills, setEditSkills] = useState(profile?.skills || '')
  const [editEducation, setEditEducation] = useState(profile?.degree || '')
  const [editExperience, setEditExperience] = useState(profile?.experienceLevel || 'Fresher')
  const [editProjects, setEditProjects] = useState(profile?.projects || '')

  const skillsList = profile?.skills?.split(',').map(s => s.trim()).filter(Boolean) || []

  const handleUploadResume = () => {
    fileInputRef.current?.click()
  }

  const processResumeFile = async (file: File) => {
    setUploadError('')
    setAnalyzing(true)
    try {
      const result = await api.analyzeCv(file, {
        full_name: editName || profile?.fullName || '',
        target_role: customRole || targetRole || profile?.targetRole || '',
        experience_level: editExperience || profile?.experienceLevel || 'Fresher',
        skills: editSkills || profile?.skills || '',
        projects: editProjects || profile?.projects || '',
        job_description: '',
        additional_info: '',
      })

      localStorage.setItem('cohortiq_cv_text', result.cv_text)
      localStorage.setItem('cohortiq_structured_profile', JSON.stringify(result.structured_profile))
      localStorage.setItem('cohortiq_interview_data_analysis', JSON.stringify(result.interview_data_analysis))

      const extracted = profileFromStructured(result.structured_profile, result.cv_text)
      const newProfile: UserProfile = {
        fullName: extracted.fullName || editName,
        college: extracted.college,
        degree: extracted.degree || editEducation,
        skills: extracted.skills || editSkills,
        experienceLevel: editExperience || profile?.experienceLevel || 'Fresher',
        targetRole: customRole || targetRole || 'Software Developer',
        projects: extracted.projects || editProjects,
        hasResume: true,
        cvTextPreview: extracted.cvTextPreview,
      }
      setProfile(newProfile)
      setEditName(newProfile.fullName || '')
      setEditSkills(newProfile.skills || '')
      setEditEducation(newProfile.degree || '')
      setEditProjects(newProfile.projects || '')
      setEditMode(true)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Failed to analyze resume')
    } finally {
      setAnalyzing(false)
    }
  }

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void processResumeFile(file)
    e.target.value = ''
  }

  const handleConfirmProfile = () => {
    const updated: UserProfile = {
      ...profile,
      fullName: editName,
      skills: editSkills,
      degree: editEducation,
      experienceLevel: editExperience,
      projects: editProjects,
      targetRole: customRole || targetRole,
      hasResume: true,
    }
    localStorage.setItem('cohortiq_candidate_profile', JSON.stringify(updated))
    if (localStorage.getItem('cohortiq_cv_text')) {
      updated.hasResume = true
    }
    setProfile(updated)
    setEditMode(false)
  }

  const handleDeleteData = () => {
    localStorage.removeItem('cohortiq_candidate_profile')
    localStorage.removeItem('cohortiq_cv_text')
    localStorage.removeItem('cohortiq_structured_profile')
    localStorage.removeItem('cohortiq_interview_data_analysis')
    setProfile(null)
    setEditMode(false)
    setShowDeleteConfirm(false)
    setEditName('')
    setEditSkills('')
    setEditEducation('')
    setEditExperience('Fresher')
    setEditProjects('')
  }

  // --- NO PROFILE: Upload-first experience ---
  if (!profile && !analyzing) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 pb-20">
        <div className="relative border-b border-zinc-100 bg-gradient-to-b from-orange-50/40 via-white to-white py-10 sm:py-14">
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-gradient-to-tr from-orange-200/30 via-amber-100/20 to-transparent blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-extrabold text-orange-700 uppercase tracking-wide mb-3">
              <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-pulse" /> AI CAREER & RESUME ADVISOR
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">AI Resume & Career Intelligence</h1>
            <p className="mt-2 text-sm text-zinc-600">Upload your resume. AI will analyze your skills, find gaps, and create your career roadmap.</p>
          </div>
        </div>
        <main className="mx-auto max-w-3xl px-4 pt-16 text-center space-y-8">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,application/pdf"
            className="hidden"
            onChange={onFileSelected}
          />
          {uploadError && (
            <p className="rounded-2xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">{uploadError}</p>
          )}
          <div className="rounded-3xl border-2 border-dashed border-orange-300 bg-orange-50/40 p-12 space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-zinc-900">Upload Your Resume</p>
              <p className="text-xs text-zinc-500 mt-1">Drag & drop or click to upload. Supports PDF, DOCX, TXT (Max 10MB)</p>
            </div>
            <button
              onClick={handleUploadResume}
              className="rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all hover:scale-[1.02]"
            >
              Upload & Analyze Resume
            </button>
          </div>
          <p className="text-xs text-zinc-400">Your resume data stays private and is stored locally on your device.</p>
        </main>
      </div>
    )
  }

  // --- ANALYZING state ---
  if (analyzing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-lg font-extrabold text-zinc-900">Analyzing your resume...</p>
          <p className="text-xs text-zinc-500">Extracting skills, education, projects, and experience</p>
        </div>
      </div>
    )
  }

  // --- EDIT MODE: Confirm extracted data ---
  if (editMode) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 pb-20">
        <div className="relative border-b border-zinc-100 bg-gradient-to-b from-orange-50/40 via-white to-white py-10">
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
            <h1 className="text-2xl font-extrabold text-zinc-900">Confirm Your Profile</h1>
            <p className="text-sm text-zinc-600 mt-1">Review the extracted information and edit if needed.</p>
          </div>
        </div>
        <main className="mx-auto max-w-4xl px-4 pt-8 space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-extrabold text-zinc-800 mb-1">Full Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Enter your name" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-semibold text-zinc-900 focus:border-orange-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-zinc-800 mb-1">Education / Degree</label>
                <input value={editEducation} onChange={e => setEditEducation(e.target.value)} placeholder="e.g. B.Tech Computer Science" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-semibold text-zinc-900 focus:border-orange-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-zinc-800 mb-1">Experience Level</label>
                <select value={editExperience} onChange={e => setEditExperience(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-semibold text-zinc-900">
                  <option>Fresher</option>
                  <option>0-1 Years</option>
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-zinc-800 mb-1">Target Role</label>
                <select value={targetRole} onChange={e => setTargetRole(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-semibold text-zinc-900">
                  {roleOptions.map(r => <option key={r}>{r}</option>)}
                </select>
                <input value={customRole} onChange={e => setCustomRole(e.target.value)} placeholder="+ Or type a custom role" className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-semibold text-zinc-900 focus:border-orange-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-zinc-800 mb-1">Skills (comma separated)</label>
              <input value={editSkills} onChange={e => setEditSkills(e.target.value)} placeholder="e.g. React, JavaScript, Node.js, Python" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-semibold text-zinc-900 focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-zinc-800 mb-1">Projects (brief descriptions)</label>
              <textarea value={editProjects} onChange={e => setEditProjects(e.target.value)} rows={3} placeholder="e.g. E-commerce app using React + Node.js" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-semibold text-zinc-900 focus:border-orange-500 focus:outline-none resize-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleConfirmProfile} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all">
              <Check className="h-4 w-4" /> Confirm Profile
            </button>
            <button onClick={handleUploadResume} className="rounded-xl border border-zinc-200 px-6 py-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition">
              Upload New Resume
            </button>
          </div>
        </main>
      </div>
    )
  }

  // --- FULL ANALYSIS DASHBOARD ---
  const resumeScore = skillsList.length >= 6 ? 82 : skillsList.length >= 3 ? 68 : 45
  const effectiveRole = customRole || targetRole || profile?.targetRole || 'Software Developer'
  const experience = profile?.experienceLevel || editExperience || 'Fresher'

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-28">
      <div className="relative border-b border-zinc-100 bg-gradient-to-b from-orange-50/40 via-white to-white py-10 sm:py-14">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-gradient-to-tr from-orange-200/30 via-amber-100/20 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-extrabold text-orange-700 uppercase tracking-wide mb-3">
                <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-pulse" /> AI CAREER & RESUME ADVISOR
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">AI Resume & Career Intelligence</h1>
              <p className="mt-2 text-sm text-zinc-600">Your resume. Your skills. Your career roadmap.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditMode(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50"><Edit3 className="h-3.5 w-3.5" /> Edit Profile</button>
              <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Delete Data</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="rounded-3xl bg-white p-8 shadow-2xl max-w-sm space-y-4 text-center">
            <Trash2 className="mx-auto h-8 w-8 text-red-500" />
            <h3 className="text-lg font-extrabold text-zinc-900">Delete Resume Data?</h3>
            <p className="text-xs text-zinc-600">This will remove your saved resume, profile, score, and all recommendations. You'll start fresh.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowDeleteConfirm(false)} className="rounded-xl border border-zinc-200 px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50">Cancel</button>
              <button onClick={handleDeleteData} className="rounded-xl bg-red-500 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-red-600">Delete Data</button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 space-y-10">
        {/* AI Resume Score */}
        <section className="rounded-3xl border-2 border-orange-500 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white text-2xl font-black shadow-lg shadow-orange-500/25">{resumeScore}</div>
              <div>
                <h2 className="text-xl font-extrabold text-zinc-900">AI Resume Score</h2>
                <p className="text-xs text-orange-700 font-bold">{resumeScore}/100 · {resumeScore >= 75 ? 'Strong Profile' : resumeScore >= 55 ? 'Good Foundation' : 'Needs Improvement'}</p>
              </div>
            </div>
            <span className="rounded-xl bg-orange-100 px-3.5 py-1.5 text-xs font-bold text-orange-800 border border-orange-200">{experience} · {effectiveRole}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-4 text-xs">
            <div className="rounded-2xl bg-white p-3 border border-zinc-200/80"><span className="text-zinc-500 font-semibold">Skills</span><p className="font-extrabold text-zinc-900 mt-0.5">{skillsList.length > 0 ? `${Math.min(90, 50 + skillsList.length * 5)}%` : 'N/A'}</p></div>
            <div className="rounded-2xl bg-white p-3 border border-zinc-200/80"><span className="text-zinc-500 font-semibold">Projects</span><p className="font-extrabold text-zinc-900 mt-0.5">{profile?.projects ? '78%' : 'N/A'}</p></div>
            <div className="rounded-2xl bg-white p-3 border border-zinc-200/80"><span className="text-zinc-500 font-semibold">Education</span><p className="font-extrabold text-zinc-900 mt-0.5">{profile?.degree ? '85%' : 'N/A'}</p></div>
            <div className="rounded-2xl bg-white p-3 border border-zinc-200/80"><span className="text-zinc-500 font-semibold">Role Relevance</span><p className="font-extrabold text-orange-600 mt-0.5">{skillsList.length > 0 ? '72%' : 'N/A'}</p></div>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-zinc-200/80 text-xs">
            <p className="font-extrabold text-zinc-900">Why this score?</p>
            <p className="text-zinc-600 mt-0.5">{skillsList.length > 0 ? `Your resume shows ${skillsList.length} relevant skills. Strengthen project descriptions and add measurable achievements for a higher score.` : 'Add your skills and project details to improve your resume score.'}</p>
          </div>
          <div className="text-[11px] text-zinc-400">Based on: ✓ Your Resume · ✓ Target Role: {effectiveRole} · ✓ Your Skills</div>
        </section>

        {/* Career Goal & Target Role */}
        <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-xl font-extrabold text-zinc-900">Career Goal & Target Role</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-extrabold text-zinc-800 mb-2">What are you targeting?</label>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map(g => (
                  <button key={g} onClick={() => setTargetGoal(g)} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${targetGoal === g ? 'bg-orange-500 text-white shadow-md' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-zinc-800">Which role are you targeting?</label>
              </div>
              <select value={targetRole} onChange={e => { setTargetRole(e.target.value); const up = { ...profile, targetRole: e.target.value }; localStorage.setItem('cohortiq_candidate_profile', JSON.stringify(up)); setProfile(up as UserProfile) }} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-extrabold text-zinc-900">
                {roleOptions.map(r => <option key={r}>{r}</option>)}
              </select>
              <input value={customRole} onChange={e => setCustomRole(e.target.value)} placeholder="+ Add your own role" className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-semibold text-zinc-900 focus:border-orange-500 focus:outline-none" />
            </div>
          </div>
        </section>

        {/* Strengths & Gaps */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-3">
            <h3 className="flex items-center gap-2 text-base font-extrabold text-zinc-900"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> What's Working Well</h3>
            <ul className="space-y-2 text-xs text-zinc-700 font-semibold">
              {skillsList.length > 0 && <li className="flex items-center gap-2">✓ {skillsList.length} relevant technical skills identified</li>}
              {profile?.degree && <li className="flex items-center gap-2">✓ Education background: {profile.degree}</li>}
              {profile?.projects && <li className="flex items-center gap-2">✓ Project experience documented</li>}
              {profile?.hasResume && <li className="flex items-center gap-2">✓ Resume uploaded and analyzed</li>}
              {skillsList.length === 0 && !profile?.degree && <li className="text-zinc-400">Complete your profile to see strengths</li>}
            </ul>
          </div>
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-3">
            <h3 className="flex items-center gap-2 text-base font-extrabold text-zinc-900"><AlertTriangle className="h-5 w-5 text-amber-600" /> What You're Missing for {effectiveRole}</h3>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 font-bold text-amber-800">⚠ System Design</span>
                <span className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 font-bold text-amber-800">⚠ Testing</span>
                <span className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 font-bold text-red-800">✕ CI/CD</span>
              </div>
              <p className="text-[11px] text-zinc-400 italic">AI assessment based on common role requirements — not verified market data</p>
            </div>
          </div>
        </div>

        {/* What Should You Learn + Roadmap */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-zinc-900">What Should You Learn Next?</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex justify-between font-extrabold text-zinc-900"><span>1. System Design Basics</span><span className="text-red-600">High Priority</span></div>
                <p className="text-zinc-500 text-[11px]">Required for {effectiveRole} roles. Focus on scalability and architecture patterns.</p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex justify-between font-extrabold text-zinc-900"><span>2. Testing & QA</span><span className="text-amber-600">Medium Priority</span></div>
                <p className="text-zinc-500 text-[11px]">Unit testing and integration testing are commonly expected.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-zinc-900">Your 90-Day Roadmap</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200"><span className="font-extrabold text-orange-900">Days 0–30</span><p className="text-zinc-800 font-bold mt-0.5">Build foundation skills for {effectiveRole}.</p></div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200"><span className="font-extrabold text-zinc-700">Days 31–60</span><p className="text-zinc-800 font-bold mt-0.5">Build projects and practice problem solving.</p></div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200"><span className="font-extrabold text-zinc-700">Days 61–90</span><p className="text-zinc-800 font-bold mt-0.5">Mock interviews, resume polish, apply to jobs.</p></div>
            </div>
          </div>
        </div>

        {/* Company Matching */}
        <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-xl font-extrabold text-zinc-900">Companies & Opportunities For You</h2>
          <p className="text-xs text-zinc-500">AI-matched opportunities based on your resume and target role. Results are AI assessments and may not reflect current openings.</p>
          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            {skillsList.length > 0 ? (
              <>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <p className="font-extrabold text-zinc-900 text-sm">Product-based company</p>
                    <p className="text-orange-600 font-bold mt-1">{effectiveRole}</p>
                    <p className="text-zinc-600 text-[11px] mt-2">Why: ✓ {skillsList.slice(0, 3).join(' · ✓ ')}</p>
                  </div>
                  <button onClick={() => navigate('/setup')} className="w-full mt-3 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-zinc-800">Practice Interview <ChevronRight className="inline h-3.5 w-3.5" /></button>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <p className="font-extrabold text-zinc-900 text-sm">Startup / Growth company</p>
                    <p className="text-orange-600 font-bold mt-1">Junior {effectiveRole}</p>
                    <p className="text-zinc-600 text-[11px] mt-2">Why: Fresher-friendly + skill match</p>
                  </div>
                  <button onClick={() => navigate('/setup')} className="w-full mt-3 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-zinc-800">Practice Interview <ChevronRight className="inline h-3.5 w-3.5" /></button>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <p className="font-extrabold text-zinc-900 text-sm">Service-based company</p>
                    <p className="text-orange-600 font-bold mt-1">{effectiveRole} Intern</p>
                    <p className="text-zinc-600 text-[11px] mt-2">Why: Entry-level opportunities</p>
                  </div>
                  <button onClick={() => navigate('/setup')} className="w-full mt-3 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-zinc-800">Practice Interview <ChevronRight className="inline h-3.5 w-3.5" /></button>
                </div>
              </>
            ) : (
              <div className="sm:col-span-3 rounded-2xl bg-orange-50/60 border border-orange-200 p-6 text-center">
                <p className="font-bold text-zinc-900">Add your skills to see matching opportunities</p>
                <button onClick={() => setEditMode(true)} className="mt-3 rounded-xl bg-orange-500 px-5 py-2 font-bold text-white shadow hover:bg-orange-600">Complete Profile</button>
              </div>
            )}
          </div>
        </section>

        {/* Start Interview CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-zinc-200">
          <Link to="/setup" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/25 hover:scale-[1.02] transition-all">
            Start AI Interview <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/dashboard" className="rounded-xl border border-zinc-200 px-6 py-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition">
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
