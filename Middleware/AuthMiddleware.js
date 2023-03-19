const ApiError = require('../Exceptions/ApiError')
const TokenService = require('../Services/TokenService')

module.exports = function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      return next(ApiError.Unauthorized())
    }

    const userData = TokenService.validateAccessToken(authorizationHeader)
    if (!userData) {
      return next(ApiError.Unauthorized())
    }

    req.user = userData
    next()

  } catch (e) {
    return next(ApiError.Unauthorized())
  }
}