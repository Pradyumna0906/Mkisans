const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDB } = require('../config/db');

// Ensure uploads/posts directory exists
const postsDir = path.join(__dirname, '..', 'uploads', 'posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// Multer config for post media
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, postsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `post-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increase to 50MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp|mp4|mov|avi/;
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Check if extension exists in allowed list
    if (allowedExtensions.test(ext)) {
      cb(null, true);
    } else {
      console.log(`❌ [Social] Upload Blocked: Name=${file.originalname}, Mime=${file.mimetype}`);
      cb(new Error(`Invalid file type: ${ext}`));
    }
  },
});

// ─── CREATE POST ──────────────────────────────────────────────────
router.post('/posts', upload.single('media'), (req, res) => {
  try {
    const { kisanId, caption } = req.body;
    console.log(`🚀 [Social] New Post Request: kisanId=${kisanId}, hasFile=${!!req.file}`);
    
    if (!kisanId || !req.file) {
      return res.status(400).json({ success: false, error: 'Kisan ID and media are required.' });
    }

    const db = getDB();
    
    // Check role
    const user = db.prepare('SELECT role FROM kisans WHERE id = ?').get(kisanId);
    if (!user || user.role !== 'farmer') {
      console.log(`❌ [Social] Post Denied: Role=${user?.role}`);
      return res.status(403).json({ success: false, error: 'Only farmers can share crop updates.' });
    }

    const mediaUrl = `/uploads/posts/${req.file.filename}`;
    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    const result = db.prepare(`
      INSERT INTO posts (kisan_id, caption, media_url, media_type)
      VALUES (?, ?, ?, ?)
    `).run(kisanId, caption, mediaUrl, mediaType);

    console.log(`✅ [Social] Post Created: ID=${result.lastInsertRowid}`);
    res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      postId: result.lastInsertRowid,
      post: {
        id: result.lastInsertRowid,
        kisan_id: kisanId,
        caption,
        media_url: mediaUrl,
        media_type: mediaType,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ [Social] Create post error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ─── GET FEED ────────────────────────────────────────────────────
router.get('/feed', (req, res) => {
  try {
    const { page = 1, limit = 10, kisanId } = req.query;
    const offset = (page - 1) * limit;
    const db = getDB();

    // Fetch posts with kisan details, like status, and following status
    const posts = db.prepare(`
      SELECT 
        p.*, 
        k.full_name as author_name, 
        k.profile_photo as author_photo,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comments_count,
        (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.kisan_id = ?) as is_liked,
        (SELECT 1 FROM follows f WHERE f.follower_id = ? AND f.following_id = p.kisan_id) as is_following
      FROM posts p
      JOIN kisans k ON p.kisan_id = k.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(kisanId || 0, kisanId || 0, limit, offset);

    res.json({ success: true, posts });
  } catch (error) {
    console.error('[Social] Feed error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ─── GET USER POSTS ──────────────────────────────────────────────
router.get('/posts/user/:kisanId', (req, res) => {
  try {
    const { kisanId } = req.params;
    const db = getDB();
    const posts = db.prepare(`
      SELECT * FROM posts 
      WHERE kisan_id = ? 
      ORDER BY created_at DESC
    `).all(kisanId);
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── GET PROFILE STATS ───────────────────────────────────────────
router.get('/profile/:kisanId', (req, res) => {
  try {
    const { kisanId } = req.params;
    const db = getDB();
    
    const stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM posts WHERE kisan_id = ?) as posts_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = ?) as followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = ?) as following_count
      FROM kisans WHERE id = ?
    `).get(kisanId, kisanId, kisanId, kisanId);

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ... (Toggle Like and Comment remain same)

// ─── FOLLOW/UNFOLLOW ─────────────────────────────────────────────
router.post('/follow', (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    if (!followerId || !followingId) return res.status(400).json({ success: false, error: 'Follower and Following IDs required.' });
    if (followerId == followingId) return res.status(400).json({ success: false, error: 'You cannot follow yourself.' });

    const db = getDB();

    // Fetch roles
    const follower = db.prepare('SELECT role FROM kisans WHERE id = ?').get(followerId);
    const following = db.prepare('SELECT role FROM kisans WHERE id = ?').get(followingId);

    if (!follower || !following) return res.status(404).json({ success: false, error: 'User not found.' });

    // Enforce Rule: Consumers can ONLY follow Farmers
    if (follower.role === 'consumer' && following.role !== 'farmer') {
      return res.status(403).json({ 
        success: false, 
        error: 'As a consumer, you can only follow farmers to see their crop updates.' 
      });
    }

    const existing = db.prepare('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?').get(followerId, followingId);

    if (existing) {
      db.prepare('DELETE FROM follows WHERE id = ?').run(existing.id);
      return res.json({ success: true, message: 'Unfollowed', isFollowing: false });
    } else {
      db.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)').run(followerId, followingId);
      return res.json({ success: true, message: 'Followed', isFollowing: true });
    }
  } catch (error) {
    console.error('[Social] Follow error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ─── DISCOVER USERS ─────────────────────────────────────────────
router.get('/discover', (req, res) => {
  try {
    const { kisanId, role } = req.query;
    const db = getDB();

    // Logic: 
    // If I am a consumer, only show me farmers.
    // If I am a farmer, show me everyone.
    let query = `
      SELECT id, full_name, profile_photo, role, is_verified 
      FROM kisans 
      WHERE id != ?
    `;
    const params = [kisanId || 0];

    if (role === 'consumer') {
      query += ' AND role = "farmer"';
    }

    query += ' ORDER BY created_at DESC LIMIT 20';

    const users = db.prepare(query).all(...params);

    // Add follow status
    const usersWithStatus = users.map(user => {
      const isFollowing = db.prepare('SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?')
        .get(kisanId || 0, user.id);
      return { ...user, isFollowing: !!isFollowing };
    });

    res.json({ success: true, data: usersWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── STORIES ─────────────────────────────────────────────────────
router.post('/stories', upload.single('media'), (req, res) => {
  try {
    const { kisanId } = req.body;
    if (!kisanId || !req.file) return res.status(400).json({ success: false, error: 'Media required' });

    const db = getDB();

    // Check role
    const user = db.prepare('SELECT role FROM kisans WHERE id = ?').get(kisanId);
    if (!user || user.role !== 'farmer') {
      return res.status(403).json({ success: false, error: 'Only farmers can share stories.' });
    }

    const mediaUrl = `/uploads/posts/${req.file.filename}`; // Reuse posts folder
    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    const result = db.prepare(`
      INSERT INTO stories (kisan_id, media_url, media_type, expires_at)
      VALUES (?, ?, ?, datetime('now', '+1 day'))
    `).run(kisanId, mediaUrl, mediaType);

    res.json({ success: true, storyId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stories', (req, res) => {
  try {
    const db = getDB();
    // Fetch active stories with user info
    const stories = db.prepare(`
      SELECT s.*, k.full_name as author_name, k.profile_photo as author_photo
      FROM stories s
      JOIN kisans k ON s.kisan_id = k.id
      WHERE s.expires_at > datetime('now')
      ORDER BY s.created_at DESC
    `).all();

    // Group by user for Instagram-style horizontal bar
    const grouped = stories.reduce((acc, story) => {
      if (!acc[story.kisan_id]) {
        acc[story.kisan_id] = {
          kisan_id: story.kisan_id,
          author_name: story.author_name,
          author_photo: story.author_photo,
          stories: []
        };
      }
      acc[story.kisan_id].stories.push(story);
      return acc;
    }, {});

    res.json({ success: true, data: Object.values(grouped) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── DELETE POST ─────────────────────────────────────────────────
router.delete('/posts/:postId', (req, res) => {
  try {
    const { postId } = req.params;
    const { kisanId } = req.body; // In production, get from auth token

    if (!postId || !kisanId) {
      return res.status(400).json({ success: false, error: 'Post ID and Kisan ID required.' });
    }

    const db = getDB();
    
    // Verify ownership
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });
    
    if (post.kisan_id != kisanId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this post.' });
    }

    // Delete media file
    if (post.media_url) {
      const filePath = path.join(__dirname, '..', post.media_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ [Social] Media deleted: ${filePath}`);
      }
    }

    db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
    
    console.log(`✅ [Social] Post Deleted: ID=${postId}`);
    res.json({ success: true, message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('❌ [Social] Delete post error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ─── EDIT POST ───────────────────────────────────────────────────
router.put('/posts/:postId', (req, res) => {
  try {
    const { postId } = req.params;
    const { kisanId, caption } = req.body;

    if (!postId || !kisanId) {
      return res.status(400).json({ success: false, error: 'Post ID and Kisan ID required.' });
    }

    const db = getDB();
    
    // Verify ownership
    const post = db.prepare('SELECT kisan_id FROM posts WHERE id = ?').get(postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });
    
    if (post.kisan_id != kisanId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to edit this post.' });
    }

    db.prepare('UPDATE posts SET caption = ? WHERE id = ?').run(caption, postId);
    
    console.log(`✅ [Social] Post Updated: ID=${postId}`);
    res.json({ success: true, message: 'Post updated successfully.' });
  } catch (error) {
    console.error('❌ [Social] Edit post error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

module.exports = router;

