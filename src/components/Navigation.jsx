import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useLoadingScreen } from './LoadingScreen'
import './Navigation.css'

// Unlock date: February 13, 2026
const UNLOCK_DATE = new Date('2026-02-13T00:00:00')

function Navigation({ onBackToHub }) {
  const { navigateWithLoading } = useLoadingScreen()
  const [isProposalUnlocked, setIsProposalUnlocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 })

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const diff = UNLOCK_DATE - now
      
      if (diff <= 0) {
        setIsProposalUnlocked(true)
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
    const interval = setInterval(updateCountdown, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const handleNavClick = (e, path) => {
    e.preventDefault()
    // Block proposal if locked
    if (path === '/proposal' && !isProposalUnlocked) {
      return
    }
    navigateWithLoading(path)
  }

  const handleBackClick = (e) => {
    e.preventDefault()
    onBackToHub()
  }

  return (
    <nav className="nav">
      <div className="nav-container">
        <button className="back-btn" onClick={handleBackClick}>
          <span className="back-arrow">←</span>
          <span className="back-heart">💕</span>
          <span className="back-text">Hub</span>
        </button>
        
        {/* Countdown Timer - Global */}
        {!isProposalUnlocked && (
          <div className="nav-countdown">
            <span className="countdown-icon">⏳</span>
            <span className="countdown-text">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m
            </span>
          </div>
        )}
        
        <div className="nav-links">
          <a 
            href="#/feed"
            className="nav-link"
            onClick={(e) => handleNavClick(e, '/feed')}
          >
            <span className="nav-icon">💭</span>
            <span className="nav-label">Feed</span>
          </a>
          <a 
            href="#/memories"
            className="nav-link"
            onClick={(e) => handleNavClick(e, '/memories')}
          >
            <span className="nav-icon">📸</span>
            <span className="nav-label">Memories</span>
          </a>
          <a 
            href="#/playlist"
            className="nav-link"
            onClick={(e) => handleNavClick(e, '/playlist')}
          >
            <span className="nav-icon">🎵</span>
            <span className="nav-label">Playlist</span>
          </a>
          <a 
            href="#/reasons"
            className="nav-link"
            onClick={(e) => handleNavClick(e, '/reasons')}
          >
            <span className="nav-icon">💛</span>
            <span className="nav-label">Why You</span>
          </a>
          <a 
            href="#/proposal"
            className={`nav-link heart-link ${!isProposalUnlocked ? 'locked' : ''}`}
            onClick={(e) => handleNavClick(e, '/proposal')}
            title={!isProposalUnlocked ? 'Unlocks Feb 13' : 'The Question'}
          >
            <span className="nav-heart">{isProposalUnlocked ? '💝' : '🔒'}</span>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
