// utils/jwtUtils.js
import pkg from 'jsonwebtoken';

const { sign } = pkg;

/**
 * Generate JWT token for a given user ID.
 * @param {string} id - MongoDB ObjectId of the user
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token valid for 30 days
  });
};

export default generateToken;
