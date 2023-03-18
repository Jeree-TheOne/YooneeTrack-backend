const bcrypt = require('bcrypt')
const uuid = require('uuid')
const EmailService = require('./EmailService')
const TokenService = require('./TokenService')
const ApiError = require('../Exceptions/ApiError')
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')

class UserService {
  async registration(email, password) {
    const candidate = await DatabaseMiddleware.select('user', [], {and: {email}})
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь c таким почтовым адресом ${email} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const activationLink = uuid.v4().toString()

    const user = await DatabaseMiddleware.insert('user', {
      id: activationLink,
      createdAt: Date.now(),
      login: email,
      password: hashPassword,
      email
    })

    EmailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

    return this.generateToken(user)
  }

  async login(login, password) {
    const user = await DatabaseMiddleware.select('user', [], {or: {email: login, login}})
    if (!user) {
      throw ApiError.BadRequest('Пользователя c таким логином не существует')
    }

    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Некорректный пароль')
    }

    delete user.password

    return this.generateToken(user)
  }

  async logout(refreshToken) {
    await TokenService.removeToken(refreshToken)
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.Unauthorized()
    }

    const userData = TokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await TokenService.tokenFromDb(refreshToken)

    if (!userData || !tokenFromDb) {
      throw ApiError.Unauthorized()
    }
    const userFromDb = await DatabaseMiddleware.select('user', [], {and: {id: userData.id}})
    delete userFromDb.password

    return this.generateToken(userFromDb)
  }

  async activate(activationLink) {
    const user = await DatabaseMiddleware.select('user', [], {and: {id: activationLink}})
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации')
    }

    await DatabaseMiddleware.update('user', {isActivated: true}, {and: {id: activationLink}})
  }

  async generateToken(user) {
    const tokens = TokenService.generateToken({...user})
    await TokenService.saveToken(user.id, tokens.refreshToken)

    return {
      ...tokens,
      user
    }
  }
}

module.exports = new UserService();