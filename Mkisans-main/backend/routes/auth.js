const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDB } = require('../config/db');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const subDirs = ['profiles', 'aadhaar', 'pan', 'land', 'address'];
[uploadsDir, ...subDirs.map(d => path.join(uploadsDir, d))].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldMap = {
      profilePhoto: 'profiles',
      aadhaarPhoto: 'aadhaar',
      panPhoto: 'pan',
      landProofPhoto: 'land',
      addressProofPhoto: 'address',
    };
    const folder = fieldMap[file.fieldname] || 'profiles';
    cb(null, path.join(uploadsDir, folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, WebP) and PDFs are allowed'));
    }
  },
});

const uploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'aadhaarPhoto', maxCount: 1 },
  { name: 'panPhoto', maxCount: 1 },
  { name: 'landProofPhoto', maxCount: 1 },
  { name: 'addressProofPhoto', maxCount: 1 },
]);

// ─── REGISTER (Step 1 + Step 2 combined) ───────────────────────────
router.post('/register', (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    try {
      const {
        // Step 1 — Mandatory
        fullName,
        mobileNumber,
        email,
        password,
        confirmPassword,
        // Step 2 — Optional
        aadhaarNumber,
        panNumber,
        state,
        district,
        village,
        pinCode,
        geoLat,
        geoLng,
        address,
        role,
      } = req.body;

      // ── Validation ──
      if (!fullName || !mobileNumber || !email || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Full Name, Mobile Number, Email, Password, and Confirm Password are required.',
        });
      }

      const userRole = role || 'farmer'; // Default to farmer
      if (!['farmer', 'consumer'].includes(userRole)) {
        return res.status(400).json({ success: false, error: 'Invalid role. Must be farmer or consumer.' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Passwords do not match.' });
      }

      if (!/^\d{10}$/.test(mobileNumber)) {
        return res.status(400).json({ success: false, error: 'Mobile number must be 10 digits.' });
      }

      /* 
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email address.' });
      }
      */

      if (password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
      }

      const db = getDB();

      // Check duplicate mobile / email
      const existing = db.prepare(
        'SELECT id FROM kisans WHERE mobile_number = ? OR email = ?'
      ).get(mobileNumber, email);

      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'An account with this mobile number or email already exists.',
        });
      }

      // Hash password
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      // Extract uploaded file paths
      const getFilePath = (fieldName) => {
        if (req.files && req.files[fieldName] && req.files[fieldName][0]) {
          return req.files[fieldName][0].path;
        }
        return null;
      };

      const stmt = db.prepare(`
        INSERT INTO kisans (
          full_name, mobile_number, email, password_hash,
          profile_photo,
          aadhaar_number, aadhaar_photo,
          pan_number, pan_photo,
          land_proof_photo,
          address_proof_photo,
          state, district, village, pin_code,
          geo_lat, geo_lng, address, role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        fullName,
        mobileNumber,
        email,
        passwordHash,
        getFilePath('profilePhoto'),
        aadhaarNumber || null,
        getFilePath('aadhaarPhoto'),
        panNumber || null,
        getFilePath('panPhoto'),
        getFilePath('landProofPhoto'),
        getFilePath('addressProofPhoto'),
        state || null,
        district || null,
        village || null,
        pinCode || null,
        geoLat || null,
        geoLng || null,
        address || null,
        userRole
      );

      res.status(201).json({
        success: true,
        message: 'Kisan registered successfully!',
        kisanId: result.lastInsertRowid,
      });
    } catch (error) {
      console.error('[Auth] Registration error:', error);
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  });
});

// ─── LOGIN ──────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or mobile

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email/Mobile and Password are required.',
      });
    }

    const db = getDB();
    console.log(`[Auth] Login attempt: identifier="${identifier}"`);
    const kisan = db.prepare(
      'SELECT * FROM kisans WHERE email = ? OR mobile_number = ?'
    ).get(identifier, identifier);

    if (!kisan) {
      console.log(`[Auth] Login failed: User not found for "${identifier}"`);
      return res.status(401).json({ success: false, error: 'Account not found.' });
    }

    const isMatch = bcrypt.compareSync(password, kisan.password_hash);
    console.log(`[Auth] Password match for "${identifier}": ${isMatch}`);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid password.' });
    }

    // Return kisan profile (exclude sensitive fields)
    const { password_hash, ...profile } = kisan;
    res.json({
      success: true,
      message: 'Login successful!',
      kisan: profile,
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ─── SEND OTP (simulated) ───────────────────────────────────────────
router.post('/send-otp', (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
    return res.status(400).json({ success: false, error: 'Valid 10-digit mobile number required.' });
  }

  // In production, integrate with SMS gateway (Twilio, MSG91, etc.)
  // For now, OTP is always 1234
  console.log(`[OTP] Sent OTP to +91${mobileNumber}: 1234`);
  res.json({
    success: true,
    message: `OTP sent to +91${mobileNumber}`,
    // Remove in production — for dev/testing only
    devOtp: '1234',
  });
});

// ─── VERIFY OTP (simulated) ────────────────────────────────────────
router.post('/verify-otp', (req, res) => {
  const { mobileNumber, otp } = req.body;
  if (!mobileNumber || !otp) {
    return res.status(400).json({ success: false, error: 'Mobile number and OTP required.' });
  }

  // Simulated check — accept 1234
  if (otp === '1234') {
    res.json({ success: true, message: 'OTP verified successfully.' });
  } else {
    res.status(400).json({ success: false, error: 'Invalid OTP.' });
  }
});

// ─── GET PROFILE ────────────────────────────────────────────────────
router.get('/profile/:id', (req, res) => {
  try {
    const db = getDB();
    const kisan = db.prepare('SELECT * FROM kisans WHERE id = ?').get(req.params.id);
    if (!kisan) {
      return res.status(404).json({ success: false, error: 'Kisan not found.' });
    }
    const { password_hash, ...profile } = kisan;
    res.json({ success: true, kisan: profile });
  } catch (error) {
    console.error('[Auth] Profile error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ─── UPDATE PROFILE (Step 2 data update) ────────────────────────────
router.put('/profile/:id', (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    try {
      const db = getDB();
      const kisanId = req.params.id;

      const existing = db.prepare('SELECT id FROM kisans WHERE id = ?').get(kisanId);
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Kisan not found.' });
      }

      const {
        aadhaarNumber, panNumber,
        state, district, village, pinCode,
        geoLat, geoLng, address,
      } = req.body;

      const getFilePath = (fieldName) => {
        if (req.files && req.files[fieldName] && req.files[fieldName][0]) {
          return req.files[fieldName][0].path;
        }
        return undefined; // don't update if not provided
      };

      // Build dynamic update
      const updates = [];
      const values = [];

      const addField = (col, val) => {
        if (val !== undefined && val !== null) {
          updates.push(`${col} = ?`);
          values.push(val);
        }
      };

      addField('aadhaar_number', aadhaarNumber);
      addField('aadhaar_photo', getFilePath('aadhaarPhoto'));
      addField('pan_number', panNumber);
      addField('pan_photo', getFilePath('panPhoto'));
      addField('land_proof_photo', getFilePath('landProofPhoto'));
      addField('address_proof_photo', getFilePath('addressProofPhoto'));
      addField('state', state);
      addField('district', district);
      addField('village', village);
      addField('pin_code', pinCode);
      addField('geo_lat', geoLat);
      addField('geo_lng', geoLng);
      addField('address', address);

      if (updates.length === 0) {
        return res.json({ success: true, message: 'Nothing to update.' });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(kisanId);

      db.prepare(`UPDATE kisans SET ${updates.join(', ')} WHERE id = ?`).run(...values);

      res.json({ success: true, message: 'Profile updated successfully.' });
    } catch (error) {
      console.error('[Auth] Profile update error:', error);
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  });
});

// ─── RESET PASSWORD (Override) ──────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    let { identifier, newPassword } = req.body;

    if (!identifier || !newPassword) {
      return res.status(400).json({ success: false, error: 'Identifier and New Password are required.' });
    }

    identifier = identifier.trim();
    newPassword = newPassword.trim();

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const db = getDB();
    const kisan = db.prepare('SELECT id FROM kisans WHERE email = ? OR mobile_number = ?').get(identifier, identifier);

    if (!kisan) {
      return res.status(404).json({ success: false, error: 'Account not found.' });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);

    db.prepare('UPDATE kisans SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(passwordHash, kisan.id);

    console.log(`[Auth] Password reset successful for "${identifier}"`);
    res.json({ success: true, message: 'Password reset successful!' });
  } catch (error) {
    console.error('[Auth] Reset password error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

module.exports = router;
