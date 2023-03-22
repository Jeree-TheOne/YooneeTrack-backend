const ApiError = require('../Exceptions/ApiError')
const TokenService = require('../Services/TokenService')
const MemberService = require('../Services/MemberService')

module.exports = async function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    const workspace = req.headers.workspace

    if (!authorizationHeader) {
      return next(ApiError.Unauthorized())
    }

    const userData = TokenService.validateAccessToken(authorizationHeader)
    if (!userData) {
      return next(ApiError.Unauthorized())
    }

    const isWorkspaceAvailable = await MemberService.isWorkspaceAvailable(userData.id, workspace)
    if (isWorkspaceAvailable) req.workspace = workspace
    req.user = userData
    next()

  } catch (e) {
    return next(ApiError.Unauthorized())
  }
}