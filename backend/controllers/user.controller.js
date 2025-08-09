import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt-quizCraft", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true, 
    sameSite: "strict", 
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};



export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please add all fields' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    await user.save();

    generateToken(user._id, res);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    generateToken(user._id, res);

    res.status(200).json({
        message: 'User logged in successfully',
        user:{
        _id: user._id,
        name: user.name,
        email: user.email,
    }});


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
    if (!req.cookies || !req.cookies.jwt) {
      return res.status(400).json({ message: "User not logged in" });
    }

    res.clearCookie("jwt-quizCraft", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};