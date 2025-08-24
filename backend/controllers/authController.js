// controllers/authController.js
import User from '../models/User.js';
import TherapistProfile from '../models/TherapistProfile.js';
import generateToken from '../utils/jwtUtils.js';

// ✅ Register User (patient, therapist, admin if needed)
export async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      role = 'patient',
      language = 'English',
      license,
      specialization,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, email, and password are required' });
    }

    // check existing user
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // create new user
    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role,
      language,
    };

    if (role === 'therapist') {
      userData.license = license || '';
      userData.specialization = specialization || '';
    }

    const user = await User.create(userData);

    // 🔥 create therapist profile if role is therapist
    if (role === 'therapist') {
      await TherapistProfile.create({
        userId: user._id,
        license: license || '',
        specialization: specialization || '',
        languages: [language || 'English'],
      });
    }

    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('❌ Register Error:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
}

// ✅ Unified Login for all roles (default route)
export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: 'Unauthorized role access' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
}

// ✅ Admin-specific login (only used in /auth/admin/login)
export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Admin not found or invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('❌ Admin Login Error:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
}
