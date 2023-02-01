const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = async (err, req, res, next) => {
  let CustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  }

  return res.status(CustomError.statusCode).json({ msg: CustomError.msg })
}

module.exports = errorHandlerMiddleware
