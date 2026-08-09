import { useState } from 'react'
import { Plus, Minus, HelpCircle } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const leftFaqs: FAQItem[] = [
  {
    id: 1,
    question: 'What is this AI career platform?',
    answer: 'It is an AI-powered platform that helps you build better resumes, practice interviews, and improve your communication skills.',
  },
  {
    id: 2,
    question: 'How does the AI interview practice work?',
    answer: 'AI asks realistic interview questions based on your selected role, experience, and interview type.',
  },
  {
    id: 3,
    question: 'Can I practice technical and HR interviews?',
    answer: 'Yes. You can practice technical, HR, behavioral, aptitude, and role-specific interview questions.',
  },
  {
    id: 4,
    question: 'Can AI analyze my interview answers?',
    answer: 'Yes. The platform analyzes your answers and provides feedback on clarity, relevance, confidence, and communication.',
  },
  {
    id: 5,
    question: 'Can I create an ATS-friendly resume?',
    answer: 'Yes. The AI Resume Builder helps create structured, professional, and ATS-friendly resumes.',
  },
  {
    id: 6,
    question: 'Can I improve my communication skills?',
    answer: 'Yes. You receive personalized feedback and suggestions to improve your communication during interviews.',
  },
  {
    id: 7,
    question: 'Can I practice interviews for a specific job role?',
    answer: 'Yes. Select a job role such as Software Developer, Data Analyst, Web Developer, or another position.',
  },
  {
    id: 8,
    question: 'Does the platform generate interview questions automatically?',
    answer: 'Yes. AI can generate questions based on your selected job role, skills, experience, and interview level.',
  },
]

const rightFaqs: FAQItem[] = [
  {
    id: 9,
    question: 'Can the AI ask follow-up questions?',
    answer: 'Yes. AI can generate follow-up questions based on your previous answers to make practice more realistic.',
  },
  {
    id: 10,
    question: 'Will I get an interview performance score?',
    answer: 'Yes. You can receive an overall score along with category-wise performance such as communication, technical knowledge, confidence, and answer quality.',
  },
  {
    id: 11,
    question: 'Can I track my interview progress?',
    answer: 'Yes. Your dashboard can show previous practice sessions, scores, improvements, and areas that need more practice.',
  },
  {
    id: 12,
    question: 'Is the platform suitable for college students?',
    answer: 'Yes. It is designed for students, freshers, and job seekers preparing for internships, placements, and interviews.',
  },
  {
    id: 13,
    question: 'Is my resume data secure?',
    answer: 'We use appropriate security practices to protect your uploaded resume and account information.',
  },
  {
    id: 14,
    question: 'Is there a free version?',
    answer: 'We offer a free plan with basic resume and interview features, while advanced capabilities are available through premium plans.',
  },
  {
    id: 15,
    question: 'Can I use the platform on mobile?',
    answer: 'Yes. The website is fully responsive and works across desktop, tablet, and mobile devices.',
  },
  {
    id: 16,
    question: 'How do I get started?',
    answer: 'Create your profile, upload or build your resume, choose an interview practice session, and start preparing with AI.',
  },
]

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggleFaq = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const renderCard = (faq: FAQItem) => {
    const isOpen = openId === faq.id

    return (
      <div
        key={faq.id}
        className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'border-zinc-800 bg-white shadow-lg shadow-zinc-900/10'
            : 'border-zinc-200/90 bg-white shadow-sm hover:border-zinc-400 hover:shadow-md'
        }`}
      >
        <button
          type="button"
          onClick={() => toggleFaq(faq.id)}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${faq.id}`}
          className="flex w-full items-center justify-between p-5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-200 rounded-2xl"
        >
          <span className="text-base font-bold text-zinc-900 pr-4 leading-snug group-hover:text-zinc-700 transition-colors">
            {faq.question}
          </span>
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              isOpen
                ? 'bg-zinc-900 text-white rotate-180'
                : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 group-hover:text-zinc-900'
            }`}
          >
            {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
        </button>

        {isOpen && (
          <div
            id={`faq-answer-${faq.id}`}
            className="animate-fade-in px-5 pb-5 pt-1 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100/80"
          >
            {faq.answer}
          </div>
        )}
      </div>
    )
  }

  return (
    <section id="faq" className="relative border-t border-zinc-100 bg-zinc-50/60 py-20 overflow-hidden">
      {/* Subtle Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-r from-purple-200/15 via-sky-100/15 to-zinc-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3.5 py-1 text-xs font-bold text-zinc-800">
            <HelpCircle className="h-3.5 w-3.5 text-zinc-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-zinc-600">
            Got questions? We've got answers.
          </p>
        </div>

        {/* Two-Column Desktop / Single-Column Mobile Layout */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-5">
            {leftFaqs.map(renderCard)}
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-5">
            {rightFaqs.map(renderCard)}
          </div>
        </div>
      </div>
    </section>
  )
}
