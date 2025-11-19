const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Default error status and message
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = err.message;
    } else if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'Unauthorized access';
    } else if (err.name === 'ForbiddenError') {
        status = 403;
        message = 'Access forbidden';
    } else if (err.name === 'NotFoundError') {
        status = 404;
        message = 'Resource not found';
    }

    // Send error response
    res.status(status).json({
        success: false,
        error: {
            message,
            status,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = {
    errorHandler
}; 