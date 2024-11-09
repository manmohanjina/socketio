
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User=require('../model/userSchema')

const signup=express.Router()
signup.post('/signup', async (req, res) => {
  const { username, password, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 1);
    const user = new User({ username, password: hashedPassword, isAdmin });
    await user.save();
    res.status(201).send('User created');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

signup.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = signup;
