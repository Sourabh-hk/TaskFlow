const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

/**
 * Register a new user
 */
const registerUser = async ({ fullName, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Email address is already registered.', 409);
  }

  const user = await User.create({ fullName, email, password });
  const token = generateToken({ id: user.id, email: user.email });

  return { user, token };
};

/**
 * Authenticate user by email and password
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken({ id: user.id, email: user.email });
  return { user, token };
};

/**
 * Get current user by ID
 */
const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

module.exports = { registerUser, loginUser, getCurrentUser };
