# Backend Lockout Status API Implementation Guide

## Overview

This document provides the complete implementation for the lockout status API endpoint that syncs frontend lockout state with the backend server.

---

## 🎯 Purpose

- Allow frontend to query current lockout status from server
- Provide single source of truth for lockout state
- Enable cross-device lockout enforcement
- Support admin monitoring of locked accounts

---

## 📡 API Endpoint Implementation

### Route: GET `/api/auth/lockout-status/:username`

Add this endpoint to your `routes/auth.js` file:

```javascript
// routes/auth.js

const express = require('express');
const router = express.Router();
const RateLimit = require('../models/RateLimit'); // Your rate limit model

/**
 * @route   GET /api/auth/lockout-status/:username
 * @desc    Get current lockout status for a user
 * @access  Public (no auth required - used before login)
 * @param   {string} username - The username to check lockout status for
 * @returns {object} Lockout status information
 */
router.get('/lockout-status/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Get client IP address
    const ip =
      req.ip ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection.remoteAddress;

    // Create unique identifier (same logic as login rate limiter)
    const identifier = `${ip}_${username}`;

    // Find rate limit record in database
    const record = await RateLimit.findOne({ identifier });

    // If no record exists, user has never attempted login
    if (!record) {
      return res.json({
        isLocked: false,
        remainingAttempts: 5,
        attemptCount: 0,
        lockedUntil: null,
      });
    }

    const now = Date.now();

    // Check if currently locked
    const isLocked = record.lockedUntil && now < record.lockedUntil;

    // Calculate remaining attempts (max 5)
    const remainingAttempts = Math.max(0, 5 - record.attempts);

    // Return status
    res.json({
      isLocked,
      lockedUntil: isLocked ? record.lockedUntil : null,
      remainingAttempts,
      attemptCount: record.attempts,
      lastAttemptAt: record.lastAttemptAt,
    });
  } catch (error) {
    console.error('Lockout status check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      isLocked: false, // Fail open to allow frontend fallback
    });
  }
});

module.exports = router;
```

---

## 🗄️ Database Model

Ensure your `RateLimit` model has these fields:

```javascript
// models/RateLimit.js

const mongoose = require('mongoose');

const rateLimitSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
    type: Date,
    default: null,
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Auto-delete after 24 hours
  },
});

module.exports = mongoose.model('RateLimit', rateLimitSchema);
```

---

## 🔧 Configuration

### Environment Variables

Add to your `.env` file:

```env
# Rate Limiting Configuration
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15
RATE_LIMIT_WINDOW_MINUTES=15
```

### CORS Configuration

Ensure your CORS allows the lockout status endpoint:

```javascript
// server.js or app.js

const cors = require('cors');

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
```

---

## 🧪 Testing the Endpoint

### Using cURL

```bash
# Check lockout status for a user
curl -X GET "http://localhost:5000/api/auth/lockout-status/testuser"

# Expected response (not locked):
{
  "isLocked": false,
  "remainingAttempts": 5,
  "attemptCount": 0,
  "lockedUntil": null
}

# Expected response (locked):
{
  "isLocked": true,
  "lockedUntil": 1699382400000,
  "remainingAttempts": 0,
  "attemptCount": 5,
  "lastAttemptAt": "2025-11-07T10:30:00.000Z"
}
```

### Using Postman

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/auth/lockout-status/testuser`
3. **Headers:** None required
4. **Expected Status:** 200 OK

---

## 🔄 Frontend Integration

The frontend is already configured to call this endpoint! Here's what happens:

```typescript
// src/admin/auth/AdminLogin.tsx (already implemented)

useEffect(() => {
  const syncLockoutStatus = async () => {
    if (!formData.username) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/lockout-status/${formData.username}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Backend lockout state is checked
        if (data.isLocked && !isLocked) {
          console.log('Backend lockout detected:', data);
        }
      }
    } catch (err) {
      // Fallback to localStorage-based rate limiting
      console.log('Using client-side rate limiting');
    }
  };

  if (formData.username.length > 0) {
    syncLockoutStatus();
  }
}, [formData.username]);
```

---

## 🛡️ Security Considerations

### 1. **Rate Limit the Status Check Endpoint**

Prevent abuse of the status check endpoint:

```javascript
const rateLimit = require('express-rate-limit');

const statusCheckLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many status check requests',
});

router.get(
  '/lockout-status/:username',
  statusCheckLimiter,
  async (req, res) => {
    // ... implementation
  }
);
```

### 2. **Validate Username Input**

Sanitize username parameter:

```javascript
const validator = require('validator');

