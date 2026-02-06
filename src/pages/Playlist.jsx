import FloatingHearts from '../components/FloatingHearts'
import Navigation from '../components/Navigation'
import { useLoadingScreen } from '../components/LoadingScreen'
import './Playlist.css'

function Playlist() {
  const { navigateWithLoading } = useLoadingScreen()

  const handleBackToHub = () => {
    navigateWithLoading('/')
  }

  return (
    <div className="playlist-page">
      <FloatingHearts />
      <Navigation onBackToHub={handleBackToHub} />
      
      <div className="playlist-container">
        {/* Header */}
        <div className="playlist-header">
          <h2 className="playlist-title">
            <span className="title-emoji">🎵</span>
            <span className="title-text">Our Playlist</span>
          </h2>
          <p className="playlist-subtitle">Songs that remind me of us</p>
        </div>

        {/* Spotify Embed */}
        <div className="spotify-embed">
          <iframe 
            src="https://open.spotify.com/embed/playlist/57mraW0oYeo7s0csCBqABJ?utm_source=generator&theme=0"
            width="100%" 
            height="450"
            frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Our Playlist"
          />
        </div>

        {/* Sweet Note */}
        <div className="playlist-note">
          <span className="note-emoji">💕</span>
          <p>Every song here makes me think of us...</p>
        </div>
      </div>
    </div>
  )
}

export default Playlist
