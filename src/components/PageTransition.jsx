import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './PageTransition.css'

// Context for managing transitions
const TransitionContext = createContext()

export function usePageTransition() {
  return useContext(TransitionContext)
}

// Icons for each page
const pageIcons = {
  '/': '💭',
  '/hub': '💕',
  '/feed': '💭',
  '/countdown': '📅',
  '/memories': '📸',
  '/reasons': '💛',
  '/proposal': '💍',
  '/accepted': '🎉',
}

const pageColors = {
  '/': ['#F43F5E', '#FB7185'],
  '/hub': ['#F43F5E', '#FBBF24'],
  '/feed': ['#F43F5E', '#FB7185'],
  '/countdown': ['#F59E0B', '#FBBF24'],
  '/memories': ['#EC4899', '#F472B6'],
  '/reasons': ['#F59E0B', '#EAB308'],
  '/proposal': ['#F43F5E', '#FB7185'],
  '/accepted': ['#F43F5E', '#FBBF24'],
}

export function PageTransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetPath, setTargetPath] = useState(null)
  const [transitionIcon, setTransitionIcon] = useState('💕')
  const [transitionColors, setTransitionColors] = useState(['#F43F5E', '#FB7185'])
  const navigate = useNavigate()
  const location = useLocation()

  const navigateWithTransition = (path) => {
    if (path === location.pathname) return
    
    setTargetPath(path)
    setTransitionIcon(pageIcons[path] || '💕')
    setTransitionColors(pageColors[path] || ['#F43F5E', '#FB7185'])
    setIsTransitioning(true)
  }

  useEffect(() => {
    if (isTransitioning && targetPath) {
      const timer = setTimeout(() => {
        navigate(targetPath)
        setTimeout(() => {
          setIsTransitioning(false)
          setTargetPath(null)
        }, 400)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, targetPath, navigate])

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      
      {/* Transition Overlay */}
      <div className={`page-transition-overlay ${isTransitioning ? 'active' : ''}`}>
        <div 
          className="transition-circle"
          style={{
            background: `linear-gradient(135deg, ${transitionColors[0]} 0%, ${transitionColors[1]} 100%)`
          }}
        >
          <span className="transition-icon">{transitionIcon}</span>
          <div className="loading-hearts">
            <span>💕</span>
            <span>💕</span>
            <span>💕</span>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
