/**
 * Wraps an async route handler to automatically catch errors and forward to next()
 * @param {Function} fn - async route handler
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
