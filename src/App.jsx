import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import MusicPlayer, { MusicProvider } from './components/MusicPlayer'
import { LoadingScreenProvider } from './components/LoadingScreen'
import Welcome from './pages/Welcome'
import Hub from './pages/Hub'
import Feed from './pages/Feed'
import Countdown from './pages/Countdown'
import Memories from './pages/Memories'
import Reasons from './pages/Reasons'
import Playlist from './pages/Playlist'
import Proposal from './pages/Proposal'
import Accepted from './pages/Accepted'

function AppContent() {
  const navigate = useNavigate()
  const [hasEnteredSite, setHasEnteredSite] = useState(() => {
    // Check if we're on a section page (not just /)
    const path = window.location.hash.replace('#', '')
    return path && path !== '/'
  })
  const [isInSection, setIsInSection] = useState(() => {
    // Check if we're on a section page
    const path = window.location.hash.replace('#', '')
    const sectionPaths = ['/feed', '/countdown', '/memories', '/reasons', '/playlist', '/proposal', '/accepted']
    return sectionPaths.includes(path)
  })

  // Handle browser navigation (back/forward buttons and page refresh)
  useEffect(() => {
    const path = window.location.hash.replace('#', '')
    const sectionPaths = ['/feed', '/countdown', '/memories', '/reasons', '/playlist', '/proposal', '/accepted']
    
    if (sectionPaths.includes(path)) {
      setHasEnteredSite(true)
      setIsInSection(true)
    } else if (path === '/hub' || path === '/') {
      setHasEnteredSite(true)
      setIsInSection(false)
    }
  }, [])

  const handleEnterSite = () => {
    setHasEnteredSite(true)
  }

  const handleNavigateToSection = () => {
    setIsInSection(true)
  }

  const handleBackToHub = () => {
    setIsInSection(false)
    navigate('/')
  }

  if (!hasEnteredSite) {
    return <Welcome onEnter={handleEnterSite} />
  }

  return (
    <LoadingScreenProvider>
      {/* Only show nav when inside a section */}
      {isInSection && <Navigation onBackToHub={handleBackToHub} />}
      
      {/* Global Music Player */}
      <MusicPlayer />
      
      <main style={{ paddingTop: isInSection ? '80px' : '0', minHeight: '100vh' }}>
        <Routes>
          <Route 
            path="/" 
            element={
              isInSection ? (
                <Feed />
              ) : (
                <Hub onNavigate={handleNavigateToSection} />
              )
            } 
          />
          <Route path="/hub" element={<Hub onNavigate={handleNavigateToSection} />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/countdown" element={<Countdown />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/reasons" element={<Reasons />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/accepted" element={<Accepted />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </LoadingScreenProvider>
  )
}

function App() {
  return (
    <MusicProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </MusicProvider>
  )
}

export default App

