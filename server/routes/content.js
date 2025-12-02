import express from 'express';
const router = express.Router();
import Content from '../models/Content.js';

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Get user's content
router.get('/', requireAuth, async (req, res) => {
  try {
    let content = await Content.findOne({ userId: req.user._id });

    if (!content) {
      // Create default content for new users
      content = await Content.create({
        userId: req.user._id,
        content: '',
        columns: 2,
        fontSize: 14,
      });
    }

    res.json({
      content: content.content,
      columns: content.columns,
      fontSize: content.fontSize,
      updatedAt: content.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update user's content
router.put('/', requireAuth, async (req, res) => {
  try {
    const { content, columns, fontSize } = req.body;

    let userContent = await Content.findOne({ userId: req.user._id });

    if (!userContent) {
      userContent = await Content.create({
        userId: req.user._id,
        content: content || '',
        columns: columns || 2,
        fontSize: fontSize || 14,
      });
    } else {
      if (content !== undefined) userContent.content = content;
      if (columns !== undefined) userContent.columns = columns;
      if (fontSize !== undefined) userContent.fontSize = fontSize;
      await userContent.save();
    }

    res.json({
      content: userContent.content,
      columns: userContent.columns,
      fontSize: userContent.fontSize,
      updatedAt: userContent.updatedAt,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

export default router;
