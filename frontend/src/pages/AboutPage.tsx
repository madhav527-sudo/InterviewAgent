import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Brain,
  Database,
  GitBranch,
  Layers,
  MessageSquare,
  Sparkles,
  Target,
} from 'lucide-react'

const steps = [
  {
    icon: Database,
    title: 'Analyze Your Journey',
    description:
      'CohortIQ ingests your 31-day cohort data — completed missions, skipped topics, repeated attempts, and learning signals — to build a comprehensive candidate profile.',
  },
  {
    icon: Target,
    title: 'Select Smart Topics',
    description:
      'The AI interviewer prioritizes your weak areas (Vector Retrieval, Production Deployment) while validating strengths (Prompt Engineering, RAG Architecture).',
  },
  {
    icon: MessageSquare,
    title: 'Conduct Adaptive Interview',
    description:
      '8–15 questions across 4+ curriculum days with contextual follow-ups. "You mentioned retrieval — how would you improve retrieval quality?"',
  },
  {
    icon: Sparkles,
    title: 'Generate Actionable Feedback',
    description:
      'Structured report with scores across technical knowledge, system design, and communication — plus a personalized revision plan mapped to curriculum days.',
  },
]

const architecture = [
  { icon: Brain, label: 'LLM Reasoning Engine', desc: 'Adaptive question generation & evaluation' },
  { icon: GitBranch, label: 'LangGraph Orchestration', desc: 'Multi-step agent workflows' },
  { icon: Layers, label: 'RAG Pipeline', desc: 'Curriculum-aware context retrieval' },
  { icon: Database, label: 'Vector Database', desc: 'Semantic search over cohort content' },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          How CohortIQ Works
        </h1>
        <p className="mt-3 text-lg text-zinc-600">
          From learning journey to realistic technical interview in four steps.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="flex gap-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <step.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-orange-600">Step {i + 1}</span>
              </div>
              <h3 className="mt-1 font-semibold text-zinc-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture */}
      <div className="mt-16">
        <h2 className="text-center text-xl font-semibold text-zinc-900">
          Built for Production AI
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600">
          Architecture ready for real LLM APIs, RAG pipelines, and agent orchestration.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {architecture.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-5"
            >
              <item.icon className="h-5 w-5 text-orange-600" />
              <p className="mt-2 font-medium text-zinc-900">{item.label}</p>
              <p className="mt-1 text-xs text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptive features */}
      <div className="mt-16 rounded-xl border border-zinc-200 bg-white p-8">
        <h2 className="font-semibold text-zinc-900">What Makes It Real</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            'Contextual memory across all interview turns',
            'Follow-up questions based on your specific answers',
            'Adaptive difficulty that increases or decreases',
            'Intelligent topic switching across curriculum days',
            'Contradiction and misconception detection',
            'Strength and weakness identification in real-time',
            'No scores revealed during the interview',
            'Personalized revision plan at the end',
          ].map((feature) => (
            <div key={feature} className="flex items-start gap-2 text-sm text-zinc-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/setup"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          Start Your Interview
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
