const ApiError = require('../Exceptions/ApiError')
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')
const { removeEmpty } = require('../utils/dataFormatter')
const { generateToken } = require('./AuthService')
const bcrypt = require('bcrypt')


class UserService {
  async changeAvatar(id, image_id) {
    await DatabaseMiddleware.update('user', { image: image_id }, { and: { id } })
    const user = await DatabaseMiddleware.select('user', ['user.id as id', 'user.password', 'user.email', 'user.login', 'user.created_at as created_at', 'user.first_name', 'user.second_name', 'file.path as avatar', 'user.is_blocked', 'user.is_premium', 'user.is_activated'], {where: {and: {'user.id': id}}},
    {
      file: ['id', 'user.image']
    })
    return generateToken(user)
  }

  async changeData(id, login, first_name, second_name, is_blocked, is_premium) {
    try {
      console.log(login, first_name, second_name);
      await DatabaseMiddleware.update('user', removeEmpty({ login, first_name, second_name, is_blocked, is_premium }), { and: { id } })
      const user = await DatabaseMiddleware.select('user', ['user.id as id', 'user.password', 'user.email', 'user.login', 'user.created_at as created_at', 'user.first_name', 'user.second_name', 'file.path as avatar', 'user.is_blocked', 'user.is_premium', 'user.is_activated'], {where: {and: {'user.id': id}}},
      {
        file: ['id', 'user.image']
      })
      return generateToken(user)
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }

  async changePassword(id, oldPassword, newPassword) {
    try {
      const { password } = await DatabaseMiddleware.select('user', ['password'], {where: {and: {id}}})
      const isPassEquals = await bcrypt.compare(oldPassword, password)
      if (!isPassEquals) {
        throw ApiError.BadRequest('Неверный старый пароль')
      }

      const hashNewPassword = await bcrypt.hash(newPassword, 10)
      await DatabaseMiddleware.update('user', { password: hashNewPassword}, { and: { id}})
      const user = await DatabaseMiddleware.select('user', ['user.id as id', 'user.password', 'user.email', 'user.login', 'user.created_at as created_at', 'user.first_name', 'user.second_name', 'file.path as avatar', 'user.is_blocked', 'user.is_premium', 'user.is_activated'], {where: {and: {'user.id': id}}},
      {
        file: ['id', 'user.image']
      })
      return generateToken(user)
    } catch (err) {
      throw ApiError.BadRequest()
    }
  }

  async removeAvatar(id) {
    try {
      await DatabaseMiddleware.select('user', ['image'], {where:{ and: { id }}})
      await DatabaseMiddleware.update('user', { image: 'null' }, { and: { id }}, ['image'])
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }
}

module.exports = new UserService()