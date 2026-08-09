import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setShowWelcome(true)
    await new Promise((r) => setTimeout(r, 1800))
    localStorage.setItem(
      'cohortiq_user',
      JSON.stringify({
        name: name || email.split('@')[0],
        email,
        loggedIn: true,
      })
    )
    navigate('/dashboard')
  }

  // Welcome Loading Animation Screen
  if (showWelcome) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0705]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/15 via-transparent to-transparent blur-3xl" />
        <div className="text-center animate-fade-in z-10 px-4">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-2xl shadow-orange-500/40 animate-pulse">
            <Brain className="h-10 w-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome to CohortIQ
          </h1>
          <p className="mt-3 text-base text-zinc-400">
            Preparing your AI-powered interview experience...
          </p>
          <div className="mx-auto mt-8 h-1.5 w-52 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-full bg-gradient-to-r from-orange-500 to-amber-400 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0c0907] text-white flex items-center justify-center overflow-x-hidden">
      {/* Subtle Ambient Orange Glow Background */}
      <div className="pointer-events-none absolute top-1/4 left-10 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[100px]" />

      {/* Main Centered 1400px Container */}
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-[70px] py-8 lg:py-12 min-h-screen flex items-center">
        
        {/* 2-Column Grid Layout */}
        <div className="w-full grid lg:grid-cols-[minmax(0,1fr)_minmax(400px,460px)] gap-10 lg:gap-20 items-center">
          
          {/* LEFT SIDE CONTENT (55-60% Desktop Width, Max 550px) */}
          <div className="flex flex-col items-start max-w-[550px] w-full">
            
            {/* Logo / Icon */}
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/25 transition-transform hover:scale-105 mb-10 sm:mb-[44px]">
              <Brain className="h-7 w-7" />
            </div>

            {/* CohortIQ Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.1] mb-5 sm:mb-[22px]">
              Cohort<span className="text-orange-500">IQ</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-[22px] leading-relaxed text-zinc-300/90 font-normal mb-9 sm:mb-[38px]">
              Turn your learning journey into a{' '}
              <span className="text-orange-500 font-bold underline decoration-orange-500/30 underline-offset-4">
                real technical interview
              </span>
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2.5 w-full">
              {['AI-Powered', 'CV Analysis', 'Adaptive', 'Multi-Turn', 'Video Interview'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 h-[38px] px-4 rounded-full text-xs font-semibold bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-orange-500/40 hover:text-white transition-all shadow-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-orange-500" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT LOGIN CARD (Width 420-460px) */}
          <div className="w-full max-w-[460px] mx-auto lg:mx-0">
            <div className="w-full rounded-[24px] border border-zinc-800/80 bg-zinc-900/80 p-8 sm:p-[40px] shadow-2xl shadow-orange-500/10 backdrop-blur-2xl transition-all">
              
              {/* Welcome Heading */}
              <h2 className="text-3xl sm:text-[34px] font-extrabold text-white tracking-tight mb-2 sm:mb-[10px]">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>

              {/* Subtitle */}
              <p className="text-sm text-zinc-400 mb-8 sm:mb-[34px]">
                {isLogin
                  ? 'Enter your details to sign in to your account'
                  : 'Start your AI technical interview practice'}
              </p>

              {/* FORM CONTAINER WITH EXACT BOX ALIGNMENT */}
              <form onSubmit={handleSubmit} className="w-full space-y-0">
                
                {/* Full Name field (Signup mode) */}
                {!isLogin && (
                  <div className="w-full mb-5">
                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Sharma"
                      required
                      className="w-full h-[54px] sm:h-[58px] px-4 rounded-xl border border-zinc-800 bg-zinc-950/80 text-sm text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all box-border"
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="w-full mb-5 sm:mb-[22px]">
                  <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    required
                    className="w-full h-[54px] sm:h-[58px] px-4 rounded-xl border border-zinc-800 bg-zinc-950/80 text-sm text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all box-border"
                  />
                </div>

                {/* Password Field */}
                <div className="w-full mb-7 sm:mb-[28px]">
                  <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-[54px] sm:h-[58px] px-4 rounded-xl border border-zinc-800 bg-zinc-950/80 text-sm text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all box-border"
                  />
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[54px] sm:h-[58px] rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-base font-bold shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 box-border"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 text-sm">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Signup Text Switcher */}
              <div className="mt-7 sm:mt-[28px] mb-7 sm:mb-[28px] text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs sm:text-sm text-zinc-400 hover:text-orange-400 font-medium transition-colors"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6 flex items-center justify-center">
                <div className="w-full border-t border-zinc-800" />
                <span className="absolute bg-[#130f0c] px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  or continue with
                </span>
              </div>

              {/* Equal-Width Social Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
