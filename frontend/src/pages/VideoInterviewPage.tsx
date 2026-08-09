import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import InterviewAvatar from '../components/InterviewAvatar'
import type { SessionState } from '../types'

type BrowserSpeechRecognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: any) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type BrowserWindow = Window & typeof globalThis & {
  SpeechRecognition?: new () => BrowserSpeechRecognition
  webkitSpeechRecognition?: new () => BrowserSpeechRecognition
}

interface ChatMessage {
  role: 'interviewer' | 'candidate'
  content: string
  timestamp: string
}

const STAGE_LABELS: Record<string, string> = {
  introduction: 'Introduction',
  background: 'Background',
  technical: 'Technical',
  deep_dive: 'Deep Dive',
  behavioral: 'Behavioral',
  closing: 'Closing',
}

const STAGE_ORDER = ['introduction', 'background', 'technical', 'deep_dive', 'behavioral', 'closing']

export default function VideoInterviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [session, setSession] = useState<SessionState | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [avatarState, setAvatarState] = useState<'idle' | 'speaking' | 'listening' | 'thinking'>('idle')
  const [currentStage, setCurrentStage] = useState('introduction')
  const lastQuestionIdRef = useRef<string | null>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [])

  // Select best female voice
  const getFemaleVoice = useCallback(() => {
    const voices = window.speechSynthesis?.getVoices() || []
    // Prefer specific high-quality female voices
    const preferred = [
      'Microsoft Zira',
      'Google UK English Female',
      'Samantha',
      'Karen',
      'Moira',
      'Tessa',
      'Victoria',
      'Fiona',
    ]
    for (const name of preferred) {
      const v = voices.find(v => v.name.includes(name))
      if (v) return v
    }
    // Fallback: any female voice
    const female = voices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Zira') || v.name.includes('Hazel'))
    if (female) return female
    // Fallback: any English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0] || null
  }, [])

  useEffect(() => {
    if (sessionId) {
      api.getSession(sessionId).then(s => {
        setSession(s)
        if (s.current_question) {
          const questionText = s.current_question.context
            ? `${s.current_question.context} ${s.current_question.text}`
            : s.current_question.text
          setMessages([{
            role: 'interviewer',
            content: questionText,
            timestamp: new Date().toISOString(),
          }])
          lastQuestionIdRef.current = s.current_question.id
        }
        setCurrentStage((s as any).interview_stage || 'introduction')
      }).catch(() => {})
    }
    // Start camera
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(s => {
        streamRef.current = s
        setStream(s)
        if (videoRef.current) videoRef.current.srcObject = s
      })
      .catch(() => setCameraOn(false))

    // Load voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
    }

    const timer = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => {
      clearInterval(timer)
      recognitionRef.current?.stop()
      streamRef.current?.getTracks().forEach(t => t.stop())
      window.speechSynthesis?.cancel()
    }
  }, [sessionId])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setIsListening(false)
    setAvatarState('idle')
  }, [])

  const startListening = useCallback(() => {
    if (!micOn || recognitionRef.current) return
    const Recognition = (window as BrowserWindow).SpeechRecognition || (window as BrowserWindow).webkitSpeechRecognition
    if (!Recognition) return

    const recognition = new Recognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }
      setAnswer(transcript.trim())
    }
    recognition.onerror = () => {
      setIsListening(false)
      setAvatarState('idle')
    }
    recognition.onend = () => {
      recognitionRef.current = null
      setIsListening(false)
      setAvatarState('idle')
    }
    recognitionRef.current = recognition
    try {
      recognition.start()
      setIsListening(true)
      setAvatarState('listening')
    } catch {
      recognitionRef.current = null
    }
  }, [micOn])

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return
    stopListening()
    window.speechSynthesis.cancel()
    
    const speech = new SpeechSynthesisUtterance(text)
    speech.rate = 0.92
    speech.pitch = 1.05
    const voice = getFemaleVoice()
    if (voice) speech.voice = voice
    
    speech.onstart = () => {
      setAiSpeaking(true)
      setAvatarState('speaking')
    }
    speech.onend = () => {
      setAiSpeaking(false)
      setAvatarState('idle')
      startListening()
    }
    speech.onerror = () => {
      setAiSpeaking(false)
      setAvatarState('idle')
    }
    window.speechSynthesis.speak(speech)
  }, [stopListening, startListening, getFemaleVoice])

  // Speak when new question arrives
  useEffect(() => {
    if (session?.current_question && session.current_question.id !== lastQuestionIdRef.current) {
      lastQuestionIdRef.current = session.current_question.id
      const q = session.current_question
      const text = q.context ? `${q.context} ${q.text}` : q.text
      speakText(text)
    }
  }, [session?.current_question?.id, speakText])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(t => { t.enabled = !t.enabled })
      setCameraOn(!cameraOn)
    }
  }
  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(t => { t.enabled = !t.enabled })
      setMicOn(!micOn)
      if (micOn) stopListening()
      else if (!aiSpeaking) startListening()
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim() || !sessionId || submitting) return
    stopListening()
    setSubmitting(true)
    setAvatarState('thinking')
    
    const userAnswer = answer.trim()
    setMessages(prev => [...prev, {
      role: 'candidate',
      content: userAnswer,
      timestamp: new Date().toISOString(),
    }])
    setAnswer('')

    try {
      const state = await api.submitAnswer(sessionId, userAnswer)
      setSession(state)
      setCurrentStage((state as any).interview_stage || currentStage)
      
      if (state.interview_complete) {
        stream?.getTracks().forEach(t => t.stop())
        window.speechSynthesis?.cancel()
        const closingMsg = state.current_question?.text || 'Thank you for completing the interview!'
        setMessages(prev => [...prev, {
          role: 'interviewer',
          content: closingMsg,
          timestamp: new Date().toISOString(),
        }])
        setAvatarState('idle')
        setTimeout(async () => {
          const report = await api.completeInterview(sessionId)
          navigate(`/report/${sessionId}`, { state: { report } })
        }, 3000)
      } else if (state.current_question) {
        const q = state.current_question
        const text = q.context ? `${q.context} ${q.text}` : q.text
        setMessages(prev => [...prev, {
          role: 'interviewer',
          content: text,
          timestamp: new Date().toISOString(),
        }])
      }
    } catch (e) {
      console.error(e)
      setAvatarState('idle')
    }
    setSubmitting(false)
  }

  const handleEnd = async () => {
    if (!sessionId) return
    stream?.getTracks().forEach(t => t.stop())
    stopListening()
    window.speechSynthesis?.cancel()
    try {
      const report = await api.completeInterview(sessionId)
      navigate(`/report/${sessionId}`, { state: { report } })
    } catch { navigate('/dashboard') }
  }

  const formatTime = (s: number) => 
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const stageIndex = STAGE_ORDER.indexOf(currentStage)

  return (
    <div style={{
      minHeight: '100vh', background: '#07060b',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#fff',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '10px 24px', background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 8, height: 8, borderRadius: 4, background: '#ef4444',
            animation: 'recPulse 2s ease-in-out infinite',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500 }}>
            CohortIQ Interview • {formatTime(elapsed)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Stage indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {STAGE_ORDER.map((stage, i) => (
              <div key={stage} style={{
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <div style={{
                  width: i <= stageIndex ? 24 : 16,
                  height: 3, borderRadius: 2,
                  background: i < stageIndex ? '#ff6b00' 
                    : i === stageIndex ? 'linear-gradient(90deg, #ff6b00, #ff8c00)'
                    : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.5s',
                }} />
              </div>
            ))}
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginLeft: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {STAGE_LABELS[currentStage] || 'Interview'}
            </span>
          </div>
          <button onClick={handleEnd} style={{
            padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: 12,
            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          }}>
            End Interview
          </button>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Interviewer Panel */}
        <div style={{
          width: 340, minWidth: 340,
          background: 'linear-gradient(180deg, rgba(20,10,5,0.95) 0%, rgba(15,8,4,0.98) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '32px 24px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Ambient orbs */}
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,107,0,0.06)', top: '5%', left: '-20%', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(234,88,12,0.04)', bottom: '20%', right: '-10%', filter: 'blur(50px)' }} />

          {/* Avatar */}
          <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <InterviewAvatar state={avatarState} size={180} />
          </div>

          {/* Name and status */}
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, position: 'relative', zIndex: 1 }}>Aria</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, fontWeight: 500 }}>AI Technical Interviewer</p>
          
          <div style={{
            padding: '6px 14px', borderRadius: 20,
            background: avatarState === 'speaking' ? 'rgba(255,107,0,0.15)'
              : avatarState === 'listening' ? 'rgba(16,185,129,0.15)'
              : avatarState === 'thinking' ? 'rgba(245,158,11,0.15)'
              : 'rgba(255,255,255,0.05)',
            fontSize: 12, fontWeight: 500,
            color: avatarState === 'speaking' ? '#fdba74'
              : avatarState === 'listening' ? '#6ee7b7'
              : avatarState === 'thinking' ? '#fcd34d'
              : 'rgba(255,255,255,0.4)',
            transition: 'all 0.3s',
            marginBottom: 32,
          }}>
            {avatarState === 'speaking' ? '🔊 Speaking...'
              : avatarState === 'listening' ? '🎧 Listening...'
              : avatarState === 'thinking' ? '💭 Thinking...'
              : '● Ready'}
          </div>

          {/* Your camera - small */}
          <div style={{
            width: '100%', aspectRatio: '4/3', borderRadius: 12,
            overflow: 'hidden', background: '#111', position: 'relative',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {cameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline style={{
                width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)',
              }} />
            ) : (
              <div style={{
                width: '100%', height: '100%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', background: '#0f0e17',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 24, background: '#431407',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ff6b00', fontSize: 20, fontWeight: 700,
                }}>You</div>
              </div>
            )}
            <div style={{
              position: 'absolute', bottom: 8, left: 8,
              padding: '3px 10px', borderRadius: 6,
              background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, fontWeight: 500,
            }}>You</div>
            {isListening && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                width: 10, height: 10, borderRadius: 5,
                background: '#10b981', animation: 'recPulse 1.5s ease-in-out infinite',
              }} />
            )}
          </div>

          {/* Controls under camera */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={toggleMic} style={{
              width: 40, height: 40, borderRadius: 20, border: 'none',
              background: micOn ? 'rgba(255,255,255,0.08)' : '#ef4444',
              color: '#fff', fontSize: 16, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{micOn ? '🎙️' : '🔇'}</button>
            <button onClick={toggleCamera} style={{
              width: 40, height: 40, borderRadius: 20, border: 'none',
              background: cameraOn ? 'rgba(255,255,255,0.08)' : '#ef4444',
              color: '#fff', fontSize: 16, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{cameraOn ? '📹' : '📷'}</button>
          </div>
        </div>

        {/* Right: Conversation Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a090f' }}>
          {/* Chat messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '24px 32px',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: msg.role === 'candidate' ? 'flex-end' : 'flex-start',
                animation: 'msgFadeIn 0.4s ease-out',
              }}>
                {msg.role === 'interviewer' && (
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: 'linear-gradient(135deg, #ff6b00, #ea580c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, marginRight: 10, flexShrink: 0, marginTop: 2,
                  }}>A</div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '12px 16px', borderRadius: 14,
                  background: msg.role === 'candidate'
                    ? 'linear-gradient(135deg, #ff6b00, #c2410c)'
                    : 'rgba(255,255,255,0.06)',
                  border: msg.role === 'candidate' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.9)',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {submitting && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'linear-gradient(135deg, #ff6b00, #ea580c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>A</div>
                <div style={{
                  padding: '12px 18px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginRight: 6 }}>Aria is thinking</span>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#ff6b00',
                      animation: `thinkDot 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: '16px 32px 20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            {/* Live transcript preview */}
            {isListening && answer && (
              <div style={{
                padding: '8px 14px', marginBottom: 10, borderRadius: 10,
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
                fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic',
              }}>
                🎙️ {answer}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                rows={2}
                placeholder={isListening ? 'Listening... speak your answer' : 'Type your answer or use the microphone...'}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit() }}
                disabled={submitting || aiSpeaking}
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: 14, resize: 'none', outline: 'none',
                  fontFamily: 'inherit', lineHeight: 1.5,
                  opacity: (submitting || aiSpeaking) ? 0.5 : 1,
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || submitting || aiSpeaking}
                style={{
                  padding: '12px 24px', borderRadius: 12, border: 'none',
                  background: answer.trim() && !submitting && !aiSpeaking
                    ? 'linear-gradient(135deg, #ff6b00, #ea580c)'
                    : 'rgba(255,255,255,0.05)',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  cursor: answer.trim() && !submitting ? 'pointer' : 'default',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                  boxShadow: answer.trim() ? '0 4px 20px rgba(255,107,0,0.3)' : 'none',
                }}
              >
                {submitting ? 'Sending...' : 'Submit ↵'}
              </button>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.3)',
            }}>
              <span>Ctrl+Enter to submit • {isListening ? '🟢 Mic active' : '⚪ Mic inactive'}</span>
              <span>{messages.filter(m => m.role === 'candidate').length} responses</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes recPulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
        @keyframes msgFadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes thinkDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
