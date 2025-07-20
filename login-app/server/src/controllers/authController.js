import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};