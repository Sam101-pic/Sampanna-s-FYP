// controllers/adminController.js
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

// ✅ Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ✅ Delete user by ID
export async function deleteUser(req, res) {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ✅ Get all appointments
export async function getAllAppointments(req, res) {
  try {
    const appointments = await Appointment.find({});
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
