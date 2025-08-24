import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
import { unlinkSync } from "fs";
import generateToken from "../utils/generateToken.js";

// 📌 Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Get current logged-in user
const getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatarUrl: req.user.avatar || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load user profile" });
  }
};

// 📌 Get user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Search users by name
const searchUsers = async (req, res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, "i");
    const users = await User.find(name ? { name: regex } : {}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Upload/update avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      width: 300,
      height: 300,
      crop: "limit",
    });

    await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url });
    unlinkSync(req.file.path);

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  register,
  login,   // ✅ added
  getMe,
  getUser,
  searchUsers,
  uploadAvatar,
};
