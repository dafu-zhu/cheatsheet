const express = require('express');
const passport = require('passport');
const router = express.Router();

// GitHub OAuth routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: process.env.FRONTEND_URL }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(process.env.FRONTEND_URL);
  }
);

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        displayName: req.user.displayName,
        avatarUrl: req.user.avatarUrl,
      },
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
