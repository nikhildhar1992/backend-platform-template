export function successResponse(res, data = null, message = "Success", meta = null, status = 200) {

    return res.status(status).json({
      success: true,
      message,
      data,
      meta
    });
  
  }
  
  export function errorResponse(res, message = "Error", status = 500) {
  
    return res.status(status).json({
      success: false,
      message
    });
  
  }