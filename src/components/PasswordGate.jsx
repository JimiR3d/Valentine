import { useState } from 'react'
import FloatingHearts from './FloatingHearts'
import './PasswordGate.css'

function PasswordGate({ onSubmit }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = onSubmit(password)
    if (!success) {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPassword('')
    }
  }

  return (
    <div className="password-gate">
      <FloatingHearts />
      <div className={`password-card ${shake ? 'shake' : ''}`}>
        <div className="lock-icon">🔐</div>
        <h1>This is for you...</h1>
        <p>Enter the magic word to continue 💕</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            placeholder="Enter password..."
            className={error ? 'error' : ''}
            autoFocus
          />
          <button type="submit" className="btn btn-primary">
            Unlock 💖
          </button>
        </form>
        
        {error && (
          <p className="error-message">That's not it, try again! 🙈</p>
        )}
      </div>
    </div>
  )
}

export default PasswordGate
