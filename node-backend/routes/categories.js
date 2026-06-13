const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories — List all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id — Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// POST /api/categories — Create a category
router.post('/', async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(409).json({ error: 'Category already exists' });

    const category = new Category({ name: name.trim(), description, icon });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id — Update a category
router.put('/:id', async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, icon },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id — Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
