import { useEffect, useState } from 'react'
import './Accepted.css'

// Generate floating hearts
const generateHearts = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 25 + Math.random() * 25,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
    rotate: -45 + Math.random() * 90,
  }))
}

function Accepted() {
  const [hearts] = useState(() => generateHearts(30))
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowCard(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="accepted-page">
      {/* Floating Hearts Background */}
      <div className="hearts-explosion">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              fontSize: `${heart.size}px`,
              left: `${heart.left}vw`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              transform: `rotate(${heart.rotate}deg)`,
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="accepted-content">
        {/* Celebration Emojis */}
        <div className="celebration-emojis">
          🎉💕🎉
        </div>

        {/* Title */}
        <h1 className="accepted-title">Obviously!</h1>

        {/* Subtitle */}
        <p className="accepted-subtitle">
          You're already my girlfriend, so like...
          <span className="choice-badge">
            there was never really a choice! 😌
          </span>
        </p>

        {/* Card */}
        <div className={`valentine-card ${showCard ? 'visible' : ''}`}>
          <p className="card-message">
            Happy Valentine's Day, my love! 💝
          </p>
          <p className="card-thank">
            Thank you for being mine.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Accepted