router.get('/lockout-status/:username', async (req, res) => {
  const { username } = req.params;

  // Validate username format
  if (!username || !validator.isAlphanumeric(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }

  // Continue with implementation...
});
```

### 3. **Log Status Checks**

Add logging for security monitoring:

```javascript
const { logSecurityEvent } = require('../utils/securityLogger');

router.get('/lockout-status/:username', async (req, res) => {
  const { username } = req.params;
  const ip = req.ip;

  // Log the status check
  await logSecurityEvent({
    type: 'LOCKOUT_STATUS_CHECK',
    username,
    ip,
    timestamp: new Date(),
  });

  // Continue with implementation...
});
```

---

## 📊 Response Schema

### Success Response (200 OK)

```typescript
interface LockoutStatusResponse {
  isLocked: boolean; // Whether account is currently locked
  lockedUntil: number | null; // Unix timestamp when lockout expires (null if not locked)
  remainingAttempts: number; // How many attempts left before lockout (0-5)
  attemptCount: number; // Total failed attempts recorded
  lastAttemptAt?: string; // ISO timestamp of last login attempt
}
```

### Error Response (500 Internal Server Error)

```json
{
  "error": "Internal server error",
  "isLocked": false
}
```

---

## 🚀 Deployment Checklist

- [ ] Add route to `routes/auth.js`
- [ ] Create/verify `RateLimit` model exists
- [ ] Add environment variables to `.env`
- [ ] Configure CORS to allow frontend origin
- [ ] Add rate limiting to status check endpoint
- [ ] Add input validation
- [ ] Add security logging
- [ ] Test endpoint with cURL/Postman
- [ ] Verify frontend can connect
- [ ] Test lockout flow end-to-end
- [ ] Monitor logs for errors

---

## 🔍 Troubleshooting

### Frontend shows "Using client-side rate limiting"

**Cause:** Backend endpoint unreachable or returning errors

**Solutions:**

1. Check backend server is running
2. Verify `VITE_API_BASE_URL` is correct in frontend `.env`
3. Check CORS configuration allows frontend origin
4. Check browser console for network errors

### Endpoint returns 500 error

**Cause:** Database connection issue or missing model

**Solutions:**

1. Verify MongoDB is running
2. Check `RateLimit` model is imported correctly
3. Check database connection string
4. Review server error logs

### Lockout not persisting across devices

**Cause:** Backend not enforcing lockout or frontend not checking

**Solutions:**

1. Verify backend login endpoint uses same `identifier` logic
2. Check frontend calls status endpoint on mount
3. Ensure database record is created on failed attempts

---

## 📝 Example: Complete Implementation

Here's a complete working example with all features:

```javascript
// routes/auth.js - COMPLETE IMPLEMENTATION

const express = require('express');
const router = express.Router();
const RateLimit = require('../models/RateLimit');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const { logSecurityEvent } = require('../utils/securityLogger');

// Rate limit the status check endpoint itself
const statusCheckLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'Too many status check requests',
});

/**
 * Get lockout status for a username
 */
router.get(
  '/lockout-status/:username',
  statusCheckLimiter,
  async (req, res) => {
    try {
      const { username } = req.params;

      // Validate username
      if (!username || !validator.isAlphanumeric(username)) {
        return res.status(400).json({ error: 'Invalid username format' });
      }

      // Get IP
      const ip =
        req.ip ||
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.connection.remoteAddress;

      const identifier = `${ip}_${username}`;

      // Log status check
      await logSecurityEvent({
        type: 'LOCKOUT_STATUS_CHECK',
        username,
        ip,
        identifier,
        timestamp: new Date(),
      });

      // Find record
      const record = await RateLimit.findOne({ identifier });

      if (!record) {
        return res.json({
          isLocked: false,
          remainingAttempts: 5,
          attemptCount: 0,
          lockedUntil: null,
        });
      }

      const now = Date.now();
      const isLocked = record.lockedUntil && now < record.lockedUntil;
      const remainingAttempts = Math.max(0, 5 - record.attempts);

      res.json({
        isLocked,
        lockedUntil: isLocked ? record.lockedUntil : null,
        remainingAttempts,
        attemptCount: record.attempts,
        lastAttemptAt: record.lastAttemptAt,
      });
    } catch (error) {
      console.error('Lockout status error:', error);

      // Log error
      await logSecurityEvent({
        type: 'LOCKOUT_STATUS_ERROR',
        error: error.message,
        timestamp: new Date(),
      });

      res.status(500).json({
        error: 'Internal server error',
        isLocked: false,
      });
    }
  }
);

module.exports = router;
```

---

## ✅ Verification

After implementation, verify:

1. **Endpoint is accessible:**

   ```bash
   curl http://localhost:5000/api/auth/lockout-status/testuser
   ```

2. **Frontend connects successfully:**
   - Open browser DevTools → Network tab
   - Type a username in login form
   - Should see request to `/auth/lockout-status/username`
   - Should receive 200 OK response

3. **Lockout persists across devices:**
   - Fail login 5 times on Device A
   - Try to login on Device B
   - Should see lockout UI immediately

4. **Auto-unlock works:**
   - Wait for 15-minute timer to expire
   - Login form should become available
   - Should be able to attempt login again

---

## 🎉 Benefits

Once implemented, you get:

- ✅ **Cross-device lockout enforcement**
- ✅ **Backend as single source of truth**
- ✅ **Admin can monitor locked accounts**
- ✅ **More secure (can't bypass with localStorage clear)**
- ✅ **Centralized security logging**
- ✅ **Better user experience (consistent state)**

---

## 📚 Additional Resources

- [Express Rate Limit Documentation](https://github.com/nfriedly/express-rate-limit)
- [Mongoose TTL Indexes](https://mongoosejs.com/docs/guide.html#indexes)
- [CORS Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Input Validation with Validator.js](https://github.com/validatorjs/validator.js)

---

**Need Help?**

If you encounter issues implementing this endpoint, check:

1. Server logs for errors
2. Database connection status
3. CORS configuration
4. Frontend `.env` variables
5. Network tab in browser DevTools
