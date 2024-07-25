const customErrorHandler = (err, req, res, next) => {
    console.log(err.message || 'Internal Server Error')
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
}

module.exports = customErrorHandler