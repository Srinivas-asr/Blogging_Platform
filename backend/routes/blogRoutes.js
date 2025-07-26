const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', '_id name');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', '_id name').populate('comments.user', 'name');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, content, author, categories, image, imageSize } = req.body;
  try {
    if (!title || !content || !author || !categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: title, content, author, and categories are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }

    const blog = new Blog({
      title,
      content,
      author,
      categories,
      image: image || '',
      imageSize: imageSize || 'medium',
      likes: 0,
      comments: [],
    });
    await blog.save();
    const populatedBlog = await Blog.findById(blog._id).populate('author', '_id name');
    res.status(201).json(populatedBlog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, content, author, categories, image, imageSize } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, author, categories, image, imageSize },
      { new: true }
    ).populate('author', '_id name');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  const { user, content } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: 'Invalid user ID for comment' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    blog.comments.push({ user, content });
    await blog.save();
    const populatedBlog = await Blog.findById(blog._id).populate('author', '_id name').populate('comments.user', 'name');
    res.json(populatedBlog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id/like', async (req, res) => {
  const { increment } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    blog.likes += increment ? 1 : -1;
    await blog.save();
    const populatedBlog = await Blog.findById(blog._id).populate('author', '_id name');
    res.json(populatedBlog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;