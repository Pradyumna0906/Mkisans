import React, { useState, useEffect } from 'react';
import './FarmerSocial.css';

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/social`;

const FarmerSocial = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchDiscover();
  }, []);

  const fetchData = async () => {
    try {
      const kisanId = 1; 
      const [postRes, storyRes] = await Promise.all([
        fetch(`${API_URL}/feed?kisanId=${kisanId}`),
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

  const fetchDiscover = async () => {
    try {
      const kisanId = 1;
      const res = await fetch(`${API_URL}/discover?kisanId=${kisanId}`);
      const data = await res.json();
      if (data.success) setDiscoverUsers(data.data);
    } catch (err) {
      console.error('Error fetching discover:', err);
    }
  };

  const handleFollow = async (targetId, isCurrentlyFollowing) => {
    const kisanId = 1; 
    try {
      setDiscoverUsers(prev => prev.map(u => u.id === targetId ? { ...u, isFollowing: !isCurrentlyFollowing } : u));
      setPosts(prev => prev.map(p => p.kisan_id === targetId ? { ...p, is_following: !isCurrentlyFollowing } : p));

      const res = await fetch(`${API_URL}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: kisanId, followingId: targetId }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error);
        fetchData(); 
        fetchDiscover();
      }
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const handleDelete = async (postId, kisanId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kisanId })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter(p => p.id !== postId));
      } else {
        alert(data.error || 'Failed to delete post');
      }
    } catch (err) {
      alert('Error deleting post');
    }
  };

  const startEdit = (post) => {
    setEditingPost(post.id);
    setEditCaption(post.caption);
  };

  const handleEdit = async (postId, kisanId) => {
    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kisanId, caption: editCaption })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => p.id === postId ? { ...p, caption: editCaption } : p));
        setEditingPost(null);
      } else {
        alert(data.error || 'Failed to update post');
      }
    } catch (err) {
      alert('Error updating post');
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

      <div className="discover-section">
        <div className="section-title-row">
          <h3>Discover People</h3>
          <span>Farmer & Consumer Network</span>
        </div>
        <div className="discover-list">
          {discoverUsers.map((user) => (
            <div key={user.id} className="discover-card">
              <img 
                src={user.profile_photo ? `${BASE_URL}/${user.profile_photo}` : 'https://via.placeholder.com/60'} 
                alt={user.full_name} 
              />
              <span className="discover-name">{user.full_name}</span>
              <span className={`role-badge ${user.role}`}>
                {user.role === 'farmer' ? 'Farmer' : 'Consumer'}
              </span>
              <button 
                className={`follow-btn ${user.isFollowing ? 'following' : ''}`}
                onClick={() => handleFollow(user.id, user.isFollowing)}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

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
                  <div className="author-name-row">
                    <span className="author-name">{post.author_name}</span>
                    <span className={`role-tag ${post.role || 'farmer'}`}>
                      {post.role === 'consumer' ? 'Consumer' : 'Farmer'}
                    </span>
                  </div>
                  <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="post-header-actions">
                  {!post.is_following && post.kisan_id !== 1 && (
                    <button 
                      className="inline-follow-btn"
                      onClick={() => handleFollow(post.kisan_id, false)}
                    >
                      + Follow
                    </button>
                  )}
                  {post.is_following && post.kisan_id !== 1 && (
                    <span className="following-label">Following</span>
                  )}
                  
                  {post.kisan_id === 1 && (
                    <div className="post-actions">
                      <button className="action-btn edit" onClick={() => startEdit(post)} title="Edit Post">✏️</button>
                      <button className="action-btn delete" onClick={() => handleDelete(post.id, post.kisan_id)} title="Delete Post">🗑️</button>
                    </div>
                  )}
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
                
                {editingPost === post.id ? (
                  <div className="edit-zone">
                    <textarea 
                      value={editCaption} 
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="edit-input"
                    />
                    <div className="edit-buttons">
                      <button onClick={() => handleEdit(post.id, post.kisan_id)} className="save-btn">Save</button>
                      <button onClick={() => setEditingPost(null)} className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="caption">
                    <strong>{post.author_name}</strong> {post.caption}
                  </p>
                )}
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
