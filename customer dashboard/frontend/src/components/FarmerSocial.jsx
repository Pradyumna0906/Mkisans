import React, { useState, useEffect } from 'react';
import './FarmerSocial.css';

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/social`;

const FarmerSocial = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postRes, storyRes] = await Promise.all([
        fetch(`${API_URL}/feed`),
        fetch(`${API_URL}/stories`)
      ]);
      const postData = await postRes.json();
      const storyData = await storyRes.json();

      if (postData.success) setPosts(postData.posts);
      if (storyData.success) setStories(storyData.data);
    } catch (error) {
      console.error('Error fetching social feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="social-loading">Analyzing Social Pulse...</div>;
  }

  return (
    <div className="farmer-social-container">
      <div className="social-header">
        <span className="live-indicator">LIVE</span>
        <h2>🌾 Kisan Community Social</h2>
        <p>Connecting India's farmers through stories & innovation</p>
      </div>

      {/* Stories Bar */}
      <div className="web-story-bar">
        <div className="web-story-item add-story">
          <div className="story-avatar-wrapper">
            <div className="add-plus">+</div>
            <img src="https://via.placeholder.com/60" alt="Add" />
          </div>
          <span>Your Story</span>
        </div>
        {stories.map((s, i) => (
          <div key={i} className="web-story-item">
            <div className="story-avatar-wrapper seen">
              <img src={s.author_photo ? `${BASE_URL}/${s.author_photo}` : 'https://via.placeholder.com/60'} alt={s.author_name} />
            </div>
            <span>{s.author_name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      <div className="social-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="social-card">
              <div className="card-header">
                <img 
                  src={post.author_photo ? `${BASE_URL}/${post.author_photo}` : 'https://via.placeholder.com/40'} 
                  alt={post.author_name} 
                  className="author-avatar"
                />
                <div className="author-info">
                  <span className="author-name">{post.author_name}</span>
                  <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="card-media">
                {post.media_type === 'video' ? (
                  <video src={`${BASE_URL}${post.media_url}`} controls className="media-element" />
                ) : (
                  <img src={`${BASE_URL}${post.media_url}`} alt="Crop update" className="media-element" />
                )}
              </div>

              <div className="card-content">
                <div className="interaction-bar">
                  <span>❤️ {post.likes_count || 0}</span>
                  <span>💬 {post.comments_count || 0}</span>
                </div>
                <p className="caption">
                  <strong>{post.author_name}</strong> {post.caption}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <p>No social updates yet. Farmers are busy in the fields! 🚜</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerSocial;
