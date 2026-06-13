const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET /api/reviews — List all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/:id — Get single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// POST /api/reviews — Create a review
router.post('/', async (req, res) => {
  try {
    const { componentName, rating, comment, reviewerName } = req.body;
    if (!componentName || !rating) {
      return res.status(400).json({ error: 'componentName and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = new Review({ componentName, rating, comment, reviewerName });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT /api/reviews/:id — Update a review
router.put('/:id', async (req, res) => {
  try {
    const { componentName, rating, comment, reviewerName } = req.body;
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { componentName, rating, comment, reviewerName },
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /api/reviews/:id — Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
