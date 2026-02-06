import { useState, useRef, useEffect, createContext, useContext } from 'react'
import './MusicPlayer.css'

// Create context for music control
export const MusicContext = createContext()

// Lo-fi songs playlist - local files for reliable playback
const lofiPlaylist = [
  { 
    id: 1, 
    title: "Lo-Fi Vibes", 
    artist: "For Us", 
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" 
  },
  { 
    id: 2, 
    title: "Good Night", 
    artist: "Fassounds", 
    url: "/Music/fassounds-good-night-lofi-cozy-chill-music-160166.mp3" 
  },
  { 
    id: 3, 
    title: "Blizzard", 
    artist: "Fassounds", 
    url: "/Music/fassounds-blizzard-179280.mp3" 
  },
  { 
    id: 4, 
    title: "Urban Chill", 
    artist: "Aventure", 
    url: "/Music/aventure-urban-lofi-chill-music-478919.mp3" 
  },
  { 
    id: 5, 
    title: "Sentimental Love", 
    artist: "Sonican", 
    url: "/Music/sonican-lo-fi-music-loop-sentimental-jazzy-love-473154.mp3" 
  },

]

export function MusicProvider({ children }) {
  const [shouldPlay, setShouldPlay] = useState(false)
  
  const startMusic = () => setShouldPlay(true)
  
  return (
    <MusicContext.Provider value={{ shouldPlay, startMusic }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusicControl() {
  return useContext(MusicContext)
}

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const audioRef = useRef(null)
  const { shouldPlay } = useContext(MusicContext)

  const currentTrack = lofiPlaylist[currentTrackIndex]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3 // Set comfortable volume
    }
  }, [])

  // Auto-play when shouldPlay becomes true
  useEffect(() => {
    if (shouldPlay && audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        // Autoplay blocked - needs user interaction
      })
    }
  }, [shouldPlay])

  // Handle song end - play next
  const handleEnded = () => {
    const nextIndex = (currentTrackIndex + 1) % lofiPlaylist.length
    setCurrentTrackIndex(nextIndex)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
      }
    }, 100)
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          // Autoplay blocked - needs user interaction
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const playTrack = (index) => {
    setCurrentTrackIndex(index)
    setShowPlaylist(false)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {})
      }
    }, 100)
  }

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % lofiPlaylist.length
    setCurrentTrackIndex(nextIndex)
    setTimeout(() => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }, 100)
  }

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + lofiPlaylist.length) % lofiPlaylist.length
    setCurrentTrackIndex(prevIndex)
    setTimeout(() => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }, 100)
  }

  return (
    <div className={`music-player ${isMinimized ? 'minimized' : ''}`}>
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        preload="auto" 
        onEnded={handleEnded}
      />
      
      {isMinimized ? (
        <button 
          className={`music-fab ${isPlaying ? 'playing' : ''}`}
          onClick={() => setIsMinimized(false)}
        >
          {isPlaying ? '🎵' : '🔇'}
        </button>
      ) : (
        <div className="music-card">
          <button 
            className="minimize-btn"
            onClick={() => setIsMinimized(true)}
          >
            ←
          </button>
          
          <div className="music-info" onClick={() => setShowPlaylist(!showPlaylist)}>
            <div className={`music-icon ${isPlaying ? 'bouncing' : ''}`}>
              🎶
            </div>
            <div className="music-text">
              <p className="music-title">{currentTrack.title}</p>
              <p className="music-artist">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Track controls */}
          <div className="track-controls">
            <button className="skip-btn" onClick={prevTrack}>⏮</button>
            <button 
              className={`play-pause-btn ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlay}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                </svg>
              )}
            </button>
            <button className="skip-btn" onClick={nextTrack}>⏭</button>
          </div>

          {isPlaying && (
            <div className="equalizer">
              <span className="bar" style={{ animationDelay: '0s' }} />
              <span className="bar" style={{ animationDelay: '0.2s' }} />
              <span className="bar" style={{ animationDelay: '0.4s' }} />
              <span className="bar" style={{ animationDelay: '0.1s' }} />
            </div>
          )}

          {/* Playlist dropdown */}
          {showPlaylist && (
            <div className="playlist-dropdown">
              <p className="playlist-title">🎵 Playlist</p>
              {lofiPlaylist.map((track, index) => (
                <div 
                  key={track.id}
                  className={`playlist-item ${index === currentTrackIndex ? 'active' : ''}`}
                  onClick={() => playTrack(index)}
                >
                  <span className="track-number">{index + 1}</span>
                  <span className="track-name">{track.title}</span>
                  {index === currentTrackIndex && isPlaying && <span className="now-playing">▶</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MusicPlayer
