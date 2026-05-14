const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

/**
 * POST /api/auth/signup
 */
const signup = catchAsync(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  const { user, token } = await authService.registerUser({ fullName, email, password });

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: { user, token },
  });
});

/**
 * POST /api/auth/login
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    data: { user, token },
  });
});

/**
 * GET /api/auth/me
 */
const getMe = catchAsync(async (req, res, next) => {
  const user = await authService.getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

module.exports = { signup, login, getMe };
