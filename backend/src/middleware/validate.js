const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Middleware to check express-validator results.
 * Returns 422 with all validation errors if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new AppError(messages[0], 422));
  }
  next();
};

module.exports = validate;
