import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  FileText,
  Video,
  CheckCircle2,
  Brain,
  Zap,
  Target,
  ChevronLeft,
  ChevronRight,
  Download,
  Clock,
} from 'lucide-react'

const featureSlides = [
  {
    id: 'resume',
    tabLabel: 'Resume Builder',
    slideTitle: 'AI Resume Builder',
    badge: 'SLIDE 1',
    description: 'ATS-optimized resume generator with real-time scoring and AI content improvements.',
  },
  {
    id: 'interview',
    tabLabel: 'Mock Interview',
    slideTitle: 'AI Mock Interview',
    badge: 'SLIDE 2',
    description: 'Real-time conversational voice interview with dynamic follow-ups from AI persona Aria.',
  },
  {
    id: 'analytics',
    tabLabel: 'Analytics',
    slideTitle: 'Smart Interview Analytics',
    badge: 'SLIDE 3',
    description: 'Comprehensive scoring metrics for technical accuracy, communication, and confidence.',
  },
  {
    id: 'feedback',
    tabLabel: 'AI Feedback',
    slideTitle: 'Instant AI Feedback',
    badge: 'SLIDE 4',
    description: 'Instant pinpointing of strengths, gaps, misconceptions, and actionable revision steps.',
  },
  {
    id: 'dashboard',
    tabLabel: 'Career Dashboard',
    slideTitle: 'Your Career Dashboard',
    badge: 'SLIDE 5',
    description: 'Unified career progress tracker with topic mastery, history, and placement readiness.',
  },
]

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto slideshow every 3.5 seconds
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureSlides.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [isPaused])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featureSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length)

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-hidden">
      {/* Background Gradients (Subtle Purple, Blue, & Orange/Pink Ambient Glows) */}
      <div className="relative">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[1100px] rounded-full bg-gradient-to-tr from-purple-200/30 via-sky-100/30 to-orange-100/40 blur-3xl" />
        <div className="pointer-events-none absolute top-96 left-10 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-3xl" />
        <div className="pointer-events-none absolute top-96 right-10 h-[400px] w-[400px] rounded-full bg-amber-100/40 blur-3xl" />

        {/* HERO SECTION */}
        <section className="relative mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            
            {/* Tagline Pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100/90 px-4 py-1.5 text-xs font-bold text-zinc-800 shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-zinc-600 animate-pulse" />
              <span>Next-Gen Placement Preparation Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl sm:leading-[1.15]">
              Build Your Career with AI
            </h1>

            {/* Second Highlighted Line with Dynamic Shimmer/Gradient Shift & Scale Animation */}
            <div className="mt-2 text-3xl font-extrabold sm:text-5xl sm:leading-tight">
              <span className="inline-block bg-gradient-to-r from-zinc-900 via-slate-600 via-zinc-700 to-zinc-900 bg-clip-text text-transparent animate-text-gradient font-black tracking-tight transition-transform duration-300 hover:scale-[1.03]">
                Resume. Practice. Get Hired.
              </span>
            </div>

            {/* Subtitle */}
            <p className="mt-6 text-base text-zinc-600 sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Create powerful resumes, practice interviews with AI, and get personalized feedback to become placement-ready.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/setup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-zinc-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Practicing →
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3.5 text-base font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900"
              >
                Explore Features →
              </a>
            </div>
          </div>

          {/* INTERACTIVE FEATURE TABS (Top Switcher) */}
          <div className="mt-14 sm:mt-18">
            <div className="flex justify-center mb-4">
              <div
                className="flex items-center gap-1.5 overflow-x-auto rounded-full border border-zinc-200/80 bg-white/90 p-1.5 shadow-md backdrop-blur-xl max-w-full no-scrollbar"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {featureSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => {
                      setCurrentSlide(idx)
                      setIsPaused(true)
                    }}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                      currentSlide === idx
                        ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/20 scale-[1.02]'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    {slide.tabLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* DYNAMIC PRODUCT PREVIEW (Interactive Browser Mockup) */}
            <div
              className="relative mx-auto max-w-5xl rounded-3xl border border-zinc-200/90 bg-white/90 p-3 sm:p-5 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl transition-all"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Decorative Subtle Radial Glow behind preview */}
              <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-zinc-500/10 blur-xl -z-10" />

              {/* Browser Window Bar */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-[11px] font-mono text-zinc-400 hidden sm:inline-block">
                    app.cohortiq.ai/{featureSlides[currentSlide].id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-zinc-800 border border-zinc-200">
                    {featureSlides[currentSlide].badge} • {featureSlides[currentSlide].slideTitle}
                  </span>
                </div>
              </div>

              {/* SLIDE CONTENT AREA (HTML/CSS Interactive Feature Screens) */}
              <div className="min-h-[380px] sm:min-h-[440px] rounded-2xl bg-zinc-50/70 p-4 sm:p-6 border border-zinc-100">

                {/* SLIDE 1 — AI RESUME BUILDER */}
                {currentSlide === 0 && (
                  <div className="animate-fade-in space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-zinc-900">Alex Sharma — Resume Dashboard</h3>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Verified</span>
                        </div>
                        <p className="text-xs text-zinc-500">Target Role: AI Engineer / Full-Stack Developer</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-600">
                          <Download className="h-3.5 w-3.5" /> Download PDF
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-zinc-500 font-medium">Resume Quality Score</p>
                        <p className="text-3xl font-extrabold text-orange-500 mt-1">88<span className="text-sm font-normal text-zinc-400">/100</span></p>
                        <div className="mt-2 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                          <div className="h-full bg-orange-500 w-[88%]" />
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-zinc-500 font-medium">ATS Match Score</p>
                        <p className="text-3xl font-extrabold text-emerald-600 mt-1">92%</p>
                        <p className="text-[11px] text-emerald-600 font-medium mt-1">✓ High match for Google & Meta ATS</p>
                      </div>

                      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-zinc-500 font-medium">AI Suggestions</p>
                        <p className="text-lg font-bold text-zinc-900 mt-1">3 Action Items</p>
                        <p className="text-[11px] text-orange-600 font-medium mt-1">Add production metrics to projects</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-800 border-b border-zinc-100 pb-2">
                        <span>Resume Sections</span>
                        <span className="text-orange-600">AI Optimization Active</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                          <span className="font-semibold">Work Experience</span>
                          <span className="text-emerald-600 font-bold">100% Optimized</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                          <span className="font-semibold">Technical Projects (DocuMind RAG)</span>
                          <span className="text-emerald-600 font-bold">95% Optimized</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                          <span className="font-semibold">Skills Matrix (Python, RAG, React)</span>
                          <span className="text-emerald-600 font-bold">100% Optimized</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                          <span className="font-semibold">Education & Certifications</span>
                          <span className="text-emerald-600 font-bold">90% Optimized</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 2 — AI MOCK INTERVIEW */}
                {currentSlide === 1 && (
                  <div className="animate-fade-in space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                          A
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">Aria — AI Technical Interviewer</p>
                          <p className="text-xs text-orange-600 font-semibold animate-pulse">🔊 Speaking follow-up question...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-mono">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        <span>04:12</span>
                      </div>
                    </div>

                    {/* Interview Question Box */}
                    <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4">
                      <span className="text-[11px] font-bold uppercase text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                        Question 3 • RAG Architecture & Vector Search
                      </span>
                      <p className="mt-2 text-sm font-semibold text-zinc-900 leading-relaxed">
                        "You mentioned using hybrid retrieval with ChromaDB in your DocuMind project. How would you optimize chunking strategies and re-ranking if latency exceeds 500ms?"
                      </p>
                    </div>

                    {/* Speech Waveform Simulation */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                        <span className="text-xs font-bold text-zinc-700">Listening to your response...</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[40, 75, 30, 90, 60, 85, 45, 95, 50, 70].map((h, i) => (
                          <span
                            key={i}
                            className="w-1 bg-orange-500 rounded-full transition-all duration-300"
                            style={{ height: `${h * 0.25}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button className="text-xs text-zinc-500 hover:text-zinc-800">Skip Question</button>
                      <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-600">
                        Submit Answer <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* SLIDE 3 — SMART INTERVIEW ANALYTICS */}
                {currentSlide === 2 && (
                  <div className="animate-fade-in space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900">Session Analytics #IQ-8921</h3>
                        <p className="text-xs text-zinc-500">Comprehensive AI assessment of completed session</p>
                      </div>
                      <span className="rounded-xl bg-emerald-100 px-3 py-1 text-sm font-extrabold text-emerald-800">Grade A</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                        <p className="text-[11px] text-zinc-500 font-medium">Overall Score</p>
                        <p className="text-2xl font-extrabold text-orange-500 mt-1">89%</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                        <p className="text-[11px] text-zinc-500 font-medium">Communication</p>
                        <p className="text-2xl font-extrabold text-emerald-600 mt-1">92%</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                        <p className="text-[11px] text-zinc-500 font-medium">Technical Depth</p>
                        <p className="text-2xl font-extrabold text-indigo-600 mt-1">89%</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                        <p className="text-[11px] text-zinc-500 font-medium">Confidence Score</p>
                        <p className="text-2xl font-extrabold text-amber-600 mt-1">86%</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
                      <p className="text-xs font-bold text-zinc-800">Skill Domain Breakdown</p>
                      {[
                        { name: 'RAG Pipeline Design', score: 92, status: 'Mastered' },
                        { name: 'Vector Indexing & Hybrid Search', score: 85, status: 'Proficient' },
                        { name: 'Prompt Optimization', score: 90, status: 'Mastered' },
                        { name: 'System Scalability', score: 78, status: 'Developing' },
                      ].map((item) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{item.name}</span>
                            <span className="text-orange-600">{item.score}% ({item.status})</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${item.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SLIDE 4 — INSTANT AI FEEDBACK */}
                {currentSlide === 3 && (
                  <div className="animate-fade-in space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
                      <h3 className="text-lg font-bold text-zinc-900">Personalized AI Evaluation & Revision Plan</h3>
                      <span className="text-xs text-orange-600 font-bold">Updated Just Now</span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Key Strengths Shown
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-xs text-emerald-900">
                          <li>• Clear explanation of dense vector embeddings vs sparse BM25 retrieval</li>
                          <li>• Strong practical grasp of LangChain LCEL chain construction</li>
                          <li>• Excellent structured verbal communication without filler words</li>
                        </ul>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                          <Target className="h-4 w-4 text-amber-600" /> Target Areas for Improvement
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-xs text-amber-900">
                          <li>• Provide concrete latency numbers when discussing vector search optimization</li>
                          <li>• Clarify deployment monitoring tools (Prometheus / LangSmith)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-2">
                      <p className="text-xs font-bold text-zinc-900">Recommended Next Step</p>
                      <p className="text-xs text-zinc-600">
                        Review Day 12 Curriculum module: <strong className="text-orange-600">Vector Retrieval Optimization & Re-Ranking</strong> to fix identified gaps before your next interview.
                      </p>
                    </div>
                  </div>
                )}

                {/* SLIDE 5 — CAREER DASHBOARD */}
                {currentSlide === 4 && (
                  <div className="animate-fade-in space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900">Candidate Career Dashboard</h3>
                        <p className="text-xs text-zinc-500">Cohort Progress: 22 of 31 Days Completed</p>
                      </div>
                      <Link to="/setup" className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-600">
                        Start New Practice
                      </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-zinc-200 bg-white p-4">
                        <p className="text-xs text-zinc-500 font-semibold">Resume ATS Readiness</p>
                        <p className="text-2xl font-extrabold text-orange-500 mt-1">92%</p>
                        <p className="text-[10px] text-emerald-600 mt-1 font-bold">✓ Placement Ready</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-4">
                        <p className="text-xs text-zinc-500 font-semibold">Average Mock Score</p>
                        <p className="text-2xl font-extrabold text-indigo-600 mt-1">89.4%</p>
                        <p className="text-[10px] text-zinc-400 mt-1">Based on 8 recent sessions</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-4">
                        <p className="text-xs text-zinc-500 font-semibold">Placement Confidence</p>
                        <p className="text-2xl font-extrabold text-emerald-600 mt-1">High</p>
                        <p className="text-[10px] text-emerald-600 mt-1 font-bold">Top 5% in Cohort Batch</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-2">
                      <p className="text-xs font-bold text-zinc-900">Recent Interview History</p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50">
                          <span className="font-semibold text-zinc-800">Senior AI Engineer Simulation • Meta Focus</span>
                          <span className="text-emerald-600 font-bold">Score 92%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50">
                          <span className="font-semibold text-zinc-800">RAG & Vector Search Deep Dive</span>
                          <span className="text-orange-600 font-bold">Score 88%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Controls Bar */}
              <div className="mt-4 flex items-center justify-between px-2 pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  {featureSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentSlide(i)
                        setIsPaused(true)
                      }}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === i ? 'w-6 bg-orange-500' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* WHY CHOOSE US? SECTION */}
      <section id="features" className="border-t border-zinc-100 bg-zinc-50/70 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Why Choose Us?
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight sm:text-4xl mt-3">
              Engineered for Realistic Career Success
            </h2>
            <p className="mt-3 text-base text-zinc-600">
              Everything you need to optimize your resume, master voice interviews, and land top offers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">AI-Powered</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Get intelligent recommendations based on your resume and interview performance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">ATS Optimized</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Create resumes designed to perform better with applicant tracking systems.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Realistic Interviews</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Practice realistic interview questions with AI voice synthesis and dynamic follow-ups.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Instant Feedback</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Understand your weaknesses and improve after every practice session with targeted plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / STATS SECTION */}
      <section className="border-t border-zinc-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-800 p-8 sm:p-12 text-white shadow-2xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
              <div>
                <p className="text-4xl font-extrabold text-orange-400">98%</p>
                <p className="mt-1 text-xs font-semibold text-zinc-300">ATS Optimization Score</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-amber-400">10k+</p>
                <p className="mt-1 text-xs font-semibold text-zinc-300">AI Interviews Conducted</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-emerald-400">4.9 / 5</p>
                <p className="mt-1 text-xs font-semibold text-zinc-300">Candidate Satisfaction Rating</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-sky-400">85%</p>
                <p className="mt-1 text-xs font-semibold text-zinc-300">Placement Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-10 text-xs text-zinc-500">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-xs">
              <Brain className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-zinc-900">CohortIQ</span>
            <span>© 2026 CohortIQ Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <Link to="/profile" className="hover:text-zinc-900">AI Resume</Link>
            <Link to="/setup" className="hover:text-zinc-900">Interview Practice</Link>
            <Link to="/dashboard" className="hover:text-zinc-900">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
