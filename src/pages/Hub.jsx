import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoadingScreen } from '../components/LoadingScreen'
import FloatingHearts from '../components/FloatingHearts'
import confetti from 'canvas-confetti'
import './Hub.css'

// Unlock date: February 13, 2026
const UNLOCK_DATE = new Date('2026-02-13T00:00:00')

const sections = [
  {
    id: 'feed',
    path: '/feed',
    icon: '💭',
    title: 'Our Story',
    subtitle: 'Memories & dreams',
    color: '#FF8FAB',
    delay: 0
  },
  {
    id: 'memories',
    path: '/memories',
    icon: '📸',
    title: 'Memories',
    subtitle: 'Photos & voices',
    color: '#E75480',
    delay: 0.1
  },
  {
    id: 'playlist',
    path: '/playlist',
    icon: '🎵',
    title: 'Our Playlist',
    subtitle: 'Songs for us',
    color: '#F472B6',
    delay: 0.15
  },
  {
    id: 'reasons',
    path: '/reasons',
    icon: '💝',
    title: 'Why You',
    subtitle: 'Obvious reasons',
    color: '#FFB6C1',
    delay: 0.2
  },
  {
    id: 'proposal',
    path: '/proposal',
    icon: '💍',
    title: 'The Question',
    subtitle: 'Will you...?',
    color: '#FFD700',
    delay: 0.25,
    locked: true // Special flag for proposal
  }
]

function Hub({ onNavigate }) {
  const { navigateWithLoading } = useLoadingScreen()
  const navigate = useNavigate()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 })

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const diff = UNLOCK_DATE - now
      
      if (diff <= 0) {
        setIsUnlocked(true)
        setTimeLeft({ days: 0, hours: 0, mins: 0 })
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / (1000 * 60)) % 60)
        })
      }
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [])

  // Auto-navigate when unlocked
  useEffect(() => {
    if (isUnlocked) {
      // Celebrate!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#FFD700', '#FF1493', '#FFC0CB']
      })
      
      // Navigate after celebration
      const timer = setTimeout(() => {
        navigate('/proposal')
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isUnlocked, navigate])

  const handleSectionClick = (section) => {
    // Block proposal if locked
    if (section.locked && !isUnlocked) {
      return
    }
    onNavigate()
    navigateWithLoading(section.path)
  }

  return (
    <div className="hub-page">
      <FloatingHearts />

      <div className="hub-container">
        {/* Center Heart */}
        <div className="hub-center">
          <div className="center-heart">💕</div>
          <h1>Us</h1>
          <p>Choose your adventure</p>
        </div>
        
        {/* Countdown Banner - Fixed at Bottom */}
        {!isUnlocked && (
          <div className="hub-countdown-banner">
            <span className="countdown-icon">⏳</span>
            <span className="countdown-time">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m
            </span>
            <span className="countdown-label">until something special</span>
          </div>
        )}

        {/* Orbiting Section Cards - 5 cards */}
        <div className="hub-orbit">
          {sections.map((section, index) => {
            const isCardLocked = section.locked && !isUnlocked
            
            return (
              <div
                key={section.id}
                className={`hub-card ${isCardLocked ? 'locked' : ''}`}
                style={{
                  '--card-color': section.color,
                  '--orbit-index': index,
                  '--total-cards': sections.length,
                  animationDelay: `${section.delay}s`
                }}
                onClick={() => handleSectionClick(section)}
              >
                <div className="card-glow" />
                <div className="card-icon">
                  {isCardLocked ? '🔒' : section.icon}
                </div>
                <div className="card-content">
                  <h3>{section.title}</h3>
                  <p>{isCardLocked ? 'Unlocks Feb 13' : section.subtitle}</p>
                </div>
                <div className="card-arrow">
                  {isCardLocked ? '⏳' : '→'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Decorative Elements */}
        <div className="sparkles">
          {[...Array(12)].map((_, i) => (
            <span 
              key={i} 
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              ✨
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hub
