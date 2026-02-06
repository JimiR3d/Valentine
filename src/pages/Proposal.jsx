import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import FloatingHearts from '../components/FloatingHearts'
import './Proposal.css'

const noButtonTexts = [
  "No 🙃",
  "Nice try 😌",
  "That's illegal",
  "You meant Yes",
  "Try again",
  "Nope, wrong button",
  "Are you sure? 🥺",
  "Really??",
  "Think again",
  "Impossible!"
]

function Proposal() {
  const navigate = useNavigate()
  const [noClickCount, setNoClickCount] = useState(0)
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const handleYesClick = () => {
    // Fire confetti! 🎉
    const duration = 2000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF8FAB', '#E75480', '#D4AF37', '#FFE5B4', '#FF69B4']
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF8FAB', '#E75480', '#D4AF37', '#FFE5B4', '#FF69B4']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()

    // Navigate to accepted page after brief delay
    setTimeout(() => {
      navigate('/accepted')
    }, 1500)
  }

  const handleNoHover = () => {
    if (!containerRef.current) return
    
    const container = containerRef.current.getBoundingClientRect()
    const maxX = container.width - 120
    const maxY = 200
    
    const newX = Math.random() * maxX - maxX / 2
    const newY = Math.random() * maxY - maxY / 2
    
    setNoPosition({ x: newX, y: newY })
    setNoClickCount(prev => Math.min(prev + 1, noButtonTexts.length - 1))
  }

  return (
    <div className="proposal-page" ref={containerRef}>
      <FloatingHearts />
      <div className="proposal-content">
        <div className="proposal-emoji">💝</div>
        <h1>Will You Be My Valentine?</h1>
        <p className="proposal-subtitle">
          I know we're already dating, but let me do this properly...
        </p>
        
        <div className="proposal-buttons">
          <button className="btn-yes" onClick={handleYesClick}>
            Yes! 💕
          </button>
          <button
            className="btn-no"
            style={{
              transform: `translate(${noPosition.x}px, ${noPosition.y}px)`
            }}
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
          >
            {noButtonTexts[noClickCount]}
          </button>
        </div>
        
        {noClickCount > 2 && (
          <p className="hint-text">
            (Just click Yes already! 😂)
          </p>
        )}
      </div>
    </div>
  )
}

export default Proposal
