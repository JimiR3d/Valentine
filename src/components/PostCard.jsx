import { useState } from 'react'
import './PostCard.css'

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setIsLiked(!isLiked)
  }

  const getTypeEmoji = (type) => {
    switch (type) {
      case 'memory': return '💭'
      case 'compliment': return '💖'
      case 'future': return '🔮'
      default: return '💕'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'memory': return 'Memory'
      case 'compliment': return 'Love Note'
      case 'future': return 'Future Plans'
      default: return 'Thought'
    }
  }

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-avatar">J</div>
        <div className="post-meta">
          <span className="post-author">Jimmy</span>
          <span className="post-time">{post.timestamp}</span>
        </div>
        <span className="post-type-badge" data-type={post.type}>
          {getTypeEmoji(post.type)} {getTypeLabel(post.type)}
        </span>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="heart-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="like-count">{likes}</span>
        </button>
        
        <button 
          className={`action-btn save-btn ${isSaved ? 'saved' : ''}`}
          onClick={() => setIsSaved(!isSaved)}
        >
          {isSaved ? '📌' : '📍'} {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  )
}

export default PostCard
