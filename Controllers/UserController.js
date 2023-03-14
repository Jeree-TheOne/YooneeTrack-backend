const UserService = require('../Services/UserService')
const {validationResult} = require('express-validator')
const ApiError = require('../Exceptions/ApiError')

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации данных', errors.array()))
      }

      const {email, password} = req.body
      const userData = await UserService.registration(email, password)
      res.cookie('refresh-token', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации данных', errors.array()))
      }

      const {login, password} = req.body
      const userData = await UserService.login(login, password)
      res.cookie('refresh-token', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      await UserService.logout(req.cookies['refresh-token'])
      res.clearCookie('refresh-token')
      res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await UserService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const userData = await UserService.refresh(req.cookies['refresh-token'])
      res.cookie('refresh-token', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      res.json(['123', 'users'])
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController();