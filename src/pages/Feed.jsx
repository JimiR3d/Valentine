import { useState, useRef, useMemo } from 'react'
import FloatingHearts from '../components/FloatingHearts'
import { generateFeedPosts } from '../data/mediaData'
import './Feed.css'

function Feed() {
  // Generate posts from YOUR personal images
  const initialPosts = useMemo(() => generateFeedPosts(), [])
  
  const [posts, setPosts] = useState(initialPosts)
  const [likedPosts, setLikedPosts] = useState({})
  const [savedPosts, setSavedPosts] = useState({})
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newPost, setNewPost] = useState({ content: '', author: 'Jimi', image: null })
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const toggleSave = (postId) => {
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setNewPost(prev => ({ ...prev, image: url }))
    }
  }

  const handleAddPost = () => {
    if (!newPost.content.trim()) return

    const post = {
      id: Date.now(),
      author: newPost.author,
      caption: newPost.content,
      image: newPost.image,
      timestamp: 'Just now',
      likes: 0,
      comments: []
    }

    setPosts(prev => [post, ...prev])
    setNewPost({ content: '', author: 'Jimi', image: null })
    setPreviewUrl(null)
    setShowUploadModal(false)
  }

  const closeModal = () => {
    setShowUploadModal(false)
    setNewPost({ content: '', author: 'Jimi', image: null })
    setPreviewUrl(null)
  }

  return (
    <div className="feed-page">
      <FloatingHearts />
      
      <div className="feed-container">
        {/* Header */}
        <div className="feed-header">
          <div className="feed-header-content">
            <div>
              <h2 className="feed-title">Our Private Feed</h2>
              <p className="feed-subtitle">Just for us</p>
            </div>
            <button 
              className="add-post-btn"
              onClick={() => setShowUploadModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Post
            </button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="upload-modal-overlay" onClick={closeModal}>
            <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Create a Memory Post 💕</h3>
              
              {/* Image Upload */}
              <div 
                className="image-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p>Click to add a photo (optional)</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />

              {/* Caption Input */}
              <textarea
                className="caption-input"
                placeholder="Write your caption here... 💭"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
              />

              {/* Author Toggle */}
              <div className="author-toggle">
                <span className="toggle-label">Posted by:</span>
                <div className="toggle-buttons">
                  <button 
                    className={`toggle-btn ${newPost.author === 'Jimi' ? 'active' : ''}`}
                    onClick={() => setNewPost(prev => ({ ...prev, author: 'Jimi' }))}
                  >
                    Jimi 💙
                  </button>
                  <button 
                    className={`toggle-btn ${newPost.author === 'Favour' ? 'active' : ''}`}
                    onClick={() => setNewPost(prev => ({ ...prev, author: 'Favour' }))}
                  >
                    Favour 💖
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button 
                  className="post-btn"
                  onClick={handleAddPost}
                  disabled={!newPost.content.trim()}
                >
                  Post 💕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts - Now showing YOUR personal photos */}
        <div className="posts-list">
          {posts.map((post, index) => (
            <article 
              key={post.id} 
              className="ig-post"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Post Header */}
              <div className="post-header">
                <div className="avatar-ring">
                  <img 
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${post.author}`}
                    alt={post.author}
                    className="avatar"
                  />
                </div>
                <div className="post-info">
                  <p className="username">{post.author}</p>
                  <p className="timestamp">{post.timestamp}</p>
                </div>
              </div>

              {/* Post Media - YOUR photos and videos */}
              {post.image && (
                <div className="post-image">
                  <img src={post.image} alt="Our memory" loading="lazy" />
                </div>
              )}
              {post.video && (
                <div className="post-video">
                  <video 
                    src={post.video} 
                    controls 
                    playsInline
                    preload="metadata"
                    className="video-player"
                  >
                    Your browser does not support video playback.
                  </video>
                  <span className="video-badge">🎥 Video</span>
                </div>
              )}

              {/* Post Actions */}
              <div className="post-actions">
                <div className="action-buttons">
                  <button 
                    className={`action-btn ${likedPosts[post.id] ? 'liked' : ''}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <svg viewBox="0 0 24 24" fill={likedPosts[post.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                    </svg>
                  </button>
                  <button className="action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
                    </svg>
                  </button>
                  <button className="action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                    </svg>
                  </button>
                </div>
                <button 
                  className={`action-btn save-btn ${savedPosts[post.id] ? 'saved' : ''}`}
                  onClick={() => toggleSave(post.id)}
                >
                  <svg viewBox="0 0 24 24" fill={savedPosts[post.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"/>
                  </svg>
                </button>
              </div>

              {/* Likes */}
              <p className="likes-count">{post.likes + (likedPosts[post.id] ? 1 : 0)} likes</p>

              {/* Caption */}
              <div className="caption">
                <span className="caption-username">{post.author}</span>
                <span className="caption-text">{post.caption}</span>
              </div>

              {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="comments">
                  {post.comments.map((comment, i) => (
                    <p key={i} className="comment">
                      <span className="comment-user">{comment.user}</span>
                      <span className="comment-text">{comment.text}</span>
                    </p>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feed
