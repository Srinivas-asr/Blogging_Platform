const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');

// Setup admin user
router.post('/setup-admin', async (req, res) => {
  try {
    console.log('Setting up admin user...');
    let user = await User.findOne({ email: 'srinivas@gmail.com', role: 'admin' });

    if (!user) {
      console.log('Admin user not found, creating new admin user...');
      const hashedPassword = await bcrypt.hash('123456', 10);
      user = new User({
        name: 'srinivas',
        email: 'srinivas@gmail.com',
        password: hashedPassword,
        dateOfBirth: new Date('2025-07-30'),
        role: 'admin',
      });
      await user.save();
      console.log('Admin user created:', {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
      });
    } else {
      console.log('Admin user already exists:', {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }

    res.json({
      message: 'Admin setup successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error in setup-admin:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Admin login attempt:', { email, password });

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!user) {
      console.log('Admin user not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('Admin user found:', {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const isMatch = await user.matchPassword(password);
    console.log('Stored hashed password:', user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Password does not match for email:', email);
      return res.status(400).json({ message: 'Invalid password' });
    }

    user.lastLogin = new Date();
    await user.save();
    console.log('Admin login successful:', { email: user.email });

    const token = user.generateAuthToken();
    res.json({
      message: 'Admin login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
      },
      token,
    });
  } catch (err) {
    console.error('Error in admin login:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin forgot password verification
router.post('/forgot-password', async (req, res) => {
  const { email, dateOfBirth } = req.body;
  console.log('Admin forgot password attempt:', { email, dateOfBirth });

  try {
    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!user) {
      console.log('Admin user not found for email:', email);
      return res.status(400).json({ message: 'Invalid email' });
    }

    const inputDate = new Date(dateOfBirth);
    if (isNaN(inputDate.getTime()) || user.dateOfBirth.getTime() !== inputDate.getTime()) {
      console.log('Date of birth does not match for email:', email);
      return res.status(400).json({ message: 'Date of birth does not match' });
    }

    console.log('Forgot password verification successful for email:', email);
    res.json({ message: 'Verification successful' });
  } catch (err) {
    console.error('Error in forgot-password:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin password reset
router.put('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  console.log('Admin password reset attempt:', { email });

  if (!email || !newPassword) {
    console.log('Missing email or new password');
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!user) {
      console.log('Admin user not found for email:', email);
      return res.status(404).json({ message: 'Admin not found' });
    }

    user.password = newPassword;
    await user.save();
    console.log('Password reset successful for email:', email);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error in reset-password:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch all blogs for admin dashboard
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .lean();
    console.log('Fetched blogs:', blogs.map(blog => ({
      title: blog.title,
      categories: blog.categories,
      image: blog.image,
    })));
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch all users for admin dashboard
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('name email createdAt lastLogin')
      .lean();

    const usersWithBlogCount = await Promise.all(
      users.map(async (user) => {
        const blogCount = await Blog.countDocuments({ author: user._id });
        return {
          ...user,
          blogCount,
        };
      })
    );

    res.json(usersWithBlogCount);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch user login stats for admin dashboard
router.get('/user-logins', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching user login stats...');
    // Aggregate login counts by date (group by year, month, day)
    const loginStats = await User.aggregate([
      {
        $match: {
          lastLogin: { $ne: null }, // Only include users with a lastLogin date
          role: 'user', // Only include regular users
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$lastLogin' },
            month: { $month: '$lastLogin' },
            day: { $dayOfMonth: '$lastLogin' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day',
                },
              },
            },
          },
          count: 1,
          _id: 0,
        },
      },
    ]);

    console.log('User login stats fetched:', loginStats);
    res.json(loginStats);
  } catch (err) {
    console.error('Error fetching user login stats:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;