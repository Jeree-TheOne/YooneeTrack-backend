const ApiError = require('../Exceptions/ApiError');
const UserService = require('../Services/UserService')

class UserController {
  async changeData(req, res, next) {
    try {
      const { id } = req.user
      const { login, firstName, secondName, isBlocked, isPremium } = req.body
      const data = await UserService.changeData(id, login, firstName, secondName, isBlocked, isPremium)
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }

  async changePassword(req, res, next) {
    try {
      const { id } = req.user
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

  async removeAvatar(req, res, next) {
    const { id } = req.user
    try {
      await UserService.removeAvatar(id)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()