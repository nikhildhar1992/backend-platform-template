/*
 Global error handler
*/
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    logger.error({
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl
    });
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  
};
  
module.exports = errorHandler;
  