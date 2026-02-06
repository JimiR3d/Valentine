import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FloatingHearts from '../components/FloatingHearts'
import './Reasons.css'

// Unlock date: February 13, 2026
const UNLOCK_DATE = new Date('2026-02-13T00:00:00')

const reasons = [
  { emoji: '👫', title: "We're dating. Obviously.", note: "Like, this one is pretty self-explanatory..." },
  { emoji: '💕', title: "You love me.", note: "I have proof. 📸" },
  { emoji: '🥹', title: '"I miss you always ❤️"', note: "You'd miss me too ❤️" },
  { emoji: '😘', title: "Because I'm Jimi.", note: "..." },
  { emoji: '🤗', title: "I give the best hugs.", note: "Cause who else could you want to hug? (Asides family)" },
  { emoji: '🤷‍♂️', title: "There's literally no other option.", note: "I checked. Trust me." },
  { emoji: '🗓️', title: "We already planned everything.", note: "So you can't back out now!" },
]

function Reasons() {
  const navigate = useNavigate()
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    const checkUnlock = () => {
      setIsUnlocked(new Date() >= UNLOCK_DATE)
    }
    checkUnlock()
    const interval = setInterval(checkUnlock, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="reasons-page">
      <FloatingHearts />
      
      <div className="reasons-container">
        {/* Header */}
        <div className="reasons-header">
          <h2 className="reasons-title">
            <span className="title-text">Reasons to Be My Valentine</span>
            <span className="spinning-heart">💛</span>
          </h2>
          <p className="reasons-subtitle">A scientifically accurate list of reasons.</p>
        </div>

        {/* Reasons List */}
        <div className="reasons-list">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="reason-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="reason-number">
                {index + 1}
              </div>
              <div className="reason-content">
                <div className="reason-emoji">{reason.emoji}</div>
                <h3 className="reason-title">{reason.title}</h3>
                <p className="reason-note">{reason.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="cta-card">
          <div className="cta-glow cta-glow-1" />
          <div className="cta-glow cta-glow-2" />
          <div className="cta-accent" />
          <div className="cta-content">
            {isUnlocked ? (
              <>
                <p className="cta-text">See? You have no choice! 😌</p>
                <button 
                  className="accept-button"
                  onClick={() => navigate('/proposal')}
                >
                  Accept Your Fate 💕
                </button>
              </>
            ) : (
              <>
                <p className="cta-text">Something special is coming... 🔮</p>
                <div className="coming-soon-badge">
                  <span className="lock-icon">🔒</span>
                  <span>Coming Soon - Feb 13</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reasons
