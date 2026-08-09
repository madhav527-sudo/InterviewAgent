import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const COMPANIES = [
  { name: 'Google', logo: 'G', color: '#4285f4', focus: ['System Design', 'ML Infrastructure', 'Production AI', 'Scalability'] },
  { name: 'Microsoft', logo: 'M', color: '#00a4ef', focus: ['Azure AI', 'RAG Systems', 'Enterprise AI', 'LLM Integration'] },
  { name: 'Amazon', logo: 'A', color: '#ff9900', focus: ['AWS AI/ML', 'Scalable Systems', 'Production Deployment', 'Data Pipelines'] },
  { name: 'Meta', logo: 'M', color: '#0866ff', focus: ['LLM Research', 'Embedding Models', 'AI Infrastructure', 'Open Source'] },
  { name: 'OpenAI', logo: 'O', color: '#10a37f', focus: ['Prompt Engineering', 'Fine-Tuning', 'API Design', 'AI Safety'] },
  { name: 'Anthropic', logo: 'A', color: '#d4a574', focus: ['AI Safety', 'Constitutional AI', 'MCP', 'Agent Systems'] },
  { name: 'Startup (AI)', logo: 'S', color: '#8b5cf6', focus: ['Full-Stack AI', 'RAG', 'Rapid Prototyping', 'Production Systems'] },
  { name: 'Other', logo: '?', color: '#6b7280', focus: ['General AI Engineering', 'System Design', 'Problem Solving'] },
]

const ROLES = [
  { title: 'AI/ML Engineer', level: 'Mid-Level', skills: ['Python', 'ML Frameworks', 'RAG', 'Vector DBs', 'LLM APIs'] },
  { title: 'AI Engineer (LLM)', level: 'Mid-Level', skills: ['Prompt Engineering', 'LangChain', 'RAG', 'Fine-Tuning', 'Evaluation'] },
  { title: 'Backend Engineer (AI)', level: 'Mid-Level', skills: ['FastAPI', 'Python', 'System Design', 'AI Deployment', 'APIs'] },
  { title: 'Full-Stack AI Engineer', level: 'Mid-Level', skills: ['React', 'Python', 'RAG', 'LLM Integration', 'Production'] },
  { title: 'AI Research Engineer', level: 'Senior', skills: ['ML Theory', 'Embeddings', 'Model Evaluation', 'Research', 'Papers'] },
  { title: 'MLOps Engineer', level: 'Mid-Level', skills: ['Docker', 'CI/CD', 'Monitoring', 'Deployment', 'Scaling'] },
]

export default function CompanyPage() {
  const navigate = useNavigate()
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [customCompany, setCustomCompany] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)

  const company = COMPANIES.find(c => c.name === selectedCompany)

  const handleProceed = () => {
    if (selectedCompany && selectedRole) {
      setShowAnalysis(true)
      setTimeout(() => navigate('/topics'), 2500)
    }
  }

  const cardStyle: React.CSSProperties = {
    background: '#fff', borderRadius: 16, border: '1px solid #e8e5f0',
    padding: 28, marginBottom: 20,
  }

  if (showAnalysis) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ width: 64, height: 64, border: '3px solid #e5e7eb', borderTopColor: '#ff6b00', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Analyzing Interview Strategy</h2>
          <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 16 }}>
            Combining your CV + Cohort progress + {selectedCompany} + {selectedRole}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {['CV Analysis', 'Cohort Data', 'Company Focus', 'Role Requirements', 'Topic Selection'].map((step, i) => (
              <span key={step} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                background: '#fff7ed', color: '#ea580c',
                animation: `pillPop 0.3s ease-out ${i * 0.3}s both`,
              }}>{step}</span>
            ))}
          </div>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg) } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
            @keyframes pillPop { from { opacity: 0; transform: scale(0.8) } to { opacity: 1; transform: scale(1) } }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Target Company & Role</h1>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Select where you're interviewing — AI will customize your preparation</p>
      </div>

      {/* Company Selection */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>🏢 Select Target Company</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {COMPANIES.map(c => (
            <button key={c.name} onClick={() => setSelectedCompany(c.name)} style={{
              padding: 16, borderRadius: 14, border: selectedCompany === c.name ? `2px solid ${c.color}` : '2px solid #e8e5f0',
              background: selectedCompany === c.name ? `${c.color}08` : '#fff',
              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: c.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 auto 10px',
              }}>{c.logo}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{c.name}</div>
            </button>
          ))}
        </div>
        {selectedCompany === 'Other' && (
          <input value={customCompany} onChange={e => setCustomCompany(e.target.value)} placeholder="Enter company name..."
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' }} />
        )}
        {company && company.name !== 'Other' && (
          <div style={{ padding: 16, background: '#fff7ed', borderRadius: 12, marginTop: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#ea580c', marginBottom: 8 }}>INTERVIEW FOCUS AREAS</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {company.focus.map(f => (
                <span key={f} style={{ padding: '5px 12px', borderRadius: 8, background: '#ffedd5', color: '#c2410c', fontSize: 12, fontWeight: 500 }}>{f}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Role Selection */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>👤 Select Target Role</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {ROLES.map(r => (
            <button key={r.title} onClick={() => setSelectedRole(r.title)} style={{
              padding: 18, borderRadius: 14, border: selectedRole === r.title ? '2px solid #ff6b00' : '2px solid #e8e5f0',
              background: selectedRole === r.title ? '#fff7ed' : '#fff',
              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>{r.level}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {r.skills.slice(0, 4).map(s => (
                  <span key={s} style={{ padding: '3px 8px', borderRadius: 6, background: '#f3f4f6', color: '#4b5563', fontSize: 11 }}>{s}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Proceed button */}
      <button onClick={handleProceed} disabled={!selectedCompany || !selectedRole} style={{
        width: '100%', padding: '16px', borderRadius: 14, border: 'none',
        background: selectedCompany && selectedRole ? '#ff6b00' : '#d1d5db',
        color: '#fff', fontSize: 16, fontWeight: 700, cursor: selectedCompany && selectedRole ? 'pointer' : 'not-allowed',
        transition: 'all 0.2s',
      }}>
        {selectedCompany && selectedRole ? `Prepare for ${selectedRole} at ${selectedCompany} →` : 'Select company and role to continue'}
      </button>
    </div>
  )
}
