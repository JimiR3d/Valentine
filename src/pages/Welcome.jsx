import FloatingHearts from '../components/FloatingHearts'
import { useMusicControl } from '../components/MusicPlayer'
import './Welcome.css'

function Welcome({ onEnter }) {
  const { startMusic } = useMusicControl()

  const handleEnter = () => {
    startMusic() // Start the music
    onEnter()    // Navigate to Hub
  }

  return (
    <div className="welcome-page">
      <FloatingHearts />
      
      <div className="welcome-content">
        <div className="welcome-emoji">💝</div>
        <h1>I made this for you...</h1>
        <p className="welcome-subtitle">
          Not for a special occasion,<br />
          but because <span className="highlight">you're special</span>.
        </p>
        
        <div className="welcome-divider">
          <span>and you're the ✨star✨</span>
        </div>
        
        <p className="welcome-hint">
          This is our little space on the internet.<br />
          <span className="highlight"> Us, Before Valentine's 💕</span>
        </p>
        
        {/* Headphone Suggestion */}
        <div className="headphone-hint">
          <span className="headphone-icon">🎧</span>
          <span>Turn the volume up a bit</span>
        </div>
        
        <button className="btn btn-primary enter-btn" onClick={handleEnter}>
          Enter Our Space 💕
        </button>
      </div>
    </div>
  )
}

export default Welcome
