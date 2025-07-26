const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { name, email, password, dateOfBirth } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password, dateOfBirth, role: 'user' });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user: { id: user._id.toString(), name, email, role: user.role, dateOfBirth } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  try {
    const user = await User.findOne({ email, role: 'user' });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    console.log('Login successful for:', user.email);
    const token = user.generateAuthToken();
    res.json({
      message: 'Login successful',
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, dateOfBirth: user.dateOfBirth },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password -totpSecret');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email, dateOfBirth } = req.body;
  try {
    const user = await User.findOne({ email, dateOfBirth });
    if (!user) {
      return res.status(400).json({ message: 'Email and date of birth do not match' });
    }
    res.json({ message: 'Verification successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:email/reset-password', async (req, res) => {
  const { newPassword } = req.body;
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    res.json({ 
      message: 'Profile updated successfully',
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        dateOfBirth: user.dateOfBirth 
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own password' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/:id/verify-password', authMiddleware, async (req, res) => {
  const { password } = req.body;
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'You can only verify your own password' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    
    res.json({ message: 'Password verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add login stats route that redirects to admin route
router.get('/login-stats', async (req, res) => {
  try {
    // Redirect to admin route or return empty data for now
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;