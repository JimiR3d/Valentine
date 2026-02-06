import { useState, useRef, useMemo } from 'react'
import FloatingHearts from '../components/FloatingHearts'
import { generateMemories, allVideos, audioNotes as initialAudioNotes, filmReelImages } from '../data/mediaData'
import './Memories.css'

function Memories() {
  // Generate photos from YOUR personal images
  const initialPhotos = useMemo(() => generateMemories(), [])
  
  const [playingId, setPlayingId] = useState(null)
  const [photos, setPhotos] = useState(initialPhotos)
  const [audioNotes, setAudioNotes] = useState(initialAudioNotes)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [newPhoto, setNewPhoto] = useState({ title: '', caption: '', uploadedBy: 'Me' })
  const [newAudio, setNewAudio] = useState({ title: '', uploadedBy: 'Me' })
  const photoInputRef = useRef(null)
  const audioInputRef = useRef(null)
  const audioPlayerRef = useRef(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null)
  const [audioDuration, setAudioDuration] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const togglePlay = (noteId, audioSrc) => {
    if (playingId === noteId) {
      // Pause current audio
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
      }
      setPlayingId(null)
    } else {
      // Play new audio
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioSrc
        audioPlayerRef.current.play().catch(() => {
          console.log('Audio playback blocked')
        })
      }
      setPlayingId(noteId)
    }
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreviewUrl(url)
    }
  }

  const handleAudioSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAudioPreviewUrl(url)
      
      // Get duration
      const audio = new Audio(url)
      audio.addEventListener('loadedmetadata', () => {
        const mins = Math.floor(audio.duration / 60)
        const secs = Math.floor(audio.duration % 60)
        setAudioDuration(`${mins}:${secs.toString().padStart(2, '0')}`)
      })
    }
  }

  const handlePhotoUpload = () => {
    if (photoPreviewUrl && newPhoto.title) {
      const photo = {
        id: Date.now(),
        src: photoPreviewUrl,
        title: newPhoto.title,
        caption: newPhoto.caption,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        uploadedBy: newPhoto.uploadedBy,
      }
      setPhotos([photo, ...photos])
      setShowPhotoModal(false)
      setNewPhoto({ title: '', caption: '', uploadedBy: 'Me' })
      setPhotoPreviewUrl(null)
    }
  }

  const handleAudioUpload = () => {
    if (audioPreviewUrl && newAudio.title) {
      const audio = {
        id: Date.now(),
        title: newAudio.title,
        duration: audioDuration || '0:00',
        file: audioPreviewUrl,
        uploadedBy: newAudio.uploadedBy,
      }
      setAudioNotes([audio, ...audioNotes])
      setShowAudioModal(false)
      setNewAudio({ title: '', uploadedBy: 'Me' })
      setAudioPreviewUrl(null)
      setAudioDuration(null)
    }
  }

  return (
    <div className="memories-page">
      <FloatingHearts />
      
      <div className="memories-container">
        {/* Header */}
        <div className="memories-header">
          <h2 className="memories-title">Memories & Voices</h2>
          <p className="memories-subtitle">Echoes of our favorite moments.</p>
        </div>

        {/* Audio Section - Only show if there are audio notes */}
        {audioNotes.length > 0 && (
          <div className="audio-section">
            <div className="section-header">
              <h3 className="section-label">Audio Snippets</h3>
              <button 
                className="upload-btn small"
                onClick={() => setShowAudioModal(true)}
              >
                + Add Audio
              </button>
            </div>
            
            <div className="audio-list">
              {audioNotes.map((note, index) => (
                <div 
                  key={note.id} 
                  className="audio-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <button 
                    className={`play-button ${playingId === note.id ? 'playing' : ''}`}
                    onClick={() => togglePlay(note.id, note.src)}
                  >
                    {playingId === note.id ? (
                      <svg className="pause-icon" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                    ) : (
                      <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                      </svg>
                    )}
                  </button>
                  <div className="audio-info">
                    <p className="audio-title">{note.title}</p>
                    <p className="audio-duration">
                      {note.duration} • {note.uploadedBy === 'Me' ? '💙' : '💗'} {note.uploadedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Hidden audio player for playback */}
            <audio 
              ref={audioPlayerRef} 
              onEnded={() => setPlayingId(null)}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* Add Audio Button when no audio notes */}
        {audioNotes.length === 0 && (
          <div className="add-audio-prompt">
            <button 
              className="upload-btn"
              onClick={() => setShowAudioModal(true)}
            >
              🎙️ Add Your First Voice Note
            </button>
          </div>
        )}

        {/* Film Strip - Continuously scrolling photos like a movie reel */}
        <div className="film-strip-container">
          <p className="film-strip-label">🎬 Our Film Reel</p>
          <div className="film-strip">
            {/* Double the photos for seamless infinite scroll */}
            {[...filmReelImages, ...filmReelImages].map((src, index) => (
              <div 
                key={`film-${index}`}
                className="film-frame"
              >
                <img src={src} alt="Memory" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Photos Section */}
        <div className="photos-section-header">
          <h3 className="section-label photos-label">Our Photos 💕</h3>
          <p className="photo-count">{photos.length} memories</p>
        </div>
        
        {/* Photo Grid - YOUR personal photos */}
        <div className="photos-masonry">

          {photos.map((photo, index) => (
            <div 
              key={photo.id}
              className="memory-photo"
              style={{ animationDelay: `${0.1 + index * 0.03}s` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.src} alt={photo.caption || 'Our memory'} loading="lazy" />
              <div className="photo-overlay">
                <p className="overlay-caption">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Photo Button */}
        <div className="add-photo-section">
          <button 
            className="upload-btn large"
            onClick={() => setShowPhotoModal(true)}
          >
            + Add More Photos
          </button>
        </div>
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-lightbox" onClick={() => setSelectedPhoto(null)}>✕</button>
            <img src={selectedPhoto.src} alt={selectedPhoto.caption || 'Memory'} />
            {selectedPhoto.caption && (
              <p className="lightbox-caption">{selectedPhoto.caption}</p>
            )}
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="upload-modal-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add a Photo 📸</h3>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={photoInputRef}
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />
            
            <button 
              className="select-photo-btn"
              onClick={() => photoInputRef.current?.click()}
            >
              {photoPreviewUrl ? 'Change Photo' : 'Select Photo'}
            </button>

            {photoPreviewUrl && (
              <div className="photo-preview">
                <img src={photoPreviewUrl} alt="Preview" />
              </div>
            )}

            <input
              type="text"
              placeholder="Title (optional)"
              value={newPhoto.title}
              onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
              className="modal-input"
            />

            <textarea
              placeholder="Caption (optional)..."
              value={newPhoto.caption}
              onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
              className="modal-textarea"
            />

            <div className="uploaded-by-toggle">
              <span>Uploaded by:</span>
              <button 
                className={`toggle-btn ${newPhoto.uploadedBy === 'Me' ? 'active' : ''}`}
                onClick={() => setNewPhoto({ ...newPhoto, uploadedBy: 'Me' })}
              >
                💙 Jimi
              </button>
              <button 
                className={`toggle-btn ${newPhoto.uploadedBy === 'You' ? 'active' : ''}`}
                onClick={() => setNewPhoto({ ...newPhoto, uploadedBy: 'You' })}
              >
                💗 Favour
              </button>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowPhotoModal(false)}>
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handlePhotoUpload}
                disabled={!photoPreviewUrl}
              >
                Add Photo 💕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Upload Modal */}
      {showAudioModal && (
        <div className="upload-modal-overlay" onClick={() => setShowAudioModal(false)}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add a Voice Note 🎙️</h3>
            
            <input 
              type="file" 
              accept="audio/*" 
              ref={audioInputRef}
              onChange={handleAudioSelect}
              style={{ display: 'none' }}
            />
            
            <button 
              className="select-photo-btn"
              onClick={() => audioInputRef.current?.click()}
            >
              {audioPreviewUrl ? 'Change Audio' : 'Select Audio File'}
            </button>

            {audioPreviewUrl && (
              <div className="audio-preview">
                <audio controls src={audioPreviewUrl} />
                {audioDuration && <p className="duration-label">Duration: {audioDuration}</p>}
              </div>
            )}

            <input
              type="text"
              placeholder="Title (e.g., 'When you miss me')"
              value={newAudio.title}
              onChange={(e) => setNewAudio({ ...newAudio, title: e.target.value })}
              className="modal-input"
            />

            <div className="uploaded-by-toggle">
              <span>Uploaded by:</span>
              <button 
                className={`toggle-btn ${newAudio.uploadedBy === 'Me' ? 'active' : ''}`}
                onClick={() => setNewAudio({ ...newAudio, uploadedBy: 'Me' })}
              >
                💙 Jimi
              </button>
              <button 
                className={`toggle-btn ${newAudio.uploadedBy === 'You' ? 'active' : ''}`}
                onClick={() => setNewAudio({ ...newAudio, uploadedBy: 'You' })}
              >
                💗 Favour
              </button>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAudioModal(false)}>
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleAudioUpload}
                disabled={!audioPreviewUrl || !newAudio.title}
              >
                Add Audio 🎵
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Memories
