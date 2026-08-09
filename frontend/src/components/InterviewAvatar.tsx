import { useEffect, useState } from 'react'

interface InterviewAvatarProps {
  state: 'idle' | 'speaking' | 'listening' | 'thinking'
  size?: number
}

export default function InterviewAvatar({ state, size = 200 }: InterviewAvatarProps) {
  const [blinkOpen, setBlinkOpen] = useState(true)

  // Natural blinking
  useEffect(() => {
    const blink = () => {
      setBlinkOpen(false)
      setTimeout(() => setBlinkOpen(true), 150)
    }
    const interval = setInterval(blink, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  const glowColor = state === 'speaking' ? 'rgba(255,107,0,0.5)' 
    : state === 'listening' ? 'rgba(16,185,129,0.4)'
    : state === 'thinking' ? 'rgba(245,158,11,0.4)'
    : 'rgba(255,107,0,0.15)'
  
  const glowSize = state === 'speaking' ? 40 : state === 'listening' ? 25 : 15

  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Glow ring */}
      <div style={{
        position: 'absolute', inset: -10,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        transition: 'all 0.6s ease',
        animation: state === 'speaking' ? 'avatarPulse 1.5s ease-in-out infinite' : 'none',
      }} />

      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{
          position: 'relative', zIndex: 1,
          filter: `drop-shadow(0 0 ${glowSize}px ${glowColor})`,
          transition: 'filter 0.5s ease',
        }}
      >
        {/* Background circle */}
        <circle cx="100" cy="100" r="95" fill="url(#avatarGradient)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Hair - dark styled hair */}
        <ellipse cx="100" cy="78" rx="62" ry="65" fill="#1a1a2e" />
        <ellipse cx="100" cy="60" rx="55" ry="45" fill="#0f0f23" />
        {/* Hair sides */}
        <path d="M 42 85 Q 35 120 45 150 Q 48 140 50 115 Z" fill="#1a1a2e" />
        <path d="M 158 85 Q 165 120 155 150 Q 152 140 150 115 Z" fill="#1a1a2e" />
        {/* Hair shine */}
        <path d="M 65 50 Q 85 35 110 42" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" />

        {/* Face */}
        <ellipse cx="100" cy="105" rx="42" ry="48" fill="#e8b89d" />
        {/* Face shadow */}
        <ellipse cx="100" cy="108" rx="38" ry="44" fill="#dba88d" opacity="0.3" />

        {/* Eyes */}
        <g style={{ transition: 'transform 0.1s' }}>
          {/* Left eye */}
          {blinkOpen ? (
            <>
              <ellipse cx="82" cy="98" rx="8" ry="6" fill="white" />
              <circle cx="83" cy="98" r="3.5" fill="#2d1810" />
              <circle cx="84" cy="97" r="1.2" fill="white" />
            </>
          ) : (
            <line x1="74" y1="98" x2="90" y2="98" stroke="#2d1810" strokeWidth="2" strokeLinecap="round" />
          )}
          {/* Right eye */}
          {blinkOpen ? (
            <>
              <ellipse cx="118" cy="98" rx="8" ry="6" fill="white" />
              <circle cx="119" cy="98" r="3.5" fill="#2d1810" />
              <circle cx="120" cy="97" r="1.2" fill="white" />
            </>
          ) : (
            <line x1="110" y1="98" x2="126" y2="98" stroke="#2d1810" strokeWidth="2" strokeLinecap="round" />
          )}
        </g>

        {/* Eyebrows */}
        <path d="M 73 90 Q 80 86 91 89" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round"
          style={{ transform: state === 'listening' ? 'translateY(-1px)' : 'none', transition: 'transform 0.3s' }} />
        <path d="M 109 89 Q 120 86 127 90" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round"
          style={{ transform: state === 'listening' ? 'translateY(-1px)' : 'none', transition: 'transform 0.3s' }} />

        {/* Nose */}
        <path d="M 98 103 Q 100 110 102 103" stroke="#c49a82" strokeWidth="1.5" fill="none" />

        {/* Mouth - changes based on state */}
        {state === 'speaking' ? (
          <ellipse cx="100" cy="120" rx="8" ry="5" fill="#c0756b"
            style={{ animation: 'mouthSpeak 0.3s ease-in-out infinite alternate' }} />
        ) : state === 'listening' ? (
          <path d="M 92 118 Q 100 124 108 118" stroke="#c0756b" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 93 119 Q 100 123 107 119" stroke="#c0756b" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Neck */}
        <rect x="90" y="148" width="20" height="12" rx="4" fill="#dba88d" />

        {/* Shoulders / blazer */}
        <path d="M 45 195 Q 50 165 90 155 L 100 160 L 110 155 Q 150 165 155 195" 
          fill="#3a1500" />
        {/* Blazer lapels */}
        <path d="M 90 155 L 97 172 L 100 160" fill="#4d1c00" />
        <path d="M 110 155 L 103 172 L 100 160" fill="#4d1c00" />
        {/* Blouse */}
        <path d="M 95 155 L 100 170 L 105 155" fill="white" opacity="0.9" />

        {/* Gradients */}
        <defs>
          <radialGradient id="avatarGradient" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#3a1500" />
            <stop offset="100%" stopColor="#0f0a1a" />
          </radialGradient>
        </defs>
      </svg>

      {/* Speaking indicator waves */}
      {state === 'speaking' && (
        <div style={{
          position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 3, alignItems: 'flex-end', height: 20,
        }}>
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{
              width: 3, borderRadius: 2, background: '#ff6b00',
              animation: `voiceBar 0.6s ease-in-out ${i * 0.08}s infinite alternate`,
            }} />
          ))}
        </div>
      )}

      {/* Thinking indicator */}
      {state === 'thinking' && (
        <div style={{
          position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: '#f59e0b',
              animation: `thinkDot 1.4s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Listening indicator */}
      {state === 'listening' && (
        <div style={{
          position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
          width: 40, height: 3, borderRadius: 2, background: 'rgba(16,185,129,0.3)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '50%', height: '100%', background: '#10b981', borderRadius: 2,
            animation: 'listenPulse 2s ease-in-out infinite',
          }} />
        </div>
      )}

      <style>{`
        @keyframes avatarPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes mouthSpeak {
          from { ry: 3; rx: 6; }
          to { ry: 6; rx: 8; }
        }
        @keyframes voiceBar {
          from { height: 4px; }
          to { height: 18px; }
        }
        @keyframes thinkDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes listenPulse {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
