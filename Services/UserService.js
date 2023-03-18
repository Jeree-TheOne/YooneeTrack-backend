const ApiError = require('../Exceptions/ApiError')
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')
const { removeEmpty } = require('../utils/dataFormatter')
const { generateToken } = require('./AuthService')
const bcrypt = require('bcrypt')


class UserService {
  async changeAvatar(id, imageId) {
    const user = await DatabaseMiddleware.update('user', { image: imageId }, { and: { id } })
    delete user.password
    return user
  }

  async changeData(id, login, firstName, secondName, isBlocked, isPremium) {
    try {
      const user = await DatabaseMiddleware.update('user', removeEmpty({ login, firstName, secondName, isBlocked, isPremium }), { and: { id } })
      delete user.password
      return generateToken(user)
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }

  async changePassword(id, oldPassword, newPassword) {
    try {
      const { password } = await DatabaseMiddleware.select('user', ['password'], {and: {id}})
      const isPassEquals = await bcrypt.compare(oldPassword, password)
      if (!isPassEquals) {
        throw ApiError.BadRequest('Неверный старый пароль')
      }

      const hashNewPassword = await bcrypt.hash(newPassword, 10)
      const user = await DatabaseMiddleware.update('user', { password: hashNewPassword}, { and: { id}})
      delete user.password
      return generateToken(user)

    } catch (err) {
      throw ApiError.BadRequest()
    }
  }
}

module.exports = new UserService()