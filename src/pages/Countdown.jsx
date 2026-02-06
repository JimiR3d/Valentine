import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import countdownData from '../data/countdown.json'
import FloatingHearts from '../components/FloatingHearts'
import './Countdown.css'

function Countdown() {
  const [selectedDay, setSelectedDay] = useState(null)
  const [daysLeft, setDaysLeft] = useState(10)
  const navigate = useNavigate()

  const START_DATE = new Date('2026-02-04T00:00:00')
  const VALENTINE_DATE = new Date('2026-02-14T00:00:00')

  useEffect(() => {
    const today = new Date()
    const diff = Math.ceil((VALENTINE_DATE - today) / (1000 * 60 * 60 * 24))
    setDaysLeft(Math.max(0, Math.min(10, diff)))
  }, [])

  const isUnlocked = (dayDate) => {
    const today = new Date()
    const targetDate = new Date(dayDate + 'T00:00:00')
    return today >= targetDate
  }

  const handleDayClick = (day, index) => {
    if (isUnlocked(day.date)) {
      if (index === 9) {
        navigate('/proposal')
      } else {
        setSelectedDay(day)
      }
    }
  }

  return (
    <div className="countdown-page">
      <FloatingHearts />
      
      <div className="countdown-container">
        {/* Header */}
        <div className="countdown-header">
          <h2 className="countdown-title">Countdown to Us</h2>
          
          {/* Big Counter */}
          <div className="big-counter">
            <div className="counter-glow counter-glow-1" />
            <div className="counter-glow counter-glow-2" />
            <div className="counter-content">
              <span className="counter-number">{daysLeft}</span>
              <p className="counter-label">Days Left</p>
            </div>
            <div className="counter-accent" />
          </div>
        </div>

        {/* Day Grid */}
        <div className="day-grid">
          {countdownData.map((day, index) => {
            const unlocked = isUnlocked(day.date)
            return (
              <button
                key={day.day}
                className={`day-card ${unlocked ? 'unlocked' : 'locked'}`}
                onClick={() => handleDayClick(day, index)}
              >
                <span className="day-number">{day.day}</span>
                <div className="day-icon">
                  {unlocked ? (
                    <>
                      <svg className="gift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="8" width="18" height="4" rx="1"/>
                        <path d="M12 8v13"/>
                        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
                        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
                      </svg>
                      <span className="day-status">Open</span>
                    </>
                  ) : (
                    <>
                      <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <span className="day-status">Locked</span>
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-day">Day {selectedDay.day}</span>
              <button className="modal-close" onClick={() => setSelectedDay(null)}>×</button>
            </div>
            <div className="modal-body">
              <h3>{selectedDay.title}</h3>
              <p>{selectedDay.content}</p>
              {selectedDay.emoji && (
                <span className="modal-emoji">{selectedDay.emoji}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Countdown
