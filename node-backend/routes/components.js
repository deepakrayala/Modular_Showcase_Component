const express = require('express');
const router = express.Router();
const Component = require('../models/Component');

// GET /api/mongo/components — List all components from MongoDB
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const components = await Component.find(filter).sort({ createdAt: -1 });
    res.json(components);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

// GET /api/mongo/components/:id — Get single component
router.get('/:id', async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ error: 'Component not found' });
    res.json(component);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch component' });
  }
});

// POST /api/mongo/components — Create a new UI component (admin only — validated by gateway)
router.post('/', async (req, res) => {
  try {
    const { name, category, description, codeSnippet, props, status, tags, createdBy } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const component = new Component({
      name: name.trim(),
      category: category.trim(),
      description: description || '',
      codeSnippet: codeSnippet || '',
      props: props || '',
      status: status || 'active',
      tags: tags || [],
      createdBy: createdBy || 'Admin',
    });

    await component.save();
    res.status(201).json(component);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create component: ' + err.message });
  }
});

// PUT /api/mongo/components/:id — Update a component
router.put('/:id', async (req, res) => {
  try {
    const { name, category, description, codeSnippet, props, status, tags } = req.body;

    const component = await Component.findByIdAndUpdate(
      req.params.id,
      { name, category, description, codeSnippet, props, status, tags },
      { new: true, runValidators: true }
    );

    if (!component) return res.status(404).json({ error: 'Component not found' });
    res.json(component);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update component' });
  }
});

// DELETE /api/mongo/components/:id — Delete a component
router.delete('/:id', async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    if (!component) return res.status(404).json({ error: 'Component not found' });
    res.json({ message: 'Component deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete component' });
  }
});

module.exports = router;
