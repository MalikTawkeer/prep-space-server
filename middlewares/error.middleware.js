/**
 * Global Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Mongoose / MongoDB duplicate key error (code 11000)
  if (err.code === 11000 || err.name === 'MongoBulkWriteError') {
    let field = 'field';
    let val = '';
    if (err.keyValue) {
      field = Object.keys(err.keyValue)[0] || 'field';
      val = err.keyValue[field] !== undefined ? ` ("${err.keyValue[field]}")` : '';
    } else if (err.keyPattern) {
      field = Object.keys(err.keyPattern)[0] || 'field';
    } else if (err.writeErrors && err.writeErrors[0]?.err?.keyValue) {
      field = Object.keys(err.writeErrors[0].err.keyValue)[0] || 'field';
    }

    const isUserAuth = req.originalUrl.includes('/auth') || req.originalUrl.includes('/users');
    const message = isUserAuth
      ? `An account with that ${field} already exists.`
      : `Duplicate value conflict: a record with ${field}${val} already exists in the database.`;

    return res.status(400).json({
      success: false,
      message,
      field,
      detail: err.message,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // CastError (e.g. invalid MongoDB ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Resource not found with id ${err.value}`,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
