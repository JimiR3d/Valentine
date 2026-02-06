import { useState, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoadingScreen.css'

const LoadingContext = createContext()

export function useLoadingScreen() {
  return useContext(LoadingContext)
}

// Section data for loading screens
const sectionData = {
  '/': { icon: '💭', title: 'Our Story', color: '#FF8FAB' },
  '/feed': { icon: '💭', title: 'Our Story', color: '#FF8FAB' },
  '/countdown': { icon: '📅', title: 'Countdown', color: '#D4AF37' },
  '/memories': { icon: '📸', title: 'Memories', color: '#E75480' },
  '/reasons': { icon: '💝', title: 'Why You', color: '#FFB6C1' },
  '/proposal': { icon: '💍', title: 'The Question', color: '#FFD700' },
  '/accepted': { icon: '💕', title: 'Obviously!', color: '#F43F5E' },
}

export function LoadingScreenProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingInfo, setLoadingInfo] = useState(null)
  const navigate = useNavigate()

  const navigateWithLoading = (path) => {
    const info = sectionData[path] || { icon: '💕', title: 'Loading...', color: '#F43F5E' }
    setLoadingInfo(info)
    setIsLoading(true)
    
    // Show loading screen for 1.2s then navigate
    setTimeout(() => {
      navigate(path)
      // Keep showing briefly after navigation
      setTimeout(() => {
        setIsLoading(false)
        setLoadingInfo(null)
      }, 300)
    }, 1000)
  }

  return (
    <LoadingContext.Provider value={{ navigateWithLoading, isLoading }}>
      {children}
      
      {/* Global Loading Overlay */}
      {isLoading && loadingInfo && (
        <div 
          className="loading-overlay active"
          style={{ '--accent-color': loadingInfo.color }}
        >
          <div className="loading-content">
            <div className="loading-icon">{loadingInfo.icon}</div>
            <div className="loading-title">{loadingInfo.title}</div>
            <div className="loading-hearts">
              <span>💕</span>
              <span>💕</span>
              <span>💕</span>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  )
}
