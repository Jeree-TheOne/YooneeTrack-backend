const ApiError = require('../Exceptions/ApiError');
const TokenService = require('../Services/TokenService');
const UserService = require('../Services/UserService')

class UserController {
  async changeData(req, res, next) {
    try {
      const { id } = TokenService.validateAccessToken(req.headers.authorization.split(' ')[1])
      const { login, firstName, lastName, isBlocked, isPremium } = req.body
      const data = await UserService.changeData(id, login, firstName, lastName, isBlocked, isPremium)
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }

  async changePassword(req, res, next) {
    try {
      const { id } = TokenService.validateAccessToken(req.headers.authorization.split(' ')[1])
      const { newPassword, oldPassword } = req.body
      if (newPassword === oldPassword) {
        next(ApiError.BadRequest('Новый пароль не должен совпадать со старым'))
      }
      const data = await UserService.changePassword(id, oldPassword, newPassword)
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()