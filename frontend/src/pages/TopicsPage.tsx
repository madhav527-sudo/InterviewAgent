import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AI_TOPICS = [
  { name: 'Prompt Engineering', days: [2, 3, 4], priority: 'high', aiSelected: true, reason: 'Strong CV match + Cohort performance', icon: '💬' },
  { name: 'RAG Architecture', days: [5, 6, 7, 8, 9], priority: 'high', aiSelected: true, reason: 'CV project experience — test depth', icon: '🔍' },
  { name: 'Vector Databases', days: [10, 11, 12, 13], priority: 'high', aiSelected: true, reason: 'Repeated attempts in Cohort — verify understanding', icon: '📊' },
  { name: 'Agentic AI', days: [17, 18, 19], priority: 'medium', aiSelected: true, reason: 'Relevant for target role', icon: '🤖' },
  { name: 'MCP', days: [20, 21, 22], priority: 'medium', aiSelected: false, reason: 'Skipped in curriculum', icon: '🔗' },
  { name: 'AI Deployment', days: [26, 27, 28, 29], priority: 'high', aiSelected: true, reason: 'CV gap — weak production skills', icon: '🚀' },
  { name: 'LangChain & LangGraph', days: [23, 24, 25], priority: 'medium', aiSelected: false, reason: 'In progress in curriculum', icon: '⛓️' },
  { name: 'Production AI Systems', days: [16, 28, 29, 30, 31], priority: 'high', aiSelected: true, reason: 'Critical for target company', icon: '⚙️' },
]

export default function TopicsPage() {
  const navigate = useNavigate()
  const [topics, setTopics] = useState(AI_TOPICS)
  const [interviewMode, setInterviewMode] = useState<'text' | 'video'>('text')
  const [numQuestions, setNumQuestions] = useState(10)

  const selected = topics.filter(t => t.aiSelected)

  const toggleTopic = (name: string) => {
    setTopics(topics.map(t => t.name === name ? { ...t, aiSelected: !t.aiSelected } : t))
  }

  const handleStart = () => navigate('/setup')

  const cardStyle: React.CSSProperties = {
    background: '#fff', borderRadius: 16, border: '1px solid #e8e5f0', padding: 28,
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Interview Topics</h1>
        <p style={{ color: '#6b7280', fontSize: 15 }}>AI-selected based on your CV, Cohort progress, and target role</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        <div>
          {/* AI Selection banner */}
          <div style={{
            padding: 20, borderRadius: 14, marginBottom: 20,
            background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
            border: '1px solid #fed7aa',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>🧠</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#ea580c' }}>AI Topic Selection</span>
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
              Topics are selected by analyzing your CV projects, Cohort learning signals, repeated attempts, skipped modules, and target company requirements. You can add or remove topics below.
            </p>
          </div>

          {/* Topic list */}
          {topics.map(t => (
            <div key={t.name} onClick={() => toggleTopic(t.name)} style={{
              ...cardStyle, marginBottom: 12, cursor: 'pointer',
              borderColor: t.aiSelected ? '#fdba74' : '#e8e5f0',
              background: t.aiSelected ? '#fff7ed' : '#fff',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 16, padding: 20,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                border: t.aiSelected ? 'none' : '2px solid #d1d5db',
                background: t.aiSelected ? '#ff6b00' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 14,
              }}>{t.aiSelected ? '✓' : ''}</div>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>{t.name}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: t.priority === 'high' ? '#fef2f2' : '#fffbeb',
                    color: t.priority === 'high' ? '#dc2626' : '#d97706',
                  }}>{t.priority}</span>
                </div>
                <p style={{ fontSize: 12, color: '#6b7280' }}>{t.reason}</p>
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {t.days.map(d => (
                    <span key={d} style={{ padding: '2px 7px', borderRadius: 4, background: '#f3f4f6', color: '#6b7280', fontSize: 11 }}>Day {d}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div>
          <div style={{...cardStyle, marginBottom: 20}}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>INTERVIEW CONFIG</h3>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#6b7280', marginBottom: 8, display: 'block' }}>Interview Mode</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['text', 'video'] as const).map(mode => (
                  <button key={mode} onClick={() => setInterviewMode(mode)} style={{
                    flex: 1, padding: '12px', borderRadius: 12,
                    border: interviewMode === mode ? '2px solid #ff6b00' : '2px solid #e8e5f0',
                    background: interviewMode === mode ? '#fff7ed' : '#fff',
                    cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    color: interviewMode === mode ? '#ff6b00' : '#6b7280',
                  }}>
                    {mode === 'text' ? '💬 Text' : '📹 Video'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#6b7280', marginBottom: 8, display: 'block' }}>
                Questions: {numQuestions}
              </label>
              <input type="range" min={8} max={15} value={numQuestions} onChange={e => setNumQuestions(+e.target.value)}
                style={{ width: '100%', accentColor: '#ff6b00' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
                <span>Quick (8)</span><span>Deep (15)</span>
              </div>
            </div>
          </div>

          <div style={{...cardStyle, marginBottom: 20}}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>SELECTION SUMMARY</h3>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ff6b00', marginBottom: 4 }}>{selected.length}</div>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>topics selected for interview</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selected.map(t => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4b5563' }}>
                  <span>{t.icon}</span> {t.name}
                </div>
              ))}
            </div>
          </div>

          <div style={{...cardStyle, marginBottom: 20}}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>CURRICULUM COVERAGE</h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
              Days: {[...new Set(selected.flatMap(t => t.days))].sort((a, b) => a - b).length} of 31
            </p>
            <div style={{ height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden', marginTop: 8 }}>
              <div style={{
                width: `${([...new Set(selected.flatMap(t => t.days))].length / 31) * 100}%`,
                height: '100%', background: '#ff6b00', borderRadius: 3,
                transition: 'width 0.3s',
              }} />
            </div>
          </div>

          <button onClick={handleStart} disabled={selected.length < 4} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            background: selected.length >= 4 ? '#ff6b00' : '#d1d5db',
            color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: selected.length >= 4 ? 'pointer' : 'not-allowed',
          }}>
            {selected.length >= 4 ? `Start ${interviewMode === 'video' ? 'Video' : 'Text'} Interview →` : 'Select at least 4 topics'}
          </button>
        </div>
      </div>
    </div>
  )
}
