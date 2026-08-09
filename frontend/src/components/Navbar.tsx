import { Link, useLocation } from 'react-router-dom'
import { Brain, Menu, X, ArrowRight, User } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'AI Resume' },
  { to: '/setup', label: 'Interview Practice' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = (to: string) => {
    setMobileOpen(false)
    if (to.startsWith('#')) {
      const targetElem = document.getElementById(to.replace('#', ''))
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header className="sticky top-3 z-50 mx-auto max-w-6xl px-4 sm:px-6">
      {/* Pill-shaped Floating Navbar */}
      <div className="flex h-16 items-center justify-between rounded-full border border-zinc-200/80 bg-white/90 px-4 sm:px-6 shadow-lg shadow-zinc-900/5 backdrop-blur-xl transition-all">
        
        {/* Left Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white shadow-md shadow-zinc-900/20 transition-transform group-hover:scale-105">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            Cohort<span className="text-zinc-500">IQ</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.to.startsWith('#')
              ? false
              : location.pathname === link.to

            return (
              <Link
                key={link.label}
                to={link.to.startsWith('#') ? '#' : link.to}
                onClick={() => handleNavClick(link.to)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right CTA Area */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <User className="h-3.5 w-3.5" />
            Login
          </Link>
          <Link
            to="/setup"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-zinc-900/20 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="mt-2 rounded-3xl border border-zinc-200 bg-white/95 p-4 shadow-xl backdrop-blur-xl md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to.startsWith('#') ? '#' : link.to}
                onClick={() => handleNavClick(link.to)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  location.pathname === link.to
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-2xl border border-zinc-200 py-3 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Login
            </Link>
            <Link
              to="/setup"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-center text-sm font-bold text-white shadow-md shadow-orange-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
